---
menus:
    sidebar: ["Services", "createModel"]
---
# createModel

The `createModel` service creates a new model instance with custom validation rules and behaviors. It's primarily used for form validation and data processing in Pinstripe applications.

## Interface

```javascript
this.createModel(definition) -> Model
```

### Parameters

- `definition` (Object): An object containing model definition with validation rules and behaviors
  - `meta()` (Function): Defines validation rules and model behaviors

### Returns

A new `Model` instance with the specified validation rules and behaviors.

## Description

The `createModel` service is a factory function that creates ephemeral model instances for form validation and data processing. Unlike database models, these models exist only in memory and are primarily used to:

- Define validation rules for form inputs
- Handle custom validation logic
- Provide structured error handling
- Process form data with validation

The service extends the base `Model` class and includes the `Hookable` mixin, allowing you to define validation rules using lifecycle hooks like `on('validation', ...)`.

## Built-in Validation Methods

Models created with `createModel` have access to several built-in validation methods:

### `mustNotBeBlank(fieldName, options)`
Validates that a field is not empty or whitespace-only.

```javascript
this.mustNotBeBlank('email');
this.mustNotBeBlank('name', { message: 'Name is required' });
```

### `mustMatchPattern(fieldName, pattern, options)`
Validates that a field matches a regular expression pattern.

```javascript
this.mustMatchPattern('phone', /^\d{10}$/);
this.mustMatchPattern('code', /^[A-Z]{3}$/, { message: 'Must be 3 uppercase letters' });
```

### `mustBeAValidEmail(fieldName, options)`
Validates that a field contains a valid email address.

```javascript
this.mustBeAValidEmail('email');
this.mustBeAValidEmail('contactEmail', { message: 'Please enter a valid email address' });
```

## Validation Lifecycle Hooks

### `on('validation', callback)`
Custom validation logic that runs during the validation process.

```javascript
this.addHook('validation', function() {
    if (!this.isValidationError('password') && this.password.length < 8) {
        this.setValidationError('password', 'Password must be at least 8 characters');
    }
});
```

### `on('beforeValidation', callback)`
Runs before validation starts, useful for data preprocessing.

```javascript
this.addHook('beforeValidation', function() {
    this.email = (this.email || '').toLowerCase().trim();
});
```

### `on('afterValidation', callback)`
Runs after validation completes successfully.

## Error Handling Methods

### `setValidationError(fieldName, message)`
Manually sets a validation error for a specific field.

### `isValidationError(fieldName)`
Checks if a specific field has a validation error.

### `validationErrors`
Returns an object containing all validation errors.

## Examples

### Basic Form Validation

```javascript
this.createModel({
    meta() {
        this.mustNotBeBlank('name');
        this.mustBeAValidEmail('email');
    }
})
```

### Authentication Form with Custom Validation

```javascript
this.createModel({
    meta() {
        this.mustNotBeBlank('email');
        this.mustBeAValidEmail('email');
        
        this.addHook('validation', function() {
            if (!this.isValidationError('legal') && this.legal != 'true') {
                this.setValidationError('legal', 'You must agree to the terms of service.');
            }
        });
    }
})
```

### Password Verification with Async Validation

```javascript
this.createModel({
    meta() {
        this.mustNotBeBlank('password');
        
        this.addHook('validation', async function() {
            if (!this.isValidationError('password')) {
                const user = await that.database.users.where({ email }).first();
                if (user && !await user.verifyPassword(this.password)) {
                    this.setValidationError('general', 'Your password is incorrect.');
                }
            }
        });
    }
})
```

### Complex Form Validation

```javascript
this.createModel({
    meta() {
        this.mustNotBeBlank('title');
        this.mustNotBeBlank('content');
        this.mustMatchPattern('slug', /^[a-z0-9-]+$/);
        
        this.addHook('beforeValidation', function() {
            // Auto-generate slug from title if not provided
            if (!this.slug && this.title) {
                this.slug = this.title.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
            }
        });
        
        this.addHook('validation', async function() {
            // Check for duplicate slugs
            if (!this.isValidationError('slug')) {
                const existing = await that.database.posts.where({ slug: this.slug }).first();
                if (existing) {
                    this.setValidationError('slug', 'This slug is already taken.');
                }
            }
        });
    }
})
```

### Conditional Validation

```javascript
this.createModel({
    meta() {
        this.mustNotBeBlank('email');
        
        // Only require password for new users
        this.mustNotBeBlank('password', {
            when: function() { return this.isNewUser; }
        });
        
        this.addHook('validation', function() {
            if (this.subscriptionType === 'premium' && !this.paymentMethod) {
                this.setValidationError('paymentMethod', 'Payment method required for premium subscription.');
            }
        });
    }
})
```

### Data Preprocessing

```javascript
this.createModel({
    meta() {
        this.addHook('beforeValidation', function() {
            // Normalize email
            this.email = (this.email || '').toLowerCase().trim();
            
            // Format phone number
            if (this.phone) {
                this.phone = this.phone.replace(/\D/g, '');
            }
            
            // Set default values
            if (!this.role) {
                this.role = 'user';
            }
        });
        
        this.mustBeAValidEmail('email');
        this.mustMatchPattern('phone', /^\d{10}$/, { message: 'Phone must be 10 digits' });
    }
})
```

### Multi-step Form Validation

```javascript
this.createModel({
    meta() {
        // Step 1: Basic info
        if (this.step === 1) {
            this.mustNotBeBlank('firstName');
            this.mustNotBeBlank('lastName');
            this.mustBeAValidEmail('email');
        }
        
        // Step 2: Address
        if (this.step === 2) {
            this.mustNotBeBlank('address');
            this.mustNotBeBlank('city');
            this.mustMatchPattern('zipCode', /^\d{5}$/);
        }
        
        // Step 3: Payment
        if (this.step === 3) {
            this.mustNotBeBlank('cardNumber');
            this.mustMatchPattern('cardNumber', /^\d{16}$/);
            this.mustNotBeBlank('expiryDate');
        }
    }
})
```

## Usage with renderForm

The `createModel` service is typically used in conjunction with `renderForm` to provide validation for form submissions:

```javascript
return this.renderForm(
    this.createModel({
        meta() {
            this.mustNotBeBlank('title');
            this.mustBeAValidEmail('email');
        }
    }),
    {
        title: 'Contact Form',
        fields: [
            { name: 'title', label: 'Subject' },
            { name: 'email', label: 'Your Email' },
            { name: 'message', type: 'textarea', label: 'Message' }
        ],
        success: async (data) => {
            // Process validated form data
            await this.sendEmail(data);
            return this.renderRedirect({ url: '/thank-you' });
        }
    }
);
```

The model handles all validation automatically, and the `success` callback only runs if validation passes.

## Best Practices

1. **Keep validation logic in the meta() function** - This ensures all validation rules are defined in one place
2. **Use descriptive error messages** - Provide clear feedback to users about what went wrong
3. **Leverage built-in validators** - Use `mustNotBeBlank`, `mustBeAValidEmail`, etc. before writing custom validation
4. **Handle async validation carefully** - Use async/await properly in validation hooks
5. **Preprocess data in beforeValidation** - Normalize and clean data before validation runs
6. **Use conditional validation** - Apply validation rules only when they're relevant
7. **Group related validations** - Keep related validation logic together for maintainability

The `createModel` service provides a powerful and flexible way to handle form validation and data processing in Pinstripe applications, with built-in support for common validation patterns and extensibility for custom requirements.