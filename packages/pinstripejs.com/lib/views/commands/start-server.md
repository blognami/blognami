---
menu:
    path: ["Commands", "start-server"]
---
# start-server Command

## Interface

The command starts the Pinstripe web server with the following signature:

```bash
pinstripe start-server [--host <host:port>] [--without-background-jobs]
```

### Parameters

- **`--host <host:port>`** (optional) - Host and port configuration (e.g. "127.0.0.1:3000"). Defaults to `PINSTRIPE_HOST` environment variable or "127.0.0.1:3000"
- **`--without-background-jobs`** (optional) - Skip starting the background job worker

### Examples

```bash
# Start server with default settings (127.0.0.1:3000)
pinstripe start-server

# Start server on specific host and port
pinstripe start-server --host "0.0.0.0:8080"

# Start server without background job processing
pinstripe start-server --without-background-jobs

# Start server on custom port using environment variable
PINSTRIPE_HOST="127.0.0.1:4000" pinstripe start-server
```

## Description

The `start-server` command is a **development and production server** that launches your Pinstripe application with:

1. **HTTP Server** - Handles web requests and API calls
2. **Background Job Processing** - Automatically starts the background job worker for scheduled tasks
3. **Request Routing** - Processes requests through the call handler system
4. **Static File Serving** - Serves static assets and uploads
5. **ETag Caching** - Provides HTTP caching with ETag headers
6. **Environment Detection** - Adapts behavior for development vs production

## Server Features

### HTTP Request Processing
- **Multiple HTTP Methods** - Handles GET, POST, PUT, PATCH requests
- **File Upload Support** - Processes multipart form data with automatic image optimization
- **Parameter Extraction** - Parses URL parameters, headers, and request bodies
- **Response Caching** - Generates ETags and handles 304 Not Modified responses

### Background Job Integration
- **Automatic Startup** - Starts the background job worker for scheduled background jobs by default
- **Job Scheduling** - Processes background jobs based on cron-like schedules
- **Optional Disable** - Use `--without-background-jobs` to run server-only mode

### Development vs Production
```javascript
// Development logging (NODE_ENV !== 'test')
console.log(`GET: /api/posts (200)`);
console.log(`Pinstripe running at "http://127.0.0.1:3000/"`);

// Production mode
// Reduced logging, optimized performance
```

## Configuration

### Host Configuration
The server accepts multiple host formats:

```bash
# Single host:port
--host "127.0.0.1:3000"

# Multiple servers (space-separated)  
--host "127.0.0.1:3000 0.0.0.0:8080"

# Environment variable
export PINSTRIPE_HOST="127.0.0.1:3000"
pinstripe start-server
```

### Server Limits
Configured via `config.server.limits`:
- **Body size limits** - Maximum request body size
- **File upload limits** - Maximum file size and count
- **Image processing** - Automatic resizing and optimization
- **Field limits** - Maximum form fields and parameters

## Common Use Cases

### Development Server
```bash
# Start development server with hot reloading
pinstripe start-server

# Development with custom port
pinstripe start-server --host "127.0.0.1:4000"
```

### Production Deployment
```bash
# Production server on all interfaces
pinstripe start-server --host "0.0.0.0:3000"

# Production with environment configuration
NODE_ENV=production pinstripe start-server
```

### API-Only Server
```bash
# Server without background job processing
pinstripe start-server --without-background-jobs
```

## Related Commands

- **`generate-project`** - Create new Pinstripe projects that can be served
- **`initialize-database`** - Set up database before starting server
- **`start-repl`** - Interactive development environment
- **`run-background-job`** - Manually execute background jobs
- **`generate-static-site`** - Generate static files from server routes