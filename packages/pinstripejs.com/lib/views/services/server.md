---
sidebar:
    category: ["Services", "server"]
---
# Server Service

The `server` service provides HTTP server functionality for Pinstripe applications. It creates and manages HTTP servers, handles incoming requests, parses request bodies (including file uploads with image processing), and integrates with the framework's call handler system.

## Interface

```javascript
server.start(options = {})
server.extractParams(request, baseUrl, limits)
server.parseBody(request, limits)  
server.createHash(data)
```

## Key Features

- **HTTP Server Creation**: Creates HTTP servers with configurable hostname and port
- **Request Parameter Extraction**: Extracts URL parameters, headers, and body data from HTTP requests
- **File Upload Handling**: Processes multipart form data with file uploads
- **Image Processing**: Automatically resizes and optimizes uploaded images using Sharp
- **ETags for Caching**: Generates SHA1-based ETags for response caching
- **Comprehensive Limits**: Enforces configurable limits on body size, file size, field counts, etc.
- **Error Handling**: Provides structured error responses and logging
- **Integration**: Seamlessly integrates with the call handler system

## Core Methods

### start(options = {})

Starts an HTTP server with the specified configuration.

**Parameters:**
- `options.hostname` (string): Server hostname (default: '127.0.0.1')
- `options.port` (number): Server port (default: 3000)

**Features:**
- Creates HTTP server using Node.js `http` module
- Handles GET, POST, PUT, PATCH requests
- Generates ETags for response caching (returns 304 if not modified)
- Integrates with `callHandler.handleCall()` for request processing
- Provides console logging for requests (disabled in test environment)

### extractParams(request, baseUrl, limits)

Extracts and normalizes parameters from HTTP requests.

**Parameters:**
- `request`: Node.js HTTP request object
- `baseUrl`: Base URL for resolving relative URLs
- `limits`: Configuration object with size/count limits

**Returns:** Object containing:
- URL query parameters (flattened from URLSearchParams)
- Request body parameters (for POST/PUT/PATCH requests)
- `_request`: Original request object
- `_method`: HTTP method
- `_url`: Parsed URL object
- `_headers`: Request headers object

### parseBody(request, limits)

Parses request bodies with support for multiple content types.

**Supported Content Types:**
- `application/json`: Parses JSON data
- `multipart/form-data`: Handles file uploads and form fields
- `application/x-www-form-urlencoded`: Processes form data
- Raw text content

**File Upload Features:**
- Automatic image processing with Sharp
- Image resizing within configured limits
- TIFF to WebP conversion
- File metadata extraction (filename, MIME type, encoding)

**Error Handling:**
- Size limit enforcement
- Field count limits
- Structured error reporting in `_bodyErrors`

### createHash(data)

Generates SHA1-based ETags for HTTP caching.

**Parameters:**
- `data`: Data to hash (typically response body)

**Returns:** ETag string in format `"<base64-encoded-sha1>"`

## Configuration

The server service uses configuration from `config.server.limits`:

```javascript
// Default limits in config service
config.limits.bodySize = 100 * 1024 * 1024;      // 100MB max body size
config.limits.rawBodySize = 1024 * 1024;         // 1MB raw body display
config.limits.fieldNameSize = 100;               // 100 bytes max field name
config.limits.fieldSize = 1024 * 1024;           // 1MB max field value
config.limits.fields = Infinity;                 // Unlimited field count
config.limits.fileSize = 10 * 1024 * 1024;       // 10MB max file size
config.limits.files = Infinity;                  // Unlimited file count
config.limits.parts = Infinity;                  // Unlimited multipart parts
config.limits.headerPairs = 2000;                // Max header pairs
config.limits.imageWidth = 1024;                 // Max image width (px)
config.limits.imageHeight = 1024;                // Max image height (px)
```

## Examples

### Basic Server Startup

```javascript
// In a command (e.g., start-server command)
export default {
    run(){
        const { host = '127.0.0.1:3000' } = this.params;
        
        const [hostname, port] = host.split(':');
        
        this.server.start({
            hostname: hostname || '127.0.0.1',
            port: parseInt(port) || 3000
        });
    }
}
```

### Custom Server Configuration

```javascript
// pinstripe.config.js
export default {
    server: {
        limits: {
            bodySize: 50 * 1024 * 1024,    // 50MB max body
            fileSize: 5 * 1024 * 1024,     // 5MB max file
            imageWidth: 800,               // 800px max width
            imageHeight: 600,              // 600px max height
            fields: 100                    // Max 100 form fields
        }
    }
};
```

### Manual Parameter Extraction

```javascript
// Custom request handling
export default {
    async handleCustomRequest(httpRequest){
        const baseUrl = new URL('http://127.0.0.1:3000/');
        const limits = await this.config.server.limits;
        
        const params = await this.server.extractParams(
            httpRequest, 
            baseUrl, 
            limits
        );
        
        // params contains:
        // - URL query parameters
        // - Body data (JSON, form fields, files)
        // - _method, _url, _headers, _request
        
        return params;
    }
}
```

### File Upload Processing

