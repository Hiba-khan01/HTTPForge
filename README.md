# 🚀 HTTPForge

> Building an HTTP/1.1 server from scratch using Node.js and TypeScript.

HTTPForge is a project where I'm building an HTTP server from scratch to better understand how web servers and networking work behind the scenes.

Instead of relying on frameworks like Express, I'm implementing everything step by step—from TCP sockets to HTTP parsing—to learn how requests travel through the network and how servers process them internally.

This repository will be updated as I progress through each chapter.

---

## 📚 Project Goals

- Understand TCP socket programming
- Learn how HTTP works internally
- Build an HTTP/1.1 server from scratch
- Learn asynchronous programming with Promises and async/await
- Understand protocol parsing and network communication
- Explore concepts like buffering, caching, compression, and WebSockets

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Networking:** Node.js `net` module

---

## ✅ Progress

### Chapter 1 – Introduction
- ✔ Project setup
- ✔ Networking fundamentals

### Chapter 2 – HTTP Overview
- ✔ HTTP requests and responses
- ✔ HTTP versions
- ✔ Understanding the request-response lifecycle

### Chapter 3 – TCP Echo Server
- ✔ Built a TCP server
- ✔ Worked with sockets and buffers
- ✔ Implemented an echo server

### Chapter 4 – Promise-based TCP API
- ✔ Promise wrapper around TCP sockets
- ✔ async/await
- ✔ Event → Promise conversion
- ✔ Backpressure using `pause()` and `resume()`
- ✔ Async echo server

### Chapter 5 – Simple Network Protocol
- ✔ Dynamic buffer implementation
- ✔ Message parsing
- ✔ Newline-delimited protocol
- ✔ Handling multiple messages over a single TCP connection

---

## 🚧 Coming Next

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

---

## 📂 Project Structure

```text
HTTPForge/
│
├── src/
│   ├── server.ts
│   ├── tcp.ts
│   ├── dynbuf.ts
│   └── protocol.ts
│
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
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

## 🧪 Testing

Connect using Ncat:

```bash
ncat 127.0.0.1 1234
```

Example:

```text
hello
Echo: hello

how are you
Echo: how are you

quit
Bye.
```

---

## 📖 What I'm Learning

This project is helping me understand:

- TCP Socket Programming
- Buffers & Dynamic Buffers
- Event-driven Programming
- Promises & async/await
- Protocol Design
- HTTP Internals
- Network Programming

---

## 📈 Current Progress

```
█████░░░░░░░░░░░░░░

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

## 🎯 Why I Started This Project

I wanted to go beyond using web frameworks and understand how they actually work internally. Building an HTTP server from scratch is helping me learn networking, asynchronous programming, and the HTTP protocol in a much deeper way.

---

## 📚 Learning Resource

This project follows the concepts from the **Build Your Own Web Server** book. I'm implementing the code myself while working through each chapter and understanding the underlying concepts.

---

## 👩‍💻 Author

**Hiba Khan**

GitHub: **https://github.com/Hiba-khan01**

---

⭐ If you find this project interesting, feel free to star the repository.