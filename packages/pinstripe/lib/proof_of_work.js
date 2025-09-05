
import crypto from 'crypto'; // pinstripe-if-client: const crypto = window.crypto;

import { Class } from './class.js';
import { Singleton } from './singleton.js';

const HASH_CASH_TARGET = Math.pow(2, 32 - 20);
const DEFAULT_DIFFICULTY = 1 / 20;
const DEFAULT_EXPIRY_IN_SECONDS = 10 * 60;

export const ProofOfWork = Class.extend().include({
    meta(){
        this.include(Singleton)
    },

    async generateProofOfWork(input, options = {}){
        const { difficulty = DEFAULT_DIFFICULTY, steps = 1000, onProgress = () => {}, abortSignal = { aborted: false } } = options;
        const inputHash = await this.createSha1Hash(JSON.stringify(input));
        const salt = await this.createSha1Hash(Math.random());
        const timestamp = Math.floor(Date.now() / 1000);
        const target = this.calculateTarget(difficulty, steps);
        const solution = [];
        
        let counter = -1;
        for(let i = 1; i <= steps && !abortSignal.aborted; i++){
            while(!abortSignal.aborted){
                counter++;
                const hash = await this.createSha1Hash(`${difficulty}:${steps}:${inputHash}:${salt}:${timestamp}:${counter}`);
                const integers = this.hexToIntegers(hash);
                if(integers[0] <= target) break;
            }
            solution.push(counter);
            const progressPercentage = Math.floor(i * (100 / steps) * 100) / 100;
            onProgress(progressPercentage);
        }

        if(abortSignal.aborted) return;

        return JSON.stringify({
            salt,
            timestamp,
            solution,
        });
    },

    async verifyProofOfWork(input, proofOfWork, options = {}){
        const { difficulty = DEFAULT_DIFFICULTY, expiryInSeconds = DEFAULT_EXPIRY_IN_SECONDS } = options;
        const { salt, timestamp, solution } = JSON.parse(proofOfWork);
        if(Math.floor(Date.now() / 1000) - timestamp > expiryInSeconds) return false;
        const steps = solution.length;
        if(typeof steps !== 'number' || steps <= 0) return false;
        const inputHash = await this.createSha1Hash(JSON.stringify(input));
        const target = this.calculateTarget(difficulty, steps);
        for(let i = 0; i < steps; i++){
            const counter = solution[i];
            const hash = await this.createSha1Hash(`${difficulty}:${steps}:${inputHash}:${salt}:${timestamp}:${counter}`.toString(), true);
            const integers = this.hexToIntegers(hash);
            if(integers[0] > target) return false;
        }
        return true;
    },

    async createSha1Hash(input) {
        const buffer = new TextEncoder().encode(input);
        const hashArray = Array.from(new Uint8Array(await this.crypto.subtle.digest('SHA-1', buffer)));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    hexToIntegers(hex){
        const out = [];
        for(let i = 0; i < hex.length; i += 8){
            out.push(parseInt(hex.slice(i, i + 8), 16));
        }
        return out;
    },
    
    calculateTarget(difficulty, steps){
        return (HASH_CASH_TARGET / difficulty) * steps;
    },

    crypto,
});

export const generateProofOfWork = (...args) => ProofOfWork.instance.generateProofOfWork(...args);
  
export const verifyProofOfWork = (...args) => ProofOfWork.instance.verifyProofOfWork(...args);
