TCP is a reliable byte stream, not a message protocol. # HTTPForge Notes

These are my personal notes while building HTTPForge from scratch.

---

# TCP

- TCP is a stream protocol, not a message protocol.
- A single write() is not guaranteed to be received in a single read().
- Multiple writes can also arrive in one read().
- Therefore, message boundaries must be implemented by the application.

---

# Dynamic Buffer

Why it's needed:

- Incoming TCP data may arrive in chunks.
- A request may span multiple reads.
- A buffer stores incomplete data until a complete message is available.

---

# Promise-based Socket API

Wrapped Node.js socket events into Promises.

Benefits:
- Cleaner code
- async/await support
- Easier error handling

---

# HTTP Request Format

Example:

GET / HTTP/1.1
Host: localhost
User-Agent: curl

Structure:

- Request Line
- Headers
- Empty Line
- Body (optional)

---

# Request Line

Contains three parts:

- Method
- URI
- HTTP Version

Example:

GET / HTTP/1.1

---

# HTTP Headers

Format:

Header-Name: value

Examples:

Host: localhost
Content-Length: 5
Content-Type: text/plain

---

# Header Terminator

Headers end with:

\r\n\r\n

This is how the parser knows the header is complete.

---

# Content-Length

Specifies the number of bytes in the body.

Example:

Content-Length: 5

Body:

hello

---

# HTTP Response

Example:

HTTP/1.1 200 OK
Content-Length: 13

hello world.

---

# BodyReader

Purpose:

Read request or response bodies without loading everything into memory.

Advantages:

- Supports large payloads
- Enables streaming
- Keeps memory usage constant

---

# Connection Reuse

HTTP/1.1 keeps the TCP connection alive by default.

The server can process multiple requests over one connection.

---

# Error Handling

Custom HTTPError class is used to generate HTTP error responses.

Examples:

400 Bad Request
404 Not Found
413 Payload Too Large
500 Internal Server Error

---

# Current Endpoints

GET /

Response:

hello world.

---

POST /echo

Returns the same request body.

Example:

Request:

hello

Response:

hello

---

# Things I Learned

- TCP is byte-oriented.
- HTTP is text-based.
- Parsing is easier after receiving the complete header.
- Headers end with CRLF CRLF.
- Body size is determined using Content-Length.
- Streams help avoid loading large payloads into memory.

---

# Improvements Planned

- Static file server
- MIME types
- Chunked transfer encoding
- Compression
- Caching
- WebSockets