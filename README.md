# 🚀 HTTPForge

> Building an HTTP/1.1 Server from Scratch using Node.js and TypeScript

HTTPForge is a learning project where I am implementing an HTTP server from the ground up without using frameworks like Express. The goal is to understand how networking, TCP sockets, HTTP, asynchronous programming, and web servers work internally.

This project follows the "Build Your Own Web Server" approach and is being developed incrementally.

---

## 📚 Project Goals

- Learn TCP socket programming
- Understand how HTTP works internally
- Build an HTTP/1.1 server from scratch
- Learn event-driven programming in Node.js
- Master Promises and async/await
- Understand backpressure and asynchronous I/O
- Implement real web server features step by step

---

## 🛠 Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Networking:** Node.js `net` module
- **Package Manager:** npm

---

## ✅ Progress

### Chapter 1 - Introduction
- [x] Project setup
- [x] Understanding networking basics

### Chapter 2 - HTTP Overview
- [x] HTTP request and response structure
- [x] HTTP versions
- [x] Manual HTTP requests using Netcat

### Chapter 3 - TCP Echo Server
- [x] TCP server
- [x] Socket programming
- [x] Buffer handling
- [x] Echo server implementation

### Chapter 4 - Promises & Events
- [x] Promise-based socket wrapper (`TCPConn`)
- [x] `soRead()`
- [x] `soWrite()`
- [x] Async/Await echo server
- [x] Event to Promise conversion

### Upcoming

- [ ] HTTP Request Parser
- [ ] HTTP Response Generator
- [ ] Static File Server
- [ ] MIME Types
- [ ] Range Requests
- [ ] Cache Control
- [ ] Compression
- [ ] WebSockets

---

## 📂 Project Structure

```
HTTPForge/
│
├── src/
│   ├── server.ts        # TCP Echo Server
│   ├── tcp.ts           # Promise-based TCP wrapper
│   └── promise-demo.ts  # Promise experiments
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

### Run the server

```bash
npx tsx src/server.ts
```

Expected output:

```
🚀 HTTPForge is running on 127.0.0.1:1234
```

---

## 🧪 Testing

Connect using Ncat:

```bash
ncat 127.0.0.1 1234
```

Type any message.

Example:

```
Hello HTTPForge!
```

The server echoes it back.

---

## 📖 Learning Outcomes

This project covers:

- TCP sockets
- Event Loop
- Buffers
- Streams
- Promise-based APIs
- async/await
- Backpressure
- HTTP Protocol
- Network Programming

---

## 🎯 Current Status

**Current Chapter:** 4 ✅

Next milestone:

➡️ Build an HTTP/1.1 Request Parser

---

## 📚 Learning Resource

This project follows the concepts taught in the **Build Your Own Web Server** book while implementing the code independently as a learning exercise.

---

## ⭐ Future Features

- HTTP/1.1 Server
- Routing
- Static File Hosting
- MIME Type Detection
- Range Requests
- Compression
- Caching
- WebSocket Support
- Logging
- Better Error Handling

---

## 👩‍💻 Author

**Hiba Khan**

GitHub: https://github.com/Hiba-khan01

---

If you found this project interesting, consider giving it a ⭐.