---
sidebar:
    category: ["Services", "sendMail"]
---
# sendMail Service

## Description

The `sendMail` service provides email functionality for Pinstripe applications. It supports multiple email adapters (dummy for development/testing and SMTP for production) and integrates seamlessly with the `renderText` service for generating email content. The service handles email normalization, template rendering, and background processing.

## Interface

The service creates an async function that accepts a mail options object:

```javascript
await this.sendMail(mailOptions)
```

### Parameters

- **`mailOptions`** (object) - Configuration object for the email

#### MailOptions Properties

- **`to`** (string) - Recipient email address
- **`from`** (string, optional) - Sender email address (can be set via config defaults)
- **`subject`** (string) - Email subject line
- **`text`** (string | function | Promise) - Plain text email body
- **`html`** (string | function | Promise) - HTML email body  
- **`cc`** (string | array, optional) - Carbon copy recipients
- **`bcc`** (string | array, optional) - Blind carbon copy recipients
- **`replyTo`** (string, optional) - Reply-to email address
- **`attachments`** (array, optional) - Email attachments (SMTP only)

### Content Rendering

Both `text` and `html` properties support:
- **String values**: Direct content
- **Function values**: Automatically rendered using `renderText` service
- **Promise values**: Resolved before sending

### Return Value

Returns a `Promise` that resolves when the email is processed (sent via SMTP or logged via dummy adapter).

## Configuration

The service is configured via the `mail` section in `pinstripe.config.js`:

### Dummy Adapter (Development/Testing)
```javascript
export default {
    mail: {
        adapter: 'dummy',
        defaults: {
            from: 'noreply@example.com'
        }
    }
};
```

### SMTP Adapter (Production)
```javascript
export default {
    mail: {
        adapter: 'smtp',
        host: 'smtp.example.com',
        port: 465,
        secure: true,
        auth: {
            user: 'username',
            pass: 'password'
        },
        defaults: {
            from: 'noreply@example.com'
        }
    }
};
```

## Examples

### Basic Email

```javascript
// Simple text email
await this.sendMail({
    to: 'user@example.com',
    subject: 'Welcome!',
    text: 'Thank you for signing up.'
});
```

### Email with Text Function

```javascript
// Use renderText function for dynamic content
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

### One-Time Password Email

```javascript
// Send authentication email with OTP
const password = await user.generatePassword();

