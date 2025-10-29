---
menus:
    sidebar: ["Services", "inflector"]
---
# inflector Service

The `inflector` service provides string inflection methods for transforming words and identifiers between different naming conventions. It supports pluralization, singularization, and various case transformations commonly used in web development, database modeling, and code generation.

## Interface

```javascript
// Direct method calls
this.inflector.camelize(string)          // Convert to camelCase
this.inflector.snakeify(string)          // Convert to snake_case  
this.inflector.dasherize(string)         // Convert to dash-case
this.inflector.pluralize(string)         // Convert to plural form
this.inflector.singularize(string)       // Convert to singular form
this.inflector.capitalize(string)        // Capitalize first letter
this.inflector.uncapitalize(string)      // Lowercase first letter
this.inflector.pascalize(string)         // Convert to PascalCase
this.inflector.titleize(string)          // Convert to Title Case
this.inflector.humanize(string)          // Convert to human readable

// Chained transformations
this.inflector.inflect(value, step1, step2, ...)
```

## Description

The inflector service is a core utility that handles string transformations for naming conventions across different contexts. It's built as a singleton service that provides both individual transformation methods and a powerful chaining mechanism through the `inflect` method.

The service is particularly useful for:
- **Code Generation**: Converting user input to proper variable names, file names, and class names
- **Database Operations**: Converting between singular model names and plural table names
- **CSS Class Generation**: Creating consistent naming patterns for generated CSS classes
- **URL Generation**: Converting titles and names to URL-friendly formats
- **Form Field Processing**: Standardizing field names from various input formats

## Key Features

- **Pluralization/Singularization**: Comprehensive English language rules with irregular forms
- **Case Transformations**: Support for all common programming naming conventions
- **Path-Aware Processing**: Handles file paths by processing segments individually
- **Chaining Support**: Combine multiple transformations in a single call
- **Consistent API**: All methods accept strings and return transformed strings

## Examples

### Basic Case Transformations

```javascript
// Convert to camelCase (first letter lowercase)
this.inflector.camelize('user_name')        // → 'userName'
this.inflector.camelize('my-cool-service')   // → 'myCoolService'
this.inflector.camelize('FirstName')         // → 'firstName'

// Convert to snake_case
this.inflector.snakeify('userName')          // → 'user_name'
this.inflector.snakeify('MyCoolService')     // → 'my_cool_service'
this.inflector.snakeify('first-name')        // → 'first_name'

// Convert to dash-case
this.inflector.dasherize('userName')         // → 'user-name'
this.inflector.dasherize('MyCoolService')    // → 'my-cool-service'
this.inflector.dasherize('first_name')       // → 'first-name'

// Convert to PascalCase (first letter uppercase)
this.inflector.pascalize('user_name')        // → 'UserName'
this.inflector.pascalize('my-cool-service')  // → 'MyCoolService'
```

### Pluralization and Singularization

```javascript
// Pluralization
this.inflector.pluralize('user')             // → 'users'
this.inflector.pluralize('person')           // → 'people'
this.inflector.pluralize('child')            // → 'children'
this.inflector.pluralize('mouse')            // → 'mice'
this.inflector.pluralize('database')         // → 'databases'

// Singularization  
this.inflector.singularize('users')          // → 'user'
this.inflector.singularize('people')         // → 'person'
this.inflector.singularize('children')       // → 'child'
this.inflector.singularize('mice')           // → 'mouse'
this.inflector.singularize('databases')      // → 'database'
```

### Capitalization Methods

```javascript
// Capitalize first letter
this.inflector.capitalize('hello world')     // → 'Hello world'
this.inflector.capitalize('userName')         // → 'UserName'

// Uncapitalize first letter
this.inflector.uncapitalize('Hello World')   // → 'hello World'
this.inflector.uncapitalize('UserName')      // → 'userName'

// Title case (each word capitalized)
this.inflector.titleize('user_name')         // → 'User Name'
this.inflector.titleize('my_cool_service')   // → 'My Cool Service'

// Human readable (sentence case)
this.inflector.humanize('user_name')         // → 'User name'
this.inflector.humanize('first_name_field')  // → 'First name field'
```

### Service Generation Usage

