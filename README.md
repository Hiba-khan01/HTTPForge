# 🚀 HTTPForge

HTTPForge is a lightweight HTTP/1.1 server built completely from scratch using **TypeScript** and **Node.js TCP sockets**. The goal of this project was to understand how HTTP works internally instead of relying on frameworks like Express or Node's built-in HTTP module.

This project implements core HTTP features such as request parsing, persistent connections, static file serving, byte-range requests, and HTTP caching.

---

## ✨ Features

- HTTP/1.1 server built on raw TCP sockets
- Persistent (Keep-Alive) connections
- Custom HTTP request parser
- HTTP response generator
- Static file server
- MIME type detection
- File streaming using custom BodyReader
- Automatic directory listing
- HTTP Range Requests (`206 Partial Content`)
- HTTP Caching
  - ETag
  - Last-Modified
  - If-None-Match
  - 304 Not Modified responses
- Protection against directory traversal attacks
- Simple `/echo` endpoint for testing request bodies

---

## 📂 Project Structure

```
src/
├── body.ts
├── directory.ts
├── dynbuf.ts
├── handler.ts
├── http.ts
├── mime.ts
├── protocol.ts
├── response.ts
├── server.ts
├── static.ts
├── tcp.ts
└── utils.ts

public/
├── index.html
├── test.txt
└── assets/
```

---

## ⚙️ How it Works

1. Accepts TCP connections.
2. Reads incoming bytes from the socket.
3. Parses HTTP requests.
4. Routes the request.
5. Serves static files or dynamic responses.
6. Streams files in chunks.
7. Supports HTTP caching and byte-range requests.
8. Sends a valid HTTP response back to the client.

---

## 🛠️ Technologies Used

- TypeScript
- Node.js
- TCP Sockets
- HTTP/1.1

No external web frameworks were used.

---

## 🚀 Running the Project

Clone the repository

```bash
git clone https://github.com/Hiba-khan01/HTTPForge.git
```

Install dependencies

```bash
npm install
```

Start the server

```bash
npx tsx src/server.ts
```

The server starts on

```
http://127.0.0.1:1234
```

---

## 🧪 Example Requests

Homepage

```bash
curl http://127.0.0.1:1234
```

Serve a file

```bash
curl http://127.0.0.1:1234/test.txt
```

Directory listing

```bash
curl http://127.0.0.1:1234/assets/
```

Echo endpoint

```bash
curl --data-binary "Hello HTTPForge" http://127.0.0.1:1234/echo
```

HTTP Range Request

```bash
curl -H "Range: bytes=0-4" http://127.0.0.1:1234/test.txt
```

HTTP Caching

```bash
curl -I http://127.0.0.1:1234/test.txt
```

```bash
curl -H "If-None-Match: <etag>" http://127.0.0.1:1234/test.txt
```

---

## 📸 Features Demonstrated

- Static HTML pages
- File downloads
- Directory browsing
- Partial content delivery
- Browser caching support
- Streaming large files

---

## 📈 What I Learned

Building HTTPForge helped me understand:

- How HTTP requests and responses are structured
- TCP socket programming
- Parsing raw network data
- Buffer management
- File streaming
- HTTP status codes
- HTTP headers
- MIME types
- Byte-range requests
- Browser caching using ETag and Last-Modified

---

## 🔮 Future Improvements

- Gzip Compression
- Chunked Transfer Encoding
- Request Logging
- Docker Support
- Unit Tests
- GitHub Actions CI

---

## 📄 License

This project is licensed under the MIT License.

---

If you found this project interesting, feel free to ⭐ the repository.