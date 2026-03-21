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

    // Get webhook secret
    const webhookSecret = execSync('stripe listen --print-secret', { encoding: 'utf8' }).trim();

    // Store in main database
    await this.database.stripe.update({ secretKey, webhookSecret });

    // Start forwarding process (non-blocking)
    const mainProcess = spawn('stripe', [
      'listen', '--forward-to', 'localhost:3000/_actions/guest/stripe_webhook'
    ], { stdio: 'inherit' });

    console.log('Stripe forwarding started');

    // Cleanup on exit
    const cleanup = () => {
      mainProcess.kill();
      process.exit(0);
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    await this.database.destroy();
  }
};