```javascript
// Generating service files with proper naming
export default {
    async run(){
        const { name = '' } = this.params;
        const { inProjectRootDir, generateFile } = this.fsBuilder;
        
        await inProjectRootDir(async () => {
            // File name in snake_case
            const fileName = this.inflector.snakeify(name);
            
            await generateFile(`lib/services/${fileName}.js`, ({ line, indent }) => {
                line(`export default {`);
                indent(({ line, indent }) => {
                    line('create(){');
                    indent(({ line }) => {
                        // Class name in camelCase  
                        const serviceName = this.inflector.camelize(name);
                        line(`return 'Example ${serviceName} service'`);
                    });
                    line('}');
                });
                line('};');
            });
        });
    }
};
```

### Database Model Generation

```javascript
// Generate model with proper table naming
export default {
    async run(){
        const { name = '' } = this.params;
        
        // Model name in snake_case
        const modelName = this.inflector.snakeify(name);
        
        // Table name: camelized plural
        const tableName = this.inflector.camelize(
            this.inflector.pluralize(modelName)
        );
        
        // Create migration for table
        await this.runCommand('generate-migration', {
            suffix: `create_${modelName}`,
            table: tableName
        });
    }
};
```

### CSS Class Generation

```javascript
// Used in cssClassesFor service
export default {
    create(){
        return name => {
            const hash = createHash(name);
            return this.trapify({
                __getMissing: (target, name) => {
                    // Convert property access to dash-case CSS class
                    return `view-${hash}-${this.inflector.dasherize(name)}`;
                }
            });
        };
    }
};

// Usage:
const classes = this.cssClassesFor('modal');
classes.submitButton    // → 'view-abc123-submit-button'
classes.errorMessage    // → 'view-abc123-error-message'
```

### CLI Field Processing

```javascript
// Processing command line field specifications
export default {
    create(){
        return {
            normalizeFields: fields => {
                if(typeof fields == 'string') {
                    return fields.split(/\s+/).map(field => {
                        const matches = field.match(/^(\^|)([^:]*)(:|)(.*)$/);
                        const mandatory = matches[1] == '^';
                        
                        // Convert field name to camelCase
                        const name = this.inflector.camelize(matches[2]);
                        const type = matches[4] || 'string';
                        
                        return { mandatory, name, type };
                    });
                }
                return fields;
            }
        };
    }
};
```

### Path Processing

```javascript
// Handle file paths by processing segments
this.inflector.snakeify('admin/UserService')     // → 'admin/user_service'
this.inflector.dasherize('lib/MyService')        // → 'lib/my-service'
this.inflector.camelize('api/user_controller')   // → 'api/userController'
```

### Chained Transformations with inflect

```javascript
// Apply multiple transformations in sequence
this.inflector.inflect('MyServiceName', 'snakeify', 'pluralize')
// → 'my_service_names'

this.inflector.inflect('user-profile', 'camelize', 'capitalize') 
// → 'UserProfile'

// Using array syntax for methods with arguments
this.inflector.inflect('service_name', ['snakeify'], ['pluralize'])
// → 'service_names'
```

### Form and URL Generation

```javascript
// Convert titles to various formats for forms and URLs
export default {
    async render(){
        const { title } = this.params;

        // Field name for form input
        const fieldName = this.inflector.camelize(title);
        
        // CSS-friendly test ID
        const testId = this.inflector.dasherize(title);
        
        // URL-friendly action name
        const actionName = this.inflector.snakeify(title);

        return this.renderHtml`
            <input 
                name="${fieldName}" 
                data-testid="${testId}"
                data-action="/_actions/admin/edit_site_${actionName}"
            />
        `;
    }
};
```

### Background Job Naming

```javascript
// Generate background job with consistent naming
export default {
    async run(){
        const { name = '' } = this.params;
        
        // File name in snake_case
        const normalizedName = this.inflector.snakeify(name);
        
        await generateFile(`lib/background_jobs/${normalizedName}.js`, ({ line, indent }) => {
            line(`export default {`);
            indent(({ line, indent }) => {
                line('async run(){');
                indent(({ line }) => {
                    // Human-readable console output
                    const displayName = this.inflector.dasherize(normalizedName);
                    line(`console.log('${displayName} background job coming soon!')`);
                });
                line('}');
            });
            line('};');
        });
    }
};
```

## Pluralization Rules

The service includes comprehensive English pluralization rules:

### Regular Patterns
- Most words: add 's' (`user` → `users`)
- Words ending in 'ch', 'sh', 'ss', 'x': add 'es' (`box` → `boxes`)
- Words ending in consonant + 'y': change 'y' to 'ies' (`city` → `cities`)
- Words ending in 'f' or 'fe': change to 'ves' (`leaf` → `leaves`)

### Irregular Forms
- `person` → `people`
- `man` → `men`  
- `child` → `children`
- `mouse` → `mice`
- `ox` → `oxen`

### Uncountable Words
- `equipment`, `information`, `rice`, `money`
- `species`, `series`, `fish`, `sheep`
- `jeans`, `police`

## Common Use Cases

### Code Generation
- **Service Creation**: Convert service names to proper file and class naming
- **Model Generation**: Handle singular model names to plural table names
- **Command Generation**: Create consistent command naming across CLI tools
- **Migration Files**: Generate database migration names with proper conventions

### Database Operations  
- **Table Naming**: Convert model classes to table collection names
- **Field Processing**: Standardize field names from user input
- **Relationship Mapping**: Handle associations between singular and plural forms

### UI Generation
- **CSS Classes**: Generate consistent CSS class names from component names
- **Form Fields**: Convert various input formats to standard field names
- **Test Identifiers**: Create reliable test IDs from dynamic content
- **URL Generation**: Convert titles and names to URL-friendly formats

### Template Processing
- **Variable Names**: Ensure consistent naming in generated templates
- **Configuration**: Process configuration keys to match expected formats
- **Documentation**: Generate human-readable labels from technical names

## Performance Notes

- All transformations are performed synchronously and return immediately
- String processing is optimized for typical identifier lengths (under 100 characters)
- Pluralization rules are cached and reused across calls
- Memory usage is minimal with no persistent state beyond rule definitions
- The service is designed for high-frequency usage in code generation scenarios

## Integration Patterns

The inflector service integrates seamlessly with other Pinstripe services:

- **fsBuilder**: File and directory name generation
- **cliUtils**: Processing command-line field specifications
- **cssClassesFor**: Dynamic CSS class name generation
- **renderText**: Template variable naming
- **database services**: Model and table name handling

## Error Handling

The service is designed to be robust:
- **Invalid Input**: Non-string inputs are converted to strings before processing
- **Empty Strings**: Return empty strings without errors
- **Special Characters**: Handles Unicode characters gracefully
- **Path Separators**: Preserves path structure while transforming segments
- **Edge Cases**: Provides sensible defaults for unusual input patterns