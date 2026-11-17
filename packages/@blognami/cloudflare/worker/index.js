
// The Cloudflare Worker's entry point and its Durable Object. They sit outside lib, so the walk never imports them on Node.

import { Job, Workspace, STATIC_ASSET_HEADER } from 'blognami';

const OBJECT_NAME = 'blognami';
const OBJECT_BINDING = 'BLOGNAMI';
const ASSETS_BINDING = 'ASSETS';
// The binding routes on the path alone; the host is never resolved.
const ASSETS_ORIGIN = 'http://assets.invalid';
// In the object's key-value storage and not a table, as a table would be a migration every Node blog also ran.
const LAST_RUN_KEY = 'lastAlarmRun';

export class BlognamiDurableObject {
    constructor(ctx, env){
        this.ctx = ctx;
        this.env = env;
    }

    buildBindings(){
        return { ...this.env, DATABASE: this.ctx.storage };
    }

    // One promise, so concurrent first requests wait on one migration run; the seed only on an
    // empty database, so a restart does not seed twice.
    prepareSchema(){
        if(!this.schemaPromise){
            const _cloudflare = this.buildBindings();
            this.schemaPromise = Workspace.run(async function(){
                this.initialParams._cloudflare = _cloudflare;
                const isEmpty = !await this.database.table('appliedMigrations').exists;
                await this.runCommand('migrate-database');
                if(isEmpty) await this.runCommand('seed-database');
            });
        }
        return this.schemaPromise;
    }

    // One promise, so an isolate reads the alarm once; an object that lost its alarm arms again here.
    armAlarm(){
        if(!this.alarmPromise){
            const { storage } = this.ctx;
            this.alarmPromise = Workspace.run(async function(){
                if(await storage.getAlarm() !== null) return;
                const nextOccurrence = this.jobSchedule.findNextOccurrence(Date.now());
                if(nextOccurrence !== undefined) await storage.setAlarm(nextOccurrence);
            });
        }
        return this.alarmPromise;
    }

    async fetch(request){
        try {
            await this.prepareSchema();
            await this.armAlarm();
            const _cloudflare = this.buildBindings();
            const { storage } = this.ctx;
            const [ status, headers, body ] = await Workspace.run(async function(){
                const response = await this.callHandler.handleCall({
                    ...(await this.serviceWorker.extractParams(request)),
                    // Last, as `_method`, `_url` and `_headers` are, so a request cannot shadow it.
                    _cloudflare
                });
                // A job the request queued runs in an alarm run straight after the response, not in the request.
                if(this.jobQueue.length !== 0) await storage.setAlarm(Date.now());
                return response;
            });
            // A Blob of the chunks, as joining them as text would mangle a chunk of bytes.
            return new Response(Array.isArray(body) ? new Blob(body) : String(body), { status, headers });
        } catch (e){
            const error = (e.stack || e).toString();
            console.error(error);
            return new Response(error, { status: 500, headers: { 'content-type': 'text/plain' } });
        }
    }

    async alarm(){
        // An alarm can be the first thing a new isolate runs.
        await this.prepareSchema();
        const { storage } = this.ctx;
        const now = Date.now();
        // Now with none stored, so a first run finds nothing due.
        const lastRun = await storage.get(LAST_RUN_KEY) ?? now;
        const { dueJobs, nextOccurrence } = await Workspace.run(async function(){
            return {
                dueJobs: this.jobSchedule.findDueJobs(lastRun, now),
                nextOccurrence: this.jobSchedule.findNextOccurrence(now)
            };
        });

        // Both before any job runs, so a run Cloudflare cuts off and retries finds nothing due,
        // and a job cannot leave the object with no alarm.
        await storage.put(LAST_RUN_KEY, now);
        if(nextOccurrence !== undefined) await storage.setAlarm(nextOccurrence);

        const _cloudflare = this.buildBindings();
        await Workspace.run(async function(){
            let job;
            // The due jobs, then the queue until it is empty, as a job or a request can push onto it meanwhile.
            while(job = dueJobs.shift() || this.jobQueue.shift()){
                // Logged and dropped, as the job worker does on Node: an error leaving alarm() would
                // have Cloudflare retry the run, and the jobs before it run twice.
                try {
                    await Job.run(job.name, { ...job.params, _cloudflare });
                } catch(e){
                    console.error(e);
                }
            }
        });
    }
}

export default {
    async fetch(request, env){
        const namespace = env[OBJECT_BINDING];
        const response = await namespace.get(namespace.idFromName(OBJECT_NAME)).fetch(request);

        const storedPath = response.headers.get(STATIC_ASSET_HEADER);
        if(storedPath === null) return response;

        // A new request holding only the stored path, so the binding always answers the whole file.
        const asset = await env[ASSETS_BINDING].fetch(new Request(new URL(`/${storedPath}`, ASSETS_ORIGIN)));
        if(!asset.ok) return new Response(`Static asset not found: ${storedPath}`, { status: 500, headers: { 'content-type': 'text/plain' } });

        const headers = new Headers(response.headers);
        headers.delete(STATIC_ASSET_HEADER);
        return new Response(asset.body, { status: response.status, headers });
    }
};
