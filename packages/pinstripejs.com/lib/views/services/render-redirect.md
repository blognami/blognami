---
sidebar:
    category: ["Services", "renderRedirect"]
---
# renderRedirect Service

The `renderRedirect` service provides a declarative way to perform redirects in Pinstripe applications using custom web components. It generates `pinstripe-redirect` tags that are processed by the client-side framework to perform navigation.

## Interface

The service creates a function that accepts an attributes object:

```javascript
this.renderRedirect(attributes)
```

### Parameters

- **`attributes`** (object, optional) - Configuration object containing redirect parameters. Defaults to `{}`.

### Common Attributes

- **`url`** (string) - The URL to redirect to. Can be relative (`/dashboard`) or absolute (`https://example.com`)
- **`target`** (string) - The redirect target context:
  - `'_top'` - Redirect the entire page
  - `'_parent'` - Redirect the parent frame/overlay
  - `'_overlay'` - Redirect within overlay context

### Return Value

Returns an `Html` instance containing a `<pinstripe-redirect>` tag that:
- Can be converted to an HTTP response with `toResponseArray()`
- Integrates with the Pinstripe client-side navigation system
- Triggers redirect behavior when rendered in the browser

## Description

The `renderRedirect` service is built on top of the `renderTag` service and generates `pinstripe-redirect` custom elements that:

1. **Provides declarative redirects** without requiring imperative JavaScript navigation
2. **Supports multiple redirect contexts** through the `target` attribute
3. **Integrates with overlay systems** for context-aware navigation
4. **Works with form submissions** to redirect after successful operations
5. **Handles client-server synchronization** by working in both environments
6. **Enables conditional redirects** based on authentication, permissions, or business logic

The service is commonly used in form success handlers, authentication flows, and action responses where navigation needs to occur after processing.

## Examples

### Basic URL Redirect

```javascript
// Simple redirect to a path
export default {
    async render() {
        if (await this.isSignedOut) {
            return this.renderRedirect({ url: '/login' });
        }
        return this.renderView('dashboard');
    }
}
```

### Page-Level Redirects

```javascript
// Redirect the entire page (most common)
export default {
    async render() {
        await this.processUserLogout();
        return this.renderRedirect({ target: '_top' });
    }
}
```

### Overlay Context Redirects

```javascript
// Redirect within an overlay/modal context
export default {
    async render() {
        const user = await this.database.users.insert(this.params);
        return this.renderRedirect({ 
            url: `/users/${user.id}`,
            target: '_parent' 
        });
    }
}
```

### Form Success Redirects

```javascript
// Redirect after successful form submission
export default {
    render() {
        return this.renderForm(this.database.posts, {
            fields: ['title', 'content'],
            success: ({ id }) => {
                return this.renderRedirect({
                    url: `/posts/${id}`,
                    target: '_top'
                });
            }
        });
    }
}
```

### Conditional Authentication Redirects

```javascript
// Redirect based on authentication state
export default {
    async render() {
        if (await this.isSignedOut) {
            const returnUrl = encodeURIComponent(this.params._url.pathname);
            return this.renderRedirect({
                url: `/_actions/guest/sign_in?returnUrl=${returnUrl}`
            });
        }
        
        return this.renderView('protected-content');
    }
}
```

### HTTP Response Integration

```javascript
// Convert redirect to HTTP response with custom headers
export default {
    async render() {
        const session = await this.createUserSession();
        
        const [status, headers, body] = this.renderRedirect({ 
            target: '_top' 
        }).toResponseArray();
        
        // Add session cookie
        headers['Set-Cookie'] = `pinstripeSession=${session.id}:${session.passString}`;
        
        return [status, headers, body];
    }
}
```

### Dynamic URL Construction

```javascript
// Build redirect URLs dynamically
export default {
    async render() {
        const { action, id } = this.params;
        
        if (action === 'delete') {
            await this.database.posts.where({ id }).delete();
            return this.renderRedirect({ url: '/posts' });
        }
        
        if (action === 'publish') {
            await this.database.posts.where({ id }).update({ published: true });
            return this.renderRedirect({ url: `/posts/${id}` });
        }
        
        return this.renderView('post-actions', { id });
    }
}
```

### Multi-Step Form Workflows

```javascript
// Navigate through multi-step processes
export default {
    async render() {
        const { step, data } = this.params;
        
        if (step === '1') {
            // Process step 1, redirect to step 2
            await this.saveStepOneData(data);
            return this.renderRedirect({ url: '/wizard?step=2' });
        }
        
        if (step === '2') {
            // Process step 2, redirect to completion
            await this.saveStepTwoData(data);
            return this.renderRedirect({ url: '/wizard/complete' });
        }
        
        return this.renderView('wizard-step', { step });
    }
}
```

### Permission-Based Redirects

