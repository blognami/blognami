---
menus:
    sidebar: ["Services", "sendMail"]
---
# sendMail

Send emails with template support.

## Interface

```javascript
await this.sendMail(options)
```

### Parameters

- **to** - Recipient email address
- **from** - Sender address (or use config default)
- **subject** - Email subject line
- **text** - Plain text body (string or template function)
- **html** - HTML body (string or template function)

## Description

The `sendMail` service sends emails using either a dummy adapter (development) or SMTP (production). Template functions are rendered using `renderText` helpers.

## Configuration

```javascript
// pinstripe.config.js
export default {
    mail: {
        // Development
        adapter: 'dummy',
        defaults: { from: 'noreply@example.com' }

        // Production
        // adapter: 'smtp',
        // host: 'smtp.example.com',
        // port: 465,
        // secure: true,
        // auth: { user: 'user', pass: 'pass' }
    }
};
```

## Examples

### Basic Email

```javascript
await this.sendMail({
    to: 'user@example.com',
    subject: 'Welcome!',
    text: 'Thank you for signing up.'
});
```

### Email with Template

```javascript
await this.sendMail({
    to: user.email,
    subject: 'Account Created',
    text: ({ line }) => {
        line(`Hello ${user.name},`);
        line();
        line('Your account has been successfully created.');
        line();
        line('Best regards,');
        line('The Team');
    }
});
```

### One-Time Password

```javascript
const password = await user.generatePassword();

await this.sendMail({
    to: email,
    subject: 'Your one-time-password',
    text: ({ line }) => {
        line(`Your one-time-password: "${password}"`);
        line('This will be valid for approximately 3 minutes.');
    }
});
```

### Form Success Handler

```javascript
this.renderForm(this.database.contacts, {
    fields: ['name', 'email', 'message'],
    success: async ({ name, email, message }) => {
        await this.sendMail({
            to: email,
            subject: 'Thank you for contacting us',
            text: ({ line }) => {
                line(`Dear ${name},`);
                line();
                line('Thank you for your message.');
            }
        });
        return this.renderRedirect({ url: '/thank-you' });
    }
})
```

## Notes

- Dummy adapter logs to console in development, silent in test
- SMTP adapter uses nodemailer for production emails
- Template functions receive `line()`, `indent()`, `echo()` helpers
- Use `this.runInNewWorkspace()` for non-blocking email delivery
