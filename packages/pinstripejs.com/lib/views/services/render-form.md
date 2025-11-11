---
menus:
    sidebar: ["Services", "renderForm"]
---
# renderForm Service

## Interface

The service creates a function that accepts two parameters:

```javascript
this.renderForm(formAdaptable, options)
```

### Parameters

- **`formAdaptable`** - An object that can be converted to a form adapter (typically database models, collections, or custom objects with `toFormAdapter()` method)
- **`options`** - Configuration object with form settings and behavior

## Description

The `renderForm` service is a comprehensive form rendering and processing utility that:

1. **Renders interactive modal forms** with automatic field generation, validation, and submission handling
2. **Processes form submissions** when `_method=POST`, handling validation errors and success callbacks
3. **Supports complex field types** including text inputs, selects, checkboxes, textareas, file uploads, and custom components
4. **Provides anti-spam protection** via proof-of-work challenges for sensitive forms
5. **Handles validation and error display** with field-specific and general error messaging
6. **Enables conditional field rendering** with `watch` functionality for dynamic forms
7. **Supports custom success handlers** for post-submission actions like redirects

The service automatically extracts field definitions from the form adaptable object and merges them with options to create a complete form interface.

## Form Configuration Options

### Basic Options

- **`title`** - Form modal title (string)
- **`fields`** - Array of field definitions (overrides adaptable fields)
- **`submitTitle`** - Submit button text (default: form adapter's submitTitle)
- **`cancelTitle`** - Cancel button text (default: form adapter's cancelTitle)
- **`width`** - Modal width (`'small'`, `'medium'`, `'large'`, or custom)
- **`height`** - Modal height (`'auto'`, `'small'`, `'medium'`, `'large'`, or custom)
- **`class`** - Additional CSS classes for the form element

### Security & Validation Options

- **`requiresProofOfWork`** - Enable anti-spam protection (boolean)
- **`validateWith`** - Custom validation function
- **`success`** - Success callback function for post-submission handling
- **`unsavedChangesConfirm`** - Warning message for unsaved changes

## Field Configuration

Fields can be defined as strings (using defaults) or objects with detailed configuration:

### String Fields
```javascript
fields: ['name', 'email', 'title']
```

### Object Field Properties

- **`name`** - Field name (required)
- **`label`** - Display label (auto-generated from name if omitted)
- **`type`** - Field type (see types below)
- **`value`** - Default value
- **`placeholder`** - Placeholder text
- **`component`** - Custom component identifier
- **`watch`** - Enable reactive updates (boolean)
- **`overlayLinks`** - Array of action links displayed next to the label
- **`options`** - Object of value/label pairs (for select fields)

### Supported Field Types

- **`text`** - Text input (default)
- **`password`** - Password input
- **`email`** - Email input
- **`number`** - Number input
- **`date`** - Date picker
- **`datetime-local`** - DateTime picker
- **`checkbox`** - Checkbox input
- **`textarea`** - Multi-line text input
- **`select`** - Dropdown with options
- **`file`** - File upload
- **`hidden`** - Hidden input
- **`forced`** - Server-side only value (not rendered)
- **`_*`** - Custom component types (e.g., `_markdown_editor`)

## Examples

### Basic Form with Simple Fields
```javascript
// Simple form with database model
this.renderForm(this.database.users, {
    fields: ['name', 'email']
})
```

### Form with Mixed Field Types
```javascript
this.renderForm(this.database.posts, {
    title: 'Create New Post',
    fields: [
        'title',
        { name: 'body', type: 'textarea', placeholder: 'Write your post content here...' },
        { 
            name: 'status', 
            type: 'select', 
            value: 'draft',
            options: {
                draft: 'Draft',
                published: 'Published',
                archived: 'Archived'
            }
        },
        { name: 'featured', type: 'checkbox', label: 'Feature this post' }
    ],
    submitTitle: 'Create Post',
    width: 'large'
})
```

### Form with Custom Validation and Success Handler
```javascript
this.renderForm(this.database.users, {
    title: 'Add User',
    fields: [
        'name',
        'email',
        { 
            name: 'role', 
            type: 'select', 
            value: 'user',
            options: {
                admin: 'Administrator',
                user: 'Regular User'
            }
        }
    ],
    
    // Custom validation
    validateWith() {
        if(!this.email.includes('@')) {
            this.setValidationError('email', 'Must be a valid email address');
        }
    },
    
    // Success handler with redirect
    success({ slug }) {
        return that.renderRedirect({
            url: `/${slug}`,
            target: '_top'
        });
    }
})
```

### Authentication Form with Anti-Spam Protection
```javascript
this.renderForm(
    this.createModel({
        meta() {
            this.mustNotBeBlank('email');
            this.mustBeAValidEmail('email');
        }
    }),
    {
        title: 'Sign In',
        fields: [
            { 
                name: 'email', 
                label: 'Your email', 
                placeholder: "We'll send a one-time-password to this address." 
            },
            { 
                name: 'legal', 
                type: 'checkbox', 
                label: this.renderHtml`I agree to the <a href="/legal/terms-of-service" target="_blank">terms of service</a>.`
            }
        ],
        submitTitle: 'Next',
        requiresProofOfWork: true,
        width: 'small',
        
        success: async ({ email }) => {
            // Send verification email and redirect
            await this.sendVerificationEmail(email);
            return this.renderRedirect({
                url: `/verify?email=${encodeURIComponent(email)}`
            });
        }
    }
)
```

### Dynamic Form with Conditional Fields
```javascript
this.renderForm(newsletter, {
    fields: [
        { name: 'enableMonthly', type: 'checkbox', watch: true },
        // Conditionally add monthly price field
        ...(enableMonthly ? [{ name: 'monthlyPrice', type: 'number' }] : []),
        
        { name: 'enableYearly', type: 'checkbox', watch: true },
        // Conditionally add yearly price field  
        ...(enableYearly ? [{ name: 'yearlyPrice', type: 'number' }] : []),
        
        // Currency selector appears only if paid options enabled
        ...(enableMonthly || enableYearly ? [{
            name: 'currency',
            type: 'select',
            options: {
                USD: 'US Dollar',
                EUR: 'Euro',
                GBP: 'British Pound'
            }
        }] : [])
    ]
})
```

### Custom Component Integration
```javascript
this.renderForm(this.database.posts, {
    fields: [
        'title',
        { 
            name: 'body', 
            type: '_markdown_editor',
            placeholder: 'Write your post in Markdown...'
        },
        {
            name: 'coverImage',
            type: 'file',
            overlayLinks: [
                {
                    body: 'Browse Gallery',
                    href: '/_actions/admin/image_gallery',
                    target: '_overlay'
                }
            ]
        }
    ]
})
```

### Form with Hidden and Forced Fields
```javascript
this.renderForm(this.database.comments, {
    fields: [
        // Hidden field included in form but not displayed
        { name: 'postId', type: 'hidden', value: this.params.postId },
        
        // Forced field set server-side only
        { name: 'userId', type: 'forced', value: this.session.user.id },
        
        // Visible fields
        { name: 'body', type: 'textarea', label: 'Your Comment' }
    ],
    
    success: async ({ id }) => {
        await this.notifyUsers({ commentId: id });
        return this.renderRedirect({ target: '_top' });
    }
})
```

### File Upload Form
```javascript
this.renderForm(this.database.images, {
    title: 'Upload Image',
    fields: [
        { name: 'file', type: 'file' },
        { name: 'alt', label: 'Alt Text', placeholder: 'Describe this image...' }
    ],
    
    success(image) {
        return this.renderHtml`
            <span data-insert-content="![${image.title}](/${image.slug})">
                <script type="pinstripe">
                    this.parent.trigger('click');
                </script>
            </span>
        `;
    }
})
```

## Form Processing Flow

1. **GET Request**: Renders the form with default/existing values
2. **POST Request**: 
   - Validates proof-of-work (if enabled)
   - Processes field values through appropriate filters
   - Calls validation functions
   - On success: executes success callback or redirects
   - On error: re-renders form with error messages

## Integration Patterns

### With Database Models
```javascript
// Direct model usage
this.renderForm(this.database.users.where({ id: userId }).first(), {
    fields: ['name', 'email']
})

// Collection for new records
this.renderForm(this.database.posts, {
    fields: ['title', 'body']
})
```

### With Custom Models
```javascript
this.renderForm(
    this.createModel({
        meta() {
            this.mustNotBeBlank('name');
            this.mustBeUnique('email');
        }
    }),
    { fields: ['name', 'email'] }
)
```

### Modal Sizing
```javascript
// Small modal for simple forms
{ width: 'small' }    // Sign-in, quick edits

// Medium modal (default)
{ width: 'medium' }   // Standard forms

// Large modal for complex forms  
{ width: 'large' }    // Content creation, settings
```

The `renderForm` service provides a complete solution for form creation, validation, and processing within the Pinstripe framework, automatically handling common form patterns while remaining flexible for custom use cases.