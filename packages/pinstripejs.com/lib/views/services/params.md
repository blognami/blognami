---
sidebar:
    category: ["Services", "params"]
---
# params Service

The `params` service provides access to the current request parameters for the active workspace context. It contains URL parameters, form data, JSON payloads, and HTTP metadata extracted from incoming requests. Unlike `initialParams` which preserves the original request context, `params` reflects the current request being processed and can change as requests are handled.

## Interface

```javascript
this.params
```

**Returns**: Object containing request parameters with standard HTTP properties and custom data

### Standard Properties

- **`_method`** (`String`): HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
- **`_url`** (`URL`): URL object representing the request URL with full parsing capabilities
- **`_headers`** (`Object`): HTTP headers as key-value pairs (lowercase keys)
- **`_body`** (`String`, optional): Raw request body for POST/PUT/PATCH requests
- **`_bodyErrors`** (`Object`, optional): Validation errors from body parsing
- **`_request`** (`Object`, optional): Original Node.js request object (server-side only)

### Custom Properties

All URL query parameters and form/JSON body fields are merged as top-level properties:

- **URL parameters**: `?id=123&name=example` becomes `{ id: '123', name: 'example' }`
- **Form fields**: Form data and JSON payloads are merged into the params object
- **File uploads**: Processed file objects with metadata and data buffers

## Description

The `params` service is the primary interface for accessing request data in Pinstripe applications. It automatically extracts and normalizes parameters from multiple sources:

1. **URL Query Parameters**: Extracted from the request URL query string
2. **Route Parameters**: Dynamic segments from URL routing (e.g., `/posts/:id`)
3. **Form Data**: POST/PUT/PATCH requests with form-encoded or multipart data
4. **JSON Payloads**: Parsed JSON request bodies
5. **File Uploads**: Processed file data with metadata and validation
6. **HTTP Metadata**: Method, headers, and other request information

The service handles parameter normalization, type conversion, and validation errors, providing a consistent interface regardless of the request source.

## Key Features

- **Automatic Parameter Extraction**: Seamlessly merges URL, form, and JSON parameters
- **File Upload Handling**: Processes multipart uploads with size limits and validation
- **Type Preservation**: Maintains parameter types where possible (strings, numbers, booleans)
- **Error Collection**: Aggregates validation and parsing errors in `_bodyErrors`
- **Header Access**: Provides lowercase-normalized HTTP headers
- **URL Parsing**: Full URL object with hostname, pathname, search params, etc.
- **Request Method Detection**: Supports all HTTP methods including method override

## Examples

### Basic Parameter Access

```javascript
// Access URL and form parameters
export default {
    async render(){
        const { id, name, email } = this.params;
        
        console.log('Request method:', this.params._method);
        console.log('Request URL:', this.params._url.toString());
        console.log('User ID:', id);
        console.log('User name:', name);
        
        // Access specific headers
        const contentType = this.params._headers['content-type'];
        const userAgent = this.params._headers['user-agent'];
        
        return this.renderHtml`
            <h1>Processing request for user: ${name}</h1>
            <p>ID: ${id}</p>
            <p>Email: ${email}</p>
        `;
    }
}
```

### URL Parameter Parsing

```javascript
// Extract URL components and query parameters
export default {
    async render(){
        const { _url } = this.params;
        
        console.log('Hostname:', _url.hostname);
        console.log('Pathname:', _url.pathname);
        console.log('Search params:', _url.searchParams);
        
        // Check for specific query parameters
        const page = this.params.page || 1;
        const limit = this.params.limit || 10;
        const search = this.params.search || '';
        
        // Use for pagination
        const posts = await this.database.posts
            .where('title', 'LIKE', `%${search}%`)
            .orderBy('createdAt', 'desc')
            .paginate(page, limit);
            
        return this.renderView('posts/list', { posts, page, search });
    }
}
```

### Form Handling and Validation

```javascript
// Handle form submissions with validation
export default {
    async render(){
        if(this.params._method === 'GET'){
            // Display form
            return this.renderForm(null, {
                fields: ['name', 'email', 'message'],
                action: '/contact',
                method: 'POST'
            });
        }
        
        if(this.params._method === 'POST'){
            const { name, email, message } = this.params;
            
            // Check for validation errors
            if(this.params._bodyErrors){
                return this.renderForm({ name, email, message }, {
                    fields: ['name', 'email', 'message'],
                    errors: this.params._bodyErrors
                });
            }
            
            // Process successful submission
            await this.database.contacts.insert({
                name,
                email,
                message,
                createdAt: new Date()
            });
            
            return this.renderRedirect('/thank-you');
        }
    }
}
```

