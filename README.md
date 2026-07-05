# 🚀 HTTPForge

> Building an HTTP/1.1 server from scratch using Node.js and TypeScript.

HTTPForge is a personal project where I'm building an HTTP server from scratch to understand how networking and web servers work internally. Instead of using frameworks like Express, this project focuses on implementing the core building blocks of an HTTP server using low-level TCP sockets.

---

## ✨ Features

- TCP socket communication
- Promise-based asynchronous networking
- Dynamic buffer implementation
- Custom message framing protocol
- HTTP/1.1 request parsing
- HTTP response generation
- Request body streaming
- Persistent HTTP/1.1 connections
- HTTP error handling
- Echo endpoint (`/echo`)

---

## 🛠 Tech Stack

- TypeScript
- Node.js
- Node.js `net` module

---

## 📂 Project Structure

```text
HTTPForge/
│
├── src/
│   ├── body.ts
│   ├── dynbuf.ts
│   ├── handler.ts
│   ├── http.ts
│   ├── protocol.ts
│   ├── response.ts
│   ├── server.ts
│   └── tcp.ts
│
├── README.md
├── LICENSE
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/Hiba-khan01/HTTPForge.git
cd HTTPForge
```

Install dependencies

```bash
npm install
```

Run the server

```bash
npx tsx src/server.ts
```

---

## 🧪 Example Requests

### Default Route

```bash
curl.exe http://127.0.0.1:1234
```

Response

```text
hello world.
```

### Echo Endpoint

```bash
curl.exe --data-binary "hello" http://127.0.0.1:1234/echo
```

Response

```text
hello
```

---

## 📖 What I'm Learning

This project focuses on understanding how an HTTP server works internally, including:

- TCP socket programming
- Buffer management
- Asynchronous I/O
- HTTP/1.1 protocol
- Request parsing
- Response generation
- Streaming request bodies
- Persistent connections
- Network protocol design

---

## 🚧 Roadmap

- ✅ TCP networking
- ✅ HTTP request parsing
- ✅ HTTP response generation
- ✅ Request body handling
- ✅ Echo endpoint
- ⏳ Static file server
- ⏳ MIME type detection
- ⏳ Chunked transfer encoding
- ⏳ Compression
- ⏳ Caching
- ⏳ WebSockets

---

## 📚 Learning Resource

This project is inspired by the concepts from the **Build Your Own Web Server** book. The implementation is written from scratch in TypeScript while following the ideas presented in the book.

---

## 👩‍💻 Author

**Hiba Khan**

GitHub: https://github.com/Hiba-khan01

---

⭐ If you like the project, consider giving it a star.