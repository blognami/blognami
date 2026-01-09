import { execSync, spawn } from 'child_process';

export default {
  meta() {
    this.addHook('beforeServerStart', 'startStripeForwarding');
  },

  async startStripeForwarding() {
    const secretKey = process.env.STRIPE_API_KEY;
    if (!secretKey) {
      console.log('STRIPE_API_KEY not set, skipping Stripe forwarding');
      return;
    }

    const isMultiTenant = process.env.TENANCY === 'multi';

    // Get webhook secret
    const webhookSecret = execSync('stripe listen --print-secret', { encoding: 'utf8' }).trim();

    // Store in main database
    await this.runInNewWorkspace(async function() {
      await this.database.stripe.update({ secretKey, webhookSecret });
    });

    // Store in portal database if multi-tenant
    if (isMultiTenant) {
      await this.runInNewPortalWorkspace(async function() {
        await this.database.stripe.update({ secretKey, webhookSecret });
      });
    }

    // Start forwarding processes (non-blocking)
    const processes = [];

    const mainProcess = spawn('stripe', [
      'listen', '--forward-to', 'localhost:3000/_actions/guest/stripe_webhook'
    ], { stdio: 'inherit' });
    processes.push(mainProcess);

    if (isMultiTenant) {
      const portalProcess = spawn('stripe', [
        'listen', '--forward-to', 'localhost:3001/_actions/guest/stripe_webhook'
      ], { stdio: 'inherit' });
      processes.push(portalProcess);
    }

    console.log('Stripe forwarding started');

    // Cleanup on exit
    const cleanup = () => {
      processes.forEach(p => p.kill());
      process.exit(0);
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  }
};
