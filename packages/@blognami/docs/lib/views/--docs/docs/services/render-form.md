---
menu:
    path: ["Services", "renderForm"]
---
# renderForm

Render interactive forms with validation and submission handling.

## Interface

```javascript
this.renderForm(formAdaptable, options)
```

### Parameters

- **formAdaptable** - A database table/model or object with `toFormAdapter()` method
- **options** - Form configuration (title, fields, submitTitle, width, etc.)

### Returns

- Rendered form HTML, or processes submission on POST requests

## Description

The `renderForm` service renders forms with automatic field generation, validation, error handling, and submission processing. On GET requests it renders the form; on POST it validates and processes the submission.

## Options

| Option | Description |
|--------|-------------|
| `title` | Form title |
| `fields` | Array of field names or field definition objects |
| `submitTitle` | Submit button text |
| `cancelTitle` | Cancel button text |
| `width` | Modal width ('small', 'medium', 'large') |
| `requiresProofOfWork` | Enable anti-spam protection |
| `validateWith` | Custom validation function |
| `success` | Callback after successful submission |

## Field Types

`text`, `password`, `email`, `number`, `date`, `datetime-local`, `checkbox`, `textarea`, `select`, `file`, `hidden`, `forced` (server-only)

## Examples

### Basic Form

```javascript
this.renderForm(this.database.users, {
    title: 'Add User',
    fields: ['name', 'email'],
    submitTitle: 'Create'
})
```

### Form with Field Configuration

```javascript
this.renderForm(this.database.posts, {
    title: 'New Post',
    fields: [
        'title',
        { name: 'body', type: 'textarea' },
        {
            name: 'status',
            type: 'select',
            options: { draft: 'Draft', published: 'Published' }
        },
        { name: 'featured', type: 'checkbox' }
    ],
    width: 'large'
})
```

### Form with Custom Validation and Success Handler

```javascript
this.renderForm(this.database.users, {
    fields: ['name', 'email'],
    validateWith() {
        if (!this.email.includes('@')) {
            this.setValidationError('email', 'Invalid email');
        }
    },
    success: ({ id }) => this.renderRedirect({ url: `/users/${id}` })
})
```

### Form with Anti-Spam Protection

```javascript
this.renderForm(this.createModel({
    meta() {
        this.mustNotBeBlank('email');
        this.mustBeAValidEmail('email');
    }
}), {
    fields: ['email'],
    requiresProofOfWork: true,
    submitTitle: 'Sign In'
})
```

## Notes

- Forms render in modal dialogs by default
- Field labels are auto-generated from names if not specified
- Use `forced` type for server-only values that shouldn't be rendered
- The `success` callback receives the created/updated record