### File Upload Processing

```javascript
// Handle file uploads with validation
export default {
    async render(){
        if(this.params._method === 'POST'){
            const { title, description, image } = this.params;
            
            if(image && image.data){
                // Process uploaded image
                const { filename, mimeType, data } = image;
                
                console.log('Uploaded file:', filename);
                console.log('MIME type:', mimeType);
                console.log('File size:', data.length);
                
                // Save image to database or storage
                const imageRecord = await this.database.images.insert({
                    filename,
                    mimeType,
                    data: data.toString('base64'),
                    size: data.length
                });
                
                // Create post with image reference
                await this.database.posts.insert({
                    title,
                    description,
                    imageId: imageRecord.id
                });
                
                return this.renderRedirect(`/posts/${imageRecord.id}`);
            }
        }
        
        return this.renderForm(null, {
            fields: [
                'title',
                'description',
                { name: 'image', type: 'file', accept: 'image/*' }
            ],
            enctype: 'multipart/form-data'
        });
    }
}
```

### JSON API Handling

```javascript
// Handle JSON API requests
export default {
    async render(){
        const { _method, _headers } = this.params;
        
        if(_headers['content-type'] === 'application/json'){
            if(_method === 'POST'){
                const { name, email, data } = this.params;
                
                // Validate JSON structure
                if(!name || !email){
                    return [400, 
                        { 'content-type': 'application/json' },
                        [JSON.stringify({ error: 'Name and email required' })]
                    ];
                }
                
                // Process JSON data
                const record = await this.database.users.insert({
                    name,
                    email,
                    metadata: data || {},
                    createdAt: new Date()
                });
                
                return [201,
                    { 'content-type': 'application/json' },
                    [JSON.stringify({ id: record.id, status: 'created' })]
                ];
            }
        }
        
        return [400, 
            { 'content-type': 'application/json' },
            [JSON.stringify({ error: 'Invalid request format' })]
        ];
    }
}
```

### Database Operations with Parameters

```javascript
// Use parameters for database queries and operations
export default {
    async render(){
        const { id, _method } = this.params;
        
        if(_method === 'GET'){
            // Fetch single record
            const user = await this.database.users
                .where({ id })
                .first();
                
            if(!user){
                return this.renderView('errors/404');
            }
            
            return this.renderView('users/show', { user });
        }
        
        if(_method === 'DELETE'){
            // Delete record
            await this.database.users
                .where({ id })
                .delete();
                
            return this.renderRedirect('/users');
        }
        
        if(_method === 'PUT'){
            // Update record
            const { name, email, bio } = this.params;
            
            await this.database.users
                .where({ id })
                .update({ name, email, bio, updatedAt: new Date() });
                
            return this.renderRedirect(`/users/${id}`);
        }
    }
}
```

### Pagination and Search

```javascript
// Implement pagination and search using parameters
export default {
    async render(){
        const page = parseInt(this.params.page) || 1;
        const pageSize = parseInt(this.params.pageSize) || 10;
        const search = this.params.search || '';
        const sortBy = this.params.sortBy || 'createdAt';
        const sortOrder = this.params.sortOrder || 'desc';
        
        let query = this.database.posts.orderBy(sortBy, sortOrder);
        
        if(search){
            query = query.where('title', 'LIKE', `%${search}%`);
        }
        
        const posts = await query.paginate(page, pageSize);
        
        return this.renderView('posts/index', {
            posts,
            currentPage: page,
            search,
            sortBy,
            sortOrder,
            hasNextPage: posts.length === pageSize,
            hasPrevPage: page > 1
        });
    }
}
```

### Command Line Parameter Extraction

