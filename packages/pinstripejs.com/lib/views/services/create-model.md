---
menus:
    sidebar: ["Services", "createModel"]
---
# createModel

Create ephemeral models for form validation.

## Interface

```javascript
this.createModel(definition)
```

### Parameters

- **definition** - Object with `meta()` function defining validation rules

### Returns

- Model instance with validation methods

## Description

The `createModel` service creates in-memory model instances for form validation and data processing. Unlike database models, these don't persist data. Used primarily with `renderForm` for form validation.

## Validation Methods

```javascript
this.mustNotBeBlank(field)
this.mustNotBeBlank(field, { message: 'Custom message' })

this.mustBeAValidEmail(field)

this.mustMatchPattern(field, /regex/)

this.addHook('validation', function() { ... })
this.addHook('beforeValidation', function() { ... })
```

## Error Methods

```javascript
this.setValidationError(field, message)
this.isValidationError(field)
this.validationErrors
```

## Examples

### Basic Validation

```javascript
this.createModel({
    meta() {
        this.mustNotBeBlank('name');
        this.mustBeAValidEmail('email');
    }
})
```

### Custom Validation

```javascript
this.createModel({
    meta() {
        this.mustNotBeBlank('password');

        this.addHook('validation', function() {
            if (!this.isValidationError('password') && this.password.length < 8) {
                this.setValidationError('password', 'Must be at least 8 characters');
            }
        });
    }
})
```

### With renderForm

```javascript
this.renderForm(
    this.createModel({
        meta() {
            this.mustNotBeBlank('email');
            this.mustBeAValidEmail('email');
        }
    }),
    {
        fields: ['email'],
        success: async ({ email }) => {
            await this.sendEmail(email);
            return this.renderRedirect({ url: '/thanks' });
        }
    }
)
```

### Data Preprocessing

```javascript
this.createModel({
    meta() {
        this.addHook('beforeValidation', function() {
            this.email = (this.email || '').toLowerCase().trim();
        });

        this.mustBeAValidEmail('email');
    }
})
```

## Notes

- Validation runs automatically when used with `renderForm`
- `success` callback only runs if validation passes
- Supports async validation in hooks
- Use for forms that don't map directly to database tables
