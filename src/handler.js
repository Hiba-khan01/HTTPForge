"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReq = handleReq;
const body_1 = require("./body");
const static_1 = require("./static");
// Handle one HTTP request
async function handleReq(req, body) {
    // Echo endpoint
    if (req.uri.toString("latin1") === "/echo") {
        return {
            code: 200,
            headers: [
                Buffer.from("Server: HTTPForge"),
                Buffer.from("Content-Type: text/plain"),
            ],
            body: body,
        };
    }
    // Try serving a static file
    const file = await (0, static_1.serveStatic)(req.uri);
    if (file) {
        return file;
    }
    // 404 Not Found
    return {
        code: 404,
        headers: [
            Buffer.from("Server: HTTPForge"),
            Buffer.from("Content-Type: text/plain"),
        ],
        body: (0, body_1.readerFromMemory)(Buffer.from("404 Not Found\n")),
    };
}
