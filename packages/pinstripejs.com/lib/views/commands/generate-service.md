---
sidebar:
    category: ["Commands", "generate-service"]
---
# generate-service Command

## Interface

The command creates a new service file with the following signature:

```bash
pinstripe generate-service <name>
```

### Parameters

- **`name`** (required) - The name of the service to create (in snake_case)

### Examples

```bash
# Create a user authentication service
pinstripe generate-service user_auth

# Create an email notification service
pinstripe generate-service email_notification

# Create a payment processing service
pinstripe generate-service payment_processor
```

## Description

The `generate-service` command is a **service scaffolding tool** that creates business logic services in your Pinstripe application:

1. **Service file** - Creates a new service in `lib/services/` directory
2. **File importer** - Sets up `_file_importer.js` if it doesn't exist
3. **Basic structure** - Generates a service with a `create()` method

## Generated Files

```
lib/
└── services/
    ├── _file_importer.js     # Service factory (created if missing)
    └── service_name.js       # Your new service
```

## Service Structure

The generated service follows this pattern:

```javascript
export default {
    create(){
        return 'Example ServiceName service'
    }
};
```

## Key Features

### Automatic Directory Setup
- Creates `lib/services/` directory if it doesn't exist
- Generates `_file_importer.js` with ServiceFactory import
- Uses snake_case naming convention for consistency

### Service Factory Integration
- Services are automatically compatible with Pinstripe's ServiceFactory
- The `create()` method is the service constructor
- Return actual service objects or class instances from `create()`

## Usage Patterns

### Simple Service
```javascript
export default {
    create(){
        return {
            processPayment(amount) {
                // Payment processing logic
                return { status: 'success', transactionId: '12345' };
            }
        };
    }
};
```

### Service with Dependencies
```javascript
export default {
    create(){
        return {
            async findUser(id) {
                return await this.database.users.where({ id }).first();
            },
            
            async createUser(userData) {
                return await this.database.users.insert(userData);
            },
            
            async getActiveUsers() {
                return await this.database.users.where({ status: 'active' }).all();
            }
        };
    }
};
```

## Related Commands

- **`generate-project`** - Create a new Pinstripe project with services directory
- **`generate-command`** - Add CLI commands that can use services
- **`generate-view`** - Add web views that can consume services
- **`list-services`** - List all available services in the project