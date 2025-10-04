---
sidebar:
    category: ["Services", "cliUtils"]
---
# cliUtils Service

## Interface

The service creates an object with utility methods for command-line interface operations:

```javascript
this.cliUtils.normalizeFields(fields)
```

### Methods

- **`normalizeFields(fields)`** - Parses and normalizes field specification strings into structured field objects

### Parameters

- **`fields`** (string|array) - Field specification string or array to be normalized

### Return Value

Returns an array of normalized field objects, each containing:
- **`name`** (string) - Camelized field name
- **`type`** (string) - Field type (defaults to 'string')
- **`mandatory`** (boolean) - Whether the field is required (defaults to false)

## Description

The `cliUtils` service provides utilities for parsing and processing command-line arguments, particularly field specifications used in code generation commands. It's primarily designed to work with CLI commands that generate database migrations, models, and other structured code files.

The service's main function is to parse field specification strings that follow a specific syntax pattern and convert them into structured objects that can be used by code generators.

## Key Features

- **Field Specification Parsing**: Converts string-based field definitions into structured objects
- **Type Detection**: Automatically detects and assigns field types from colon-separated specifications
- **Mandatory Field Support**: Recognizes `^` prefix for required/mandatory fields
- **Inflection Integration**: Automatically camelizes field names using the inflector service
- **Default Value Assignment**: Provides sensible defaults for missing properties

## Field Specification Syntax

The `normalizeFields` method supports a specific syntax for defining fields:

- **Basic field**: `fieldName` - Creates a string field
- **Typed field**: `fieldName:type` - Creates a field with specific type
- **Mandatory field**: `^fieldName` - Creates a required string field
- **Mandatory typed field**: `^fieldName:type` - Creates a required field with specific type
- **Multiple fields**: `field1 ^field2:integer field3:text` - Space-separated field definitions

## Examples

### Basic Field Parsing

```javascript
// Simple field names
const fields = this.cliUtils.normalizeFields('name email');
// Result: [
//   { name: 'name', type: 'string', mandatory: false },
//   { name: 'email', type: 'string', mandatory: false }
// ]

// Empty input
const empty = this.cliUtils.normalizeFields('');
// Result: []
```

### Typed Fields

```javascript
// Fields with types
const typedFields = this.cliUtils.normalizeFields('name:string age:integer active:boolean');
// Result: [
//   { name: 'name', type: 'string', mandatory: false },
//   { name: 'age', type: 'integer', mandatory: false },
//   { name: 'active', type: 'boolean', mandatory: false }
// ]
```

### Mandatory Fields

```javascript
// Required fields with ^ prefix
const mandatoryFields = this.cliUtils.normalizeFields('^title content:text ^author_id:integer');
// Result: [
//   { name: 'title', type: 'string', mandatory: true },
//   { name: 'content', type: 'text', mandatory: false },
//   { name: 'authorId', type: 'integer', mandatory: true }
// ]
```

### Database Migration Generation

