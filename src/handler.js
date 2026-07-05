"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReq = handleReq;
const body_1 = require("./body");
// Handle one HTTP request
async function handleReq(req, body) {
    let respBody;
    switch (req.uri.toString("latin1")) {
        case "/echo":
            // Echo request body
            respBody = body;
            break;
        default:
            // Default response
            respBody = (0, body_1.readerFromMemory)(Buffer.from("hello world.\n"));
            break;
    }
    return {
        code: 200,
        headers: [
            Buffer.from("Server: my_first_http_server"),
        ],
        body: respBody,
    };
}
