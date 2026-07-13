# HTTPForge Notes

## HTTP/1.1

HTTP (HyperText Transfer Protocol) is an application-layer protocol used for communication between clients and servers. In this project, I implemented a basic HTTP/1.1 server capable of parsing requests and generating valid HTTP responses.

---

## TCP Sockets

HTTP runs on top of TCP. Instead of using Node.js' built-in HTTP module, this project communicates directly using raw TCP sockets, handling incoming connections and reading bytes from the network manually.

---

## Request Parsing

HTTP requests arrive as raw bytes. The server reads those bytes, separates the request line, headers, and body, and converts them into structured request objects that can be processed by the application.

---

## Response Generation

Every response is constructed manually, including:

- Status line
- Response headers
- Blank line
- Response body

This helped in understanding the exact format of an HTTP response.

---

## Persistent Connections

HTTP/1.1 keeps the TCP connection alive by default. Instead of closing the socket after every request, the server can process multiple requests over the same connection.

---

## Dynamic Buffer

Incoming TCP data may arrive in multiple packets. A dynamic buffer stores partial data until a complete HTTP request has been received.

---

## Static File Server

The server maps URLs to files inside the `public` directory and serves them with the appropriate content type.

Example:

```
/test.txt
```

↓

```
public/test.txt
```

---

## MIME Types

Browsers need to know how to interpret files.

Examples:

| Extension | MIME Type |
|-----------|-----------|
| .html | text/html |
| .css | text/css |
| .js | application/javascript |
| .png | image/png |
| .txt | text/plain |

---

## File Streaming

Instead of loading an entire file into memory, files are streamed in small chunks using a custom `BodyReader`, making the server more memory efficient.

---

## Directory Listing

If a requested directory does not contain an `index.html`, the server automatically generates an HTML page listing all files and folders inside that directory.

---

## HTTP Range Requests

Supports requests like:

```
Range: bytes=100-500
```

The server returns only the requested portion of the file with:

- HTTP 206 Partial Content
- Content-Range
- Accept-Ranges

This feature is commonly used for media streaming and resumable downloads.

---

## HTTP Caching

Implemented browser caching using:

- ETag
- Last-Modified
- If-None-Match
- 304 Not Modified

If the requested resource has not changed, the server returns `304 Not Modified` without sending the file again, reducing bandwidth usage.

---

## Security

Implemented protection against directory traversal attacks by ensuring requests cannot access files outside the configured `public` directory.

Example blocked request:

```
/../../secret.txt
```

---

## Project Outcome

HTTPForge demonstrates the fundamentals of building an HTTP server from scratch, including networking, request parsing, file handling, streaming, caching, and efficient response generation using TypeScript and raw TCP sockets.