```javascript
// Generate migration command usage
export default {
    async run(){
        const { fields = '' } = this.params;
        const normalizedFields = this.cliUtils.normalizeFields(fields);
        
        // Generate migration with normalized fields
        await generateFile(`lib/migrations/${timestamp}_${suffix}.js`, ({ line, indent }) => {
            line('export default {');
            indent(({ line, indent }) => {
                line('async migrate(){');
                indent(({ line, indent }) => {
                    if(table && normalizedFields.length){
                        line(`await this.database.table('${table}', async ${table} => {`);
                        indent(({ line }) => {
                            normalizedFields.forEach(({ name, type }) => {
                                line(`await ${table}.addColumn('${name}', '${type}');`);
                            });
                        });
                        line('});');
                    }
                });
                line('}');
            });
            line('};');
        });
    }
}
```

### Model Generation

```javascript
// Model generation with fields
export default {
    async run(){
        const { name, fields = '' } = this.params;
        const normalizedFields = this.cliUtils.normalizeFields(fields);
        
        // Create migration first
        if(!await this.database[collectionName]){
            await this.runCommand('generate-migration', { 
                suffix: `create_${name}`, 
                fields, 
                table: collectionName
            });
        }
        
        // Generate model file
        await generateFile(`lib/models/${name}.js`, ({ line, indent }) => {
            line('export default {');
            indent(({ line, indent }) => {
                if(normalizedFields.length){
                    line('validations(){');
                    indent(({ line }) => {
                        normalizedFields.forEach(({ name, type, mandatory }) => {
                            if(mandatory){
                                line(`this.validates('${name}', { presence: true });`);
                            }
                            if(type === 'email'){
                                line(`this.validates('${name}', { format: 'email' });`);
                            }
                        });
                    });
                    line('}');
                }
            });
            line('};');
        });
    }
}
```

### Form Generation

```javascript
// Generate form fields from CLI specification
export default {
    async run(){
        const { fields = '' } = this.params;
        const normalizedFields = this.cliUtils.normalizeFields(fields);
        
        const formFields = normalizedFields.map(({ name, type, mandatory }) => ({
            name,
            type: mapCliTypeToFormType(type),
            required: mandatory,
            label: this.inflector.humanize(name)
        }));
        
        return this.renderForm({ fields: formFields });
    }
}

function mapCliTypeToFormType(cliType){
    const typeMap = {
        'string': 'text',
        'text': 'textarea',  
        'integer': 'number',
        'boolean': 'checkbox',
        'email': 'email',
        'password': 'password'
    };
    return typeMap[cliType] || 'text';
}
```

### Complex Field Processing

```javascript
// Advanced field processing with validation
export default {
    async processFields(fieldString){
        const normalizedFields = this.cliUtils.normalizeFields(fieldString);
        
        // Validate field specifications
        const validTypes = ['string', 'text', 'integer', 'float', 'boolean', 'date', 'email'];
        const invalidFields = normalizedFields.filter(field => 
            !validTypes.includes(field.type)
        );
        
        if(invalidFields.length){
            throw new Error(`Invalid field types: ${invalidFields.map(f => f.type).join(', ')}`);
        }
        
        // Process fields for different contexts
        return {
            databaseColumns: normalizedFields.map(({ name, type }) => ({
                name: this.inflector.snakeify(name),
                type: mapToSqlType(type)
            })),
            
            validationRules: normalizedFields
                .filter(({ mandatory }) => mandatory)
                .map(({ name }) => ({ field: name, rule: 'presence' })),
                
            formFields: normalizedFields.map(({ name, type, mandatory }) => ({
                name,
                type: mapToInputType(type),
                required: mandatory,
                label: this.inflector.titleize(name)
            }))
        };
    }
}
```

## Common Use Cases

### Code Generation
- **Database migrations**: Parse field specifications for creating database tables
- **Model generation**: Define model attributes and validations
- **Form creation**: Generate form fields from command-line specifications
- **API scaffolding**: Create structured API endpoints with typed parameters

### CLI Command Processing
- **Parameter parsing**: Convert command-line field arguments to structured objects
- **Validation setup**: Extract mandatory field requirements
- **Type conversion**: Map CLI types to application-specific types
- **Template generation**: Use normalized fields in code templates

### Development Workflow
- **Rapid prototyping**: Quickly define data structures from command line
- **Schema evolution**: Add fields to existing models and migrations
- **Testing setup**: Generate test fixtures with properly typed fields
- **Documentation**: Create field specifications for API documentation

## Integration Patterns

The `cliUtils` service is typically used within:
- **Command classes** for processing CLI arguments
- **Code generators** for creating structured files
- **Migration systems** for database schema changes
- **Template engines** for generating boilerplate code

## Performance Notes

- Field parsing uses efficient regex matching for syntax analysis
- String processing is optimized for CLI-scale input (typically small strings)
- Output objects are lightweight with minimal memory overhead
- Camelization is handled by the inflector service for consistency

## Error Handling

The service handles edge cases gracefully:
- Empty or undefined input returns empty array
- Invalid syntax is parsed with best-effort approach
- Missing type specifications default to 'string'
- Malformed field names are processed through inflector

## Return Value Details

Each normalized field object contains:

```javascript
{
    name: 'camelizedFieldName',    // Camelized version of the input name
    type: 'string',                // Specified type or 'string' default
    mandatory: false               // true if prefixed with ^, false otherwise
}
```

The service ensures consistent field naming through automatic camelization and provides sensible defaults for all properties.