# 🚀 HTTPForge

HTTPForge is a lightweight **HTTP/1.1 server** built completely from scratch using **TypeScript** and **Node.js TCP sockets**, without using Express or Node's built-in HTTP module.

The purpose of this project was to understand how HTTP works internally by implementing the protocol from the transport layer upwards. HTTPForge handles request parsing, response generation, static file serving, byte-range requests, caching, and persistent connections while maintaining a clean and modular architecture.

---

## ✨ Features

- 🌐 HTTP/1.1 server built on raw TCP sockets
- 🔄 Persistent (Keep-Alive) connections
- 📥 Custom HTTP request parser
- 📤 HTTP response generator
- 📁 Static file server
- 🎨 Automatic MIME type detection
- 📄 Streaming file responses using a custom `BodyReader`
- 📂 Automatic directory listing
- 📑 Index file support (`index.html`)
- 📦 HTTP Range Requests (`206 Partial Content`)
- ⚡ HTTP Caching
  - ETag generation
  - Last-Modified header
  - If-None-Match support
  - 304 Not Modified responses
- 🔒 Protection against directory traversal attacks
- 📡 `/echo` endpoint for testing request bodies

---

## 🛠 Tech Stack

- TypeScript
- Node.js
- TCP Sockets
- HTTP/1.1

No external web frameworks were used.

---

## 📂 Project Structure

```text
HTTPForge
│
├── public/
│   ├── index.html
│   ├── test.txt
│   └── assets/
│
├── src/
│   ├── body.ts
│   ├── directory.ts
│   ├── dynbuf.ts
│   ├── handler.ts
│   ├── http.ts
│   ├── mime.ts
│   ├── protocol.ts
│   ├── response.ts
│   ├── server.ts
│   ├── static.ts
│   ├── tcp.ts
│   └── utils.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/Hiba-khan01/HTTPForge.git
cd HTTPForge
```

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npx tsx src/server.ts
```

The server will start on:

```
http://127.0.0.1:1234
```

---

## 🧪 Example Requests

### Homepage

```bash
curl http://127.0.0.1:1234
```

### Static File

```bash
curl http://127.0.0.1:1234/test.txt
```

### Directory Listing

```bash
curl http://127.0.0.1:1234/assets/
```

### Echo Endpoint

```bash
curl --data-binary "Hello HTTPForge" http://127.0.0.1:1234/echo
```

### HTTP Range Request

```bash
curl -H "Range: bytes=0-4" http://127.0.0.1:1234/test.txt
```

### HTTP Caching

```bash
curl -I http://127.0.0.1:1234/test.txt
```

```bash
curl -H "If-None-Match: <etag>" http://127.0.0.1:1234/test.txt
```

---

## 📌 Supported HTTP Features

| Feature | Status |
|----------|--------|
| HTTP/1.1 | ✅ |
| Persistent Connections | ✅ |
| Static File Serving | ✅ |
| MIME Type Detection | ✅ |
| Directory Listing | ✅ |
| Streaming File Responses | ✅ |
| Range Requests (206) | ✅ |
| ETag Caching | ✅ |
| Last-Modified | ✅ |
| 304 Not Modified | ✅ |

---

## 📚 What I Learned

Building HTTPForge helped me gain a deeper understanding of:

- TCP socket programming
- HTTP/1.1 protocol
- Request parsing
- Response generation
- Buffer management
- Streaming large files
- MIME type handling
- HTTP status codes
- HTTP headers
- Byte-range requests
- Browser caching
- Directory traversal security
- File system operations in Node.js

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Acknowledgements

This project was built as a learning exercise to understand the internals of HTTP by implementing the protocol from scratch instead of relying on existing web frameworks.

If you found this project interesting, consider giving it a ⭐ on GitHub.