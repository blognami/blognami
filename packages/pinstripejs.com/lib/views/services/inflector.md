---
menu:
    path: ["Services", "inflector"]
---
# inflector

String transformation utilities for converting between naming conventions.

## Interface

```javascript
this.inflector.camelize(string)      // userName
this.inflector.pascalize(string)     // UserName
this.inflector.snakeify(string)      // user_name
this.inflector.dasherize(string)     // user-name
this.inflector.pluralize(string)     // users
this.inflector.singularize(string)   // user
this.inflector.capitalize(string)    // User name
this.inflector.uncapitalize(string)  // user Name
this.inflector.titleize(string)      // User Name
this.inflector.humanize(string)      // User name

this.inflector.inflect(value, ...steps)  // Chain multiple transformations
```

## Description

The inflector service transforms strings between different naming conventions used in programming. It handles path separators intelligently, processing each segment individually while preserving the path structure.

## Examples

### Case Transformations

```javascript
this.inflector.camelize('user_name')       // 'userName'
this.inflector.pascalize('user_name')      // 'UserName'
this.inflector.snakeify('userName')        // 'user_name'
this.inflector.dasherize('userName')       // 'user-name'
this.inflector.titleize('user_name')       // 'User Name'
this.inflector.humanize('user_name')       // 'User name'
```

### Pluralization

```javascript
this.inflector.pluralize('user')           // 'users'
this.inflector.pluralize('person')         // 'people'
this.inflector.pluralize('child')          // 'children'
this.inflector.singularize('users')        // 'user'
this.inflector.singularize('people')       // 'person'
```

### Chained Transformations

```javascript
// Apply multiple transformations in sequence
this.inflector.inflect('MyServiceName', 'snakeify', 'pluralize')
// Result: 'my_service_names'

this.inflector.inflect('user-profile', 'camelize', 'capitalize')
// Result: 'UserProfile'
```

### Path Handling

```javascript
// Paths are processed segment by segment
this.inflector.snakeify('admin/UserService')   // 'admin/user_service'
this.inflector.camelize('api/user_controller') // 'api/userController'
```

## Notes

- All methods accept any value and convert it to a string before processing
- Path separators (`/`) are preserved during transformation
- Includes comprehensive English pluralization rules with irregular forms (person/people, child/children, etc.)
- Uncountable words (equipment, information, sheep) return unchanged