```javascript
// Redirect based on user permissions
export default {
    async render() {
        const user = await this.user;
        
        if (!user) {
            return this.renderRedirect({ url: '/login' });
        }
        
        if (user.role !== 'admin') {
            return this.renderRedirect({ url: '/unauthorized' });
        }
        
        return this.renderView('admin-panel');
    }
}
```

### Nested Redirect Logic

```javascript
// Complex redirect logic with multiple conditions
export default {
    async render() {
        const user = await this.user;
        const { commentableId } = this.params;
        
        if (!user) {
            const loginUrl = `/_actions/guest/sign_in?title=${encodeURIComponent('Add comment')}&returnUrl=${encodeURIComponent(`/_actions/guest/add_comment?commentableId=${commentableId}`)}`;
            return this.renderRedirect({ url: loginUrl });
        }
        
        // Process comment creation...
        const comment = await this.database.comments.insert({
            commentableId,
            userId: user.id,
            body: this.params.body
        });
        
        // Redirect back to the content
        return this.renderRedirect({ target: '_top' });
    }
}
```

### Client-Side Script Integration

```javascript
// Combine redirects with client-side behavior
export default {
    async render() {
        const returnUrl = this.params.returnUrl;
        
        if (returnUrl) {
            return this.renderHtml`
                ${this.renderRedirect({ url: returnUrl })}
                <script type="pinstripe">
                    const { document } = this;
                    this.overlay.on('close', () => document.load());
                </script>
            `;
        }
        
        return this.renderRedirect({ target: '_top' });
    }
}
```

## Target Behaviors

### `target: '_top'`
- Redirects the entire browser window/tab
- Most common for post-authentication redirects
- Used when leaving the current application context
- Triggers full page navigation

### `target: '_parent'`
- Redirects the parent frame or overlay
- Used within iframes or embedded contexts
- Maintains overlay/modal workflows
- Preserves parent page state

### No Target (Default)
- Context-dependent redirect behavior
- Usually behaves like `_top` for standalone pages
- May behave like `_parent` in overlay contexts

## Common Use Cases

1. **Authentication Flows**: Redirect after login/logout
2. **Form Success**: Navigate after successful submissions
3. **Access Control**: Redirect unauthorized users
4. **Workflow Steps**: Move between process stages
5. **Error Handling**: Redirect on validation failures
6. **Admin Actions**: Navigate after CRUD operations

## Integration Patterns

### With Form Validation
```javascript
export default {
    render() {
        return this.renderForm(this.database.users, {
            fields: ['email', 'password'],
            validateWith: async ({ email }) => {
                const existing = await this.database.users.where({ email }).first();
                if (existing) throw new Error('Email already exists');
            },
            success: ({ id }) => this.renderRedirect({ url: `/users/${id}` })
        });
    }
}
```

### With Session Management
```javascript
export default {
    async render() {
        if (await this.session) {
            await this.session.delete();
        }

        const [status, headers, body] = this.renderRedirect({ 
            target: '_top' 
        }).toResponseArray(200);
        
        headers['Set-Cookie'] = 'pinstripeSession=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        return [status, headers, body];
    }
}
```

### With Error Handling
```javascript
export default {
    async render() {
        try {
            await this.processPayment(this.params);
            return this.renderRedirect({ url: '/payment/success' });
        } catch (error) {
            return this.renderRedirect({ 
                url: `/payment/error?message=${encodeURIComponent(error.message)}` 
            });
        }
    }
}
```

## Response Integration

The service integrates seamlessly with HTTP responses:

```javascript
// Basic response conversion
const [status, headers, body] = this.renderRedirect({ url: '/dashboard' }).toResponseArray();

// Custom status codes
const [status, headers, body] = this.renderRedirect({ url: '/error' }).toResponseArray(302);

// Adding custom headers
const response = this.renderRedirect({ target: '_top' }).toResponseArray();
response[1]['X-Custom-Header'] = 'value';
return response;
```

## Best Practices

### URL Construction
- Use relative URLs (`/path`) for internal navigation
- Encode query parameters with `encodeURIComponent()`
- Build URLs dynamically using template literals
- Validate URLs before redirecting when using user input

### Target Selection
- Use `target: '_top'` for complete page changes
- Use `target: '_parent'` for overlay/modal workflows
- Avoid target when context doesn't matter

### Performance
- Combine redirects with necessary HTTP headers in one response
- Use redirects instead of client-side navigation for SEO benefits
- Cache redirect responses appropriately

### Security
- Validate redirect URLs to prevent open redirect vulnerabilities
- Sanitize user-provided redirect parameters
- Use relative URLs when possible to prevent external redirects

## Error Handling

The service handles common edge cases:

```javascript
// Graceful fallback for missing URLs
const redirectUrl = user.preferredDashboard || '/dashboard';
return this.renderRedirect({ url: redirectUrl });

// Error boundary redirects
try {
    await this.performAction();
    return this.renderRedirect({ url: '/success' });
} catch (error) {
    console.error('Action failed:', error);
    return this.renderRedirect({ url: '/error' });
}
```