```javascript
// In CLI commands, access extracted command line arguments
export default {
    async run(){
        const { name, description, force } = this.params;
        
        if(!name){
            console.error('--name parameter is required');
            process.exit(1);
        }
        
        console.log('Creating service:', name);
        if(description){
            console.log('Description:', description);
        }
        
        const fileName = this.inflector.snakeify(name);
        const serviceName = this.inflector.camelize(name);
        
        await this.fsBuilder.inProjectRootDir(async () => {
            await this.fsBuilder.generateFile(
                `lib/services/${fileName}.js`,
                { skipIfExists: !force },
                ({ line, indent }) => {
                    line(`export default {`);
                    indent(({ line }) => {
                        line('create(){');
                        line(`    return '${serviceName} service';`);
                        line('}');
                    });
                    line('};');
                }
            );
        });
        
        console.log(`Service created: lib/services/${fileName}.js`);
    }
}
```

## Parameter Sources and Processing

### URL Query Parameters

```javascript
// URL: /users?page=2&limit=25&active=true
// Accessible as:
const { page, limit, active } = this.params;
console.log(page);   // "2" (string)
console.log(limit);  // "25" (string)  
console.log(active); // "true" (string)
```

### Form Data Processing

```javascript
// HTML form with method="POST" and enctype="application/x-www-form-urlencoded"
// Form fields become top-level parameters
const { username, password, rememberMe } = this.params;

// Checkbox values become "on" or undefined
const remember = rememberMe === 'on';
```

### Multipart Form Processing

```javascript
// File uploads and form fields in multipart/form-data requests
const { title, category, attachment } = this.params;

if(attachment){
    const { filename, mimeType, data, size } = attachment;
    // Process uploaded file
}
```

### JSON Body Parsing

```javascript
// Content-Type: application/json requests
// JSON properties are merged into params
const { user, settings, metadata } = this.params;

// Raw JSON available in _body
const rawJson = this.params._body;
```

## Error Handling

### Body Parsing Errors

```javascript
// Check for parsing or validation errors
if(this.params._bodyErrors){
    const errors = this.params._bodyErrors;
    
    // Handle specific field errors
    if(errors.email){
        console.log('Email error:', errors.email);
    }
    
    // Handle general errors
    if(errors.general){
        console.log('General error:', errors.general);
    }
    
    return this.renderForm(this.params, {
        fields: ['name', 'email'],
        errors
    });
}
```

### File Upload Validation

```javascript
// Handle file upload errors and limits
const { profileImage } = this.params;

if(this.params._bodyErrors?.profileImage){
    // File too large or invalid format
    const error = this.params._bodyErrors.profileImage;
    return this.renderView('error', { message: error });
}

if(profileImage && profileImage.data){
    // Validate file type
    if(!profileImage.mimeType.startsWith('image/')){
        return this.renderView('error', { 
            message: 'Only image files are allowed' 
        });
    }
}
```

## Common Patterns

### Parameter Defaults and Coercion

```javascript
// Provide defaults and convert types
export default {
    async render(){
        const page = Math.max(1, parseInt(this.params.page) || 1);
        const limit = Math.min(100, parseInt(this.params.limit) || 10);
        const includeDeleted = this.params.includeDeleted === 'true';
        const search = (this.params.search || '').trim();
        
        // Use normalized parameters
        const results = await this.database.items
            .where(builder => {
                if(search) builder.where('name', 'LIKE', `%${search}%`);
                if(!includeDeleted) builder.where('deletedAt', null);
            })
            .orderBy('createdAt', 'desc')
            .paginate(page, limit);
            
        return this.renderView('items/list', { 
            results, page, limit, search, includeDeleted 
        });
    }
}
```

### REST API Parameter Handling

```javascript
// Handle RESTful resource operations
export default {
    async render(){
        const { id, _method } = this.params;
        const resource = id ? await this.database.posts.find(id) : null;
        
        switch(_method){
            case 'GET':
                return id ? 
                    this.renderView('posts/show', { post: resource }) :
                    this.renderView('posts/index', { 
                        posts: await this.database.posts.paginate(this.params.page)
                    });
                    
            case 'POST':
                const { title, body, published } = this.params;
                const newPost = await this.database.posts.insert({
                    title, body, published: published === 'true'
                });
                return this.renderRedirect(`/posts/${newPost.id}`);
                
            case 'PUT':
            case 'PATCH':
                if(!resource) return this.renderView('errors/404');
                await this.database.posts.where({ id }).update(this.params);
                return this.renderRedirect(`/posts/${id}`);
                
            case 'DELETE':
                if(!resource) return this.renderView('errors/404');
                await this.database.posts.where({ id }).delete();
                return this.renderRedirect('/posts');
                
            default:
                return this.renderView('errors/405');
        }
    }
}
```

## Implementation Details

The `params` service is implemented as a context-scoped service that:

1. **Initializes Default Structure**: Creates base params object with default HTTP properties
2. **Parameter Extraction**: Server/ServiceWorker extracts params from requests via `extractParams()`
3. **Parameter Normalization**: `callHandler.normalizeParams()` ensures consistent structure
4. **Context Assignment**: Normalized params are assigned to the current workspace context
5. **Client Availability**: Service is marked with `addToClient()` for browser usage

### Default Parameter Structure

```javascript
{
    _method: 'GET',
    _url: new URL('http://127.0.0.1/'),
    _headers: {}
}
```

### Parameter Merging Order

1. URL query parameters (lowest priority)
2. Form/JSON body parameters
3. Route parameters (highest priority)
4. HTTP metadata (`_method`, `_url`, `_headers`, etc.)

## Security Considerations

### Input Validation

```javascript
// Always validate and sanitize parameter input
const { id, email, content } = this.params;

// Validate ID format
if(id && !id.match(/^\d+$/)){
    return this.renderView('errors/400', { 
        message: 'Invalid ID format' 
    });
}

// Validate email format
if(email && !email.includes('@')){
    return this.renderView('errors/400', { 
        message: 'Invalid email format' 
    });
}

// Sanitize content to prevent XSS
const sanitizedContent = content?.replace(/<script[^>]*>.*?<\/script>/gi, '');
```

### File Upload Security

```javascript
// Validate file uploads carefully
const { document } = this.params;

if(document && document.data){
    const { filename, mimeType, data } = document;
    
    // Validate file extension
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const extension = filename.substring(filename.lastIndexOf('.'));
    
    if(!allowedExtensions.includes(extension.toLowerCase())){
        return this.renderView('error', { 
            message: 'File type not allowed' 
        });
    }
    
    // Validate MIME type
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'text/plain'
    ];
    
    if(!allowedMimeTypes.includes(mimeType)){
        return this.renderView('error', { 
            message: 'MIME type not allowed' 
        });
    }
}
```

### Header Validation

```javascript
// Validate sensitive headers
const { _headers } = this.params;

// Validate content length
const contentLength = parseInt(_headers['content-length']);
if(contentLength > 10_000_000){ // 10MB limit
    return [413, {}, ['Payload too large']];
}

// Validate origin for CORS
const origin = _headers['origin'];
const allowedOrigins = ['https://example.com', 'https://app.example.com'];

if(origin && !allowedOrigins.includes(origin)){
    return [403, {}, ['Origin not allowed']];
}
```

## Related Services

- **initialParams**: Original request parameters preserved across context changes
- **callHandler**: Normalizes and processes parameters before assignment
- **server**: Extracts parameters from HTTP requests and creates initial structure
- **serviceWorker**: Handles parameter extraction in service worker environments
- **renderForm**: Uses parameters for form rendering and validation
- **database**: Often queries using parameter values for filtering and operations

## Troubleshooting

### Common Issues

**Parameters not appearing:**
```javascript
// Debug parameter extraction
console.log('All params:', Object.keys(this.params));
console.log('Method:', this.params._method);
console.log('URL:', this.params._url.toString());
console.log('Headers:', this.params._headers);
```

**File uploads not working:**
```javascript
// Check form configuration
// Ensure form has: method="POST" enctype="multipart/form-data"
// Check file size limits in server configuration
```

**JSON parsing issues:**
```javascript
// Verify content-type header
const contentType = this.params._headers['content-type'];
console.log('Content-Type:', contentType);

// Check raw body for JSON validity
try {
    const parsed = JSON.parse(this.params._body);
    console.log('Parsed JSON:', parsed);
} catch(e) {
    console.log('JSON parse error:', e.message);
}
```

### Debugging Parameter Flow

```javascript
// Debug complete parameter structure
export default {
    async render(){
        console.log('=== Parameter Debug Info ===');
        console.log('Method:', this.params._method);
        console.log('URL:', this.params._url.toString());
        console.log('Headers:', Object.keys(this.params._headers));
        console.log('Body present:', !!this.params._body);
        console.log('Custom params:', Object.keys(this.params).filter(k => !k.startsWith('_')));
        console.log('Errors:', this.params._bodyErrors);
        
        return this.renderView('debug', { params: this.params });
    }
}
```