```javascript
// View handling file uploads
export default {
    async render(){
        const { profileImage, username } = this.params;
        
        if(profileImage) {
            // profileImage is automatically processed:
            // {
            //   filename: 'avatar.jpg',
            //   mimeType: 'image/jpeg', 
            //   encoding: '7bit',
            //   data: Buffer // Resized image data
            // }
            
            await this.saveProfileImage(profileImage);
        }
        
        return this.renderView('upload-success');
    }
}
```

### Custom ETag Generation

```javascript
export default {
    async render(){
        const data = await this.fetchData();
        const etag = this.server.createHash(data);
        
        // Check client cache
        if(this.params._headers['if-none-match'] === etag) {
            return [304, { etag }, []]; // Not modified
        }
        
        const body = this.renderData(data);
        return [200, { etag, 'content-type': 'application/json' }, [body]];
    }
}
```

### Error Handling with Body Errors

```javascript
export default {
    async render(){
        const { _bodyErrors, ...params } = this.params;
        
        if(_bodyErrors) {
            // Handle upload errors
            if(_bodyErrors.general) {
                return this.renderError(`Upload failed: ${_bodyErrors.general}`);
            }
            
            // Handle field-specific errors
            for(const [fieldName, error] of Object.entries(_bodyErrors)) {
                console.error(`Field ${fieldName}: ${error}`);
            }
        }
        
        return this.processUpload(params);
    }
}
```

### Integration with Static Site Generation

```javascript
// Static site generator using server extraction
export default {
    async generateStaticFiles(){
        const paths = await this.getAllPaths();
        
        for(const path of paths) {
            // Use server.extractParams-like functionality
            const url = new URL(path, 'http://127.0.0.1/');
            const params = { _url: url };
            
            const [status, headers, data] = await this.callHandler.handleCall(params);
            
            if(status === 200) {
                await this.writeStaticFile(path, data);
            }
        }
    }
}
```

## Integration with Call Handler

The server service works closely with the call handler:

```javascript
// Inside server.start()
const params = await this.extractParams(request, baseUrl, limits);
const [status, headers, body] = await this.callHandler.handleCall(params);

// Generate ETag for caching
const etag = this.createHash(body);

// Handle 304 Not Modified responses
if(params._headers['if-none-match'] == etag){
    response.statusCode = 304;
    response.end();
    return;
}
```

## Image Processing Features

The server automatically processes uploaded images:

1. **Format Support**: PNG, JPEG, GIF, WebP, AVIF, TIFF
2. **Automatic Resizing**: Respects `imageWidth` and `imageHeight` limits
3. **Format Conversion**: TIFF files automatically converted to WebP
4. **Optimization**: Uses Sharp for efficient image processing
5. **Metadata Preservation**: Maintains filename and encoding information

## Performance Considerations

1. **Memory Management**: Large files are processed in chunks
2. **Size Limits**: Configurable limits prevent memory exhaustion
3. **ETag Caching**: Reduces redundant data transfer
4. **Image Optimization**: Automatic resizing reduces bandwidth
5. **Error Recovery**: Graceful handling of malformed requests

## Security Features

1. **Size Limits**: Prevents DoS attacks via large uploads
2. **Field Limits**: Prevents form field abuse
3. **File Type Validation**: Only processes supported image formats
4. **Error Sanitization**: Structured error responses without sensitive data
5. **Request Validation**: Validates content types and structure

## Error Handling

The server provides comprehensive error handling:

```javascript
// Server-level error handling
try {
    const [status, headers, body] = await this.callHandler.handleCall(params);
    // ... response handling
} catch (e) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/plain');
    const error = (e.stack || e).toString();
    console.error(error);
    response.end(error);
}

// Body parsing errors are included in params
const { _bodyErrors } = params;
if(_bodyErrors.general) {
    // Handle general errors (size limits, etc.)
}
```

## Related Services

- **config**: Provides server configuration and limits
- **callHandler**: Processes extracted parameters into responses
- **bot**: Often started alongside server for development
- **serviceWorker**: Uses similar parameter extraction for client-side requests

## Technical Implementation

The server service is implemented using:

- **Node.js http module**: Core HTTP server functionality
- **Busboy**: Multipart form data parsing
- **Sharp**: Image processing and optimization
- **crypto**: SHA1 hash generation for ETags
- **URL/URLSearchParams**: Request parsing and normalization

## Best Practices

1. **Configure Limits**: Set appropriate limits based on your application needs
2. **Handle Errors**: Always check for `_bodyErrors` in upload scenarios
3. **Use ETags**: Leverage ETag caching for better performance
4. **Image Optimization**: Configure appropriate image size limits
5. **Security**: Be mindful of file upload security implications
6. **Testing**: Test with various content types and edge cases
7. **Monitoring**: Monitor server logs for errors and performance issues

## Common Use Cases

1. **Web Application Server**: Primary HTTP server for web applications
2. **API Server**: RESTful API with JSON request/response handling
3. **File Upload Server**: Handling image and document uploads
4. **Static Site Generation**: Server functionality for build-time rendering
5. **Development Server**: Local development with hot reloading
6. **Testing**: HTTP server for automated testing scenarios