await this.sendMail({
    to: email,
    subject: 'Your one-time-password',
    text: ({ line }) => {
        line(`Your one-time-password: "${password}" - this will be valid for approximately 3 mins.`);
    }
});
```

### Notification Email with Multiple Items

```javascript
// Send notification digest
await this.sendMail({
    subject: `${site.title}: ${notifications.length} new notification${notifications.length == 1 ? '' : 's'}`,
    text: async ({ line }) => {
        line(`Hello ${user.name},`);
        line();
        line(`You have ${notifications.length} new notification${notifications.length == 1 ? '' : 's'}.`);
        
        for(let notification of notifications) {
            line();
            line('---');
            line();
            line(notification.body);
        }
        
        line();
        line('---');
        line();
    }
});
```

### Background Email Processing

```javascript
// Send email without blocking the main request flow
export default {
    async signInUser(email) {
        const user = await this.database.users.where({ email }).first();
        
        // Send welcome email in background
        this.runInNewWorkspace(({ sendMail }) => sendMail({ 
            to: email,
            subject: 'Welcome!',
            text: ({ line }) => {
                line('Welcome to our platform!');
                line();
                line('We\'re excited to have you on board.');
            }
        }));
        
        // Continue with main flow immediately
        return this.renderRedirect({ url: '/dashboard' });
    }
};
```

### HTML and Text Email

```javascript
// Send multipart email with both HTML and text versions
await this.sendMail({
    to: customer.email,
    subject: 'Order Confirmation',
    text: ({ line, indent }) => {
        line('Dear Customer,');
        line();
        line('Thank you for your recent order. Here are the details:');
        line();
        indent(({ line }) => {
            line(`Order ID: ${order.id}`);
            line(`Date: ${order.date}`);
            line(`Total: $${order.total}`);
        });
        line();
        line('Best regards,');
        line('The Team');
    },
    html: ({ line, indent }) => {
        line('<h2>Order Confirmation</h2>');
        line('<p>Dear Customer,</p>');
        line('<p>Thank you for your recent order. Here are the details:</p>');
        line('<ul>');
        indent(({ line }) => {
            line(`<li>Order ID: ${order.id}</li>`);
            line(`<li>Date: ${order.date}</li>`);
            line(`<li>Total: $${order.total}</li>`);
        });
        line('</ul>');
        line('<p>Best regards,<br>The Team</p>');
    }
});
```

### User Model Integration

```javascript
// User model with sendMail method
export default {
    async sendMail(options = {}) {
        await this.workspace.sendMail({
            ...options,
            to: this.email  // Automatically set recipient
        });
    },

    async deliverNotifications({ force = false } = {}) {
        if(!force && !this.readyToDeliverNotifications) return;
        
        const site = await this.database.site;
        const notifications = await this.notifications.orderBy('createdAt').all();
        
        if(notifications.length == 0) return;
        
        await this.sendMail({
            subject: `${site.title}: ${notifications.length} new notification${notifications.length == 1 ? '' : 's'}`,
            text: async ({ line }) => {
                line(`Hello ${this.name},`);
                line();
                line(`You have ${notifications.length} new notification${notifications.length == 1 ? '' : 's'}.`);
                
                for(let notification of notifications) {
                    line();
                    line('---');
                    line();
                    line(notification.body);
                    await notification.delete();
                }
            }
        });
    }
};
```

### Form Success Handler

```javascript
// Send email on form submission
export default {
    render() {
        return this.renderForm(
            this.createModel({
                meta() {
                    this.mustNotBeBlank('email');
                    this.mustBeAValidEmail('email');
                }
            }),
            {
                title: 'Contact Form',
                fields: [
                    { name: 'name', label: 'Your Name' },
                    { name: 'email', label: 'Your Email' },
                    { name: 'message', type: 'textarea', label: 'Message' }
                ],
                success: async ({ name, email, message }) => {
                    // Send confirmation to user
                    await this.sendMail({
                        to: email,
                        subject: 'Thank you for contacting us',
                        text: ({ line }) => {
                            line(`Dear ${name},`);
                            line();
                            line('Thank you for your message. We will get back to you soon.');
                            line();
                            line('Your message:');
                            line(`"${message}"`);
                        }
                    });
                    
                    return this.renderRedirect({ url: '/thank-you' });
                }
            }
        );
    }
};
```

## Adapter Behavior

### Dummy Adapter
- **Development/Testing**: Logs email content to console instead of sending
- **Test Environment**: Silent (no output) when `NODE_ENV === 'test'`
- **Output Format**: Formatted console output with headers, text, and HTML content
- **No Network**: No external dependencies or network calls

### SMTP Adapter  
- **Production**: Uses nodemailer to send actual emails via SMTP
- **Transport**: Creates persistent SMTP connection
- **Authentication**: Supports various SMTP authentication methods
- **Features**: Full email features including attachments, CC/BCC, etc.

## Common Use Cases

### Authentication & Security
- **One-time passwords**: Temporary login codes
- **Password resets**: Secure account recovery
- **Account verification**: Email address confirmation
- **Security alerts**: Login notifications and suspicious activity

### User Communication
- **Welcome messages**: New user onboarding
- **Notifications**: Activity updates and alerts  
- **Newsletters**: Periodic updates and announcements
- **Transactional emails**: Order confirmations, receipts

### System Integration
- **Background processing**: Non-blocking email delivery
- **Bulk operations**: Notification digests and batch emails
- **Template rendering**: Dynamic content generation
- **Error reporting**: System alerts and monitoring

## Performance Notes

- **Async Processing**: All email operations are asynchronous
- **Background Support**: Use with `runInNewWorkspace` for non-blocking delivery
- **Template Rendering**: Integrates with `renderText` for dynamic content
- **Connection Pooling**: SMTP adapter maintains persistent connections
- **Memory Efficient**: Content is streamed rather than buffered
- **Error Handling**: Graceful degradation in development vs production

## Error Handling

The service throws errors for:
- **Invalid adapter**: Unknown mail adapter configuration
- **SMTP failures**: Network or authentication issues (production only)
- **Missing configuration**: Required SMTP settings not provided
- **Template errors**: Failures in content rendering functions

In development with dummy adapter, errors are logged but don't interrupt application flow.