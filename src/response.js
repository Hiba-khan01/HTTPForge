"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeHTTPResp = writeHTTPResp;
const tcp_1 = require("./tcp");
// Send an HTTP response
async function writeHTTPResp(conn, resp) {
    if (resp.body.length < 0) {
        throw new Error("TODO: chunked encoding");
    }
    // Add Content-Length
    console.assert(!fieldGet(resp.headers, "Content-Length"));
    resp.headers.push(Buffer.from(`Content-Length: ${resp.body.length}`));
    // Send header
    await (0, tcp_1.soWrite)(conn, encodeHTTPResp(resp));
    // Send body
    while (true) {
        const data = await resp.body.read();
        if (data.length === 0) {
            break;
        }
        await (0, tcp_1.soWrite)(conn, data);
    }
}
// Encode HTTP response header
function encodeHTTPResp(resp) {
    const reason = statusText(resp.code);
    let out = `HTTP/1.1 ${resp.code} ${reason}\r\n`;
    for (const h of resp.headers) {
        out += h.toString("latin1") + "\r\n";
    }
    out += "\r\n";
    return Buffer.from(out, "latin1");
}
// Find a header field
function fieldGet(headers, key) {
    key = key.toLowerCase();
    for (const h of headers) {
        const text = h.toString("latin1");
        const idx = text.indexOf(":");
        if (idx < 0) {
            continue;
        }
        const name = text.slice(0, idx).trim().toLowerCase();
        if (name === key) {
            return Buffer.from(text.slice(idx + 1).trim(), "latin1");
        }
    }
    return null;
}
// HTTP status text
function statusText(code) {
    switch (code) {
        case 200:
            return "OK";
        case 400:
            return "Bad Request";
        case 404:
            return "Not Found";
        case 413:
            return "Payload Too Large";
        case 500:
            return "Internal Server Error";
        case 501:
            return "Not Implemented";
        default:
            return "Unknown";
    }
}
