"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutMessage = cutMessage;
const dynbuf_1 = require("./dynbuf");
const http_1 = require("./http");
// Maximum allowed HTTP header size (8 KB)
const kMaxHeaderLen = 8 * 1024;
// Try to extract one complete HTTP request header
function cutMessage(buf) {
    // Look for "\r\n\r\n"
    const idx = buf.data
        .subarray(0, buf.length)
        .indexOf("\r\n\r\n");
    if (idx < 0) {
        if (buf.length >= kMaxHeaderLen) {
            throw new http_1.HTTPError(413, "header is too large");
        }
        return null;
    }
    const req = parseHTTPReq(buf.data.subarray(0, idx + 4));
    (0, dynbuf_1.bufPop)(buf, idx + 4);
    return req;
}
// Parse an HTTP request header
function parseHTTPReq(data) {
    const lines = splitLines(data);
    if (lines.length < 2) {
        throw new http_1.HTTPError(400, "bad request");
    }
    const [method, uri, version] = parseRequestLine(lines[0]);
    const headers = [];
    for (let i = 1; i < lines.length - 1; i++) {
        const h = Buffer.from(lines[i]);
        if (!validateHeader(h)) {
            throw new http_1.HTTPError(400, "bad field");
        }
        headers.push(h);
    }
    console.assert(lines[lines.length - 1].length === 0);
    return {
        method,
        uri,
        version,
        headers,
    };
}
// Split by CRLF
function splitLines(data) {
    return data
        .toString("latin1")
        .split("\r\n")
        .map(line => Buffer.from(line, "latin1"));
}
// Parse:
// GET / HTTP/1.1
function parseRequestLine(line) {
    const parts = line
        .toString("latin1")
        .trim()
        .split(" ");
    if (parts.length !== 3) {
        throw new http_1.HTTPError(400, "bad request line");
    }
    const [method, uri, version] = parts;
    if (!version.startsWith("HTTP/")) {
        throw new http_1.HTTPError(400, "bad version");
    }
    return [
        method,
        Buffer.from(uri, "latin1"),
        version.substring(5),
    ];
}
// Basic header validation
function validateHeader(header) {
    const text = header.toString("latin1");
    const idx = text.indexOf(":");
    return idx > 0;
}
