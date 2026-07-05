# 🚀 HTTPForge

> Building an HTTP/1.1 Server from Scratch using **Node.js** and **TypeScript**

HTTPForge is my journey of building an HTTP server completely from scratch without using frameworks like Express or Fastify. The goal of this project is to understand how networking, TCP sockets, protocols, and HTTP work under the hood by implementing everything step by step.

---

## 📖 About the Project

Most developers use web frameworks every day but never see how they actually work internally.

HTTPForge focuses on learning the fundamentals by implementing:

- TCP Socket Programming
- Event-driven Networking
- Promise-based Socket APIs
- Custom Network Protocols
- HTTP/1.1
- Static File Serving
- Caching
- Compression
- WebSockets

Everything is built incrementally.

---

## ✨ Features Implemented

### ✅ Chapter 1 – Introduction

- Project setup
- Networking fundamentals
- Understanding how web servers work

---

### ✅ Chapter 2 – HTTP Overview

- HTTP Request structure
- HTTP Response structure
- HTTP Versions
- Request/Response lifecycle

---

### ✅ Chapter 3 – TCP Echo Server

- TCP Server
- Socket Programming
- Reading Buffers
- Writing Buffers
- Echo Server implementation

---

### ✅ Chapter 4 – Promise-based TCP API

- Promise wrapper around TCP sockets
- `async / await`
- Event → Promise conversion
- Backpressure (`pause()` / `resume()`)
- `soRead()`
- `soWrite()`
- Async Echo Server

---

### ✅ Chapter 5 – Simple Network Protocol

- Dynamic Buffer implementation
- Growing Buffers
- Buffer Push
- Buffer Pop
- Message Parser
- Newline-delimited Protocol
- Multiple Message Handling
- Pipelined Requests

---

## 🚧 Upcoming Features

- HTTP Request Parser
- HTTP Response Generator
- Static File Server
- MIME Types
- File I/O
- Range Requests
- Cache Control
- Compression
- Streams
- WebSockets
- Logging
- Performance Improvements

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| TypeScript | Programming Language |
| Node.js | Runtime |
| net Module | TCP Networking |
| npm | Package Manager |

---

# 📂 Project Structure

```
HTTPForge
│
├── src
│   ├── server.ts
│   ├── tcp.ts
│   ├── dynbuf.ts
│   └── protocol.ts
│
├── playground
│   └── promise-demo.ts
│
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/Hiba-khan01/HTTPForge.git
cd HTTPForge
```

---

## Install Dependencies

```bash
npm install
```

---

## Run the Server

```bash
npx tsx src/server.ts
```

Expected output

```
🚀 HTTPForge running on 127.0.0.1:1234
```

---

# 🧪 Testing

Connect to the server using **Ncat**.

```bash
ncat 127.0.0.1 1234
```

Example

```
hello
Echo: hello

hii
Echo: hii

quit
Bye.
```

---

# 📚 What I'm Learning

This project covers

- TCP Socket Programming
- Event Loop
- Buffers
- Dynamic Buffers
- Streams
- Promise-based APIs
- Async/Await
- Backpressure
- Protocol Design
- HTTP Internals
- Network Programming

---

# 📈 Progress

```
█████░░░░░░░░░░░░░░ 5 / 14 Chapters

✅ Chapter 1
✅ Chapter 2
✅ Chapter 3
✅ Chapter 4
✅ Chapter 5
⬜ Chapter 6
⬜ Chapter 7
⬜ Chapter 8
⬜ Chapter 9
⬜ Chapter 10
⬜ Chapter 11
⬜ Chapter 12
⬜ Chapter 13
⬜ Chapter 14
```

---

# 🎯 Current Milestone

✅ Implemented a custom newline-delimited network protocol using dynamic buffers.

**Next Goal:**

➡️ Build an HTTP/1.1 Request Parser

---

# 📸 Demo

```
Client
│
├── hello
│
└── Echo: hello

Client
│
├── hii
│
└── Echo: hii

Client
│
├── quit
│
└── Bye.
```

---

# 🎓 Learning Resource

This project is inspired by the concepts from the **Build Your Own Web Server** book and is implemented independently as a learning exercise.

---

# 🤝 Contributing

Suggestions, improvements, and discussions are always welcome.

Feel free to fork the repository and open a Pull Request.

---

# 👩‍💻 Author

**Hiba Khan**

GitHub: **https://github.com/Hiba-khan01**

---

# ⭐ Support

If you found this project interesting or helpful, consider giving it a ⭐ on GitHub.