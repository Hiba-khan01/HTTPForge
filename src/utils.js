"use strict";
// Utility functions for HTTP parsing
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitLines = splitLines;
exports.parseRequestLine = parseRequestLine;
exports.validateHeader = validateHeader;
// Split an HTTP header into CRLF-separated lines
function splitLines(data) {
    return data
        .toString("latin1")
        .split("\r\n")
        .map(line => Buffer.from(line, "latin1"));
}
// Parse request line:
// GET / HTTP/1.1
function parseRequestLine(line) {
    const parts = line.toString("latin1").split(" ");
    if (parts.length !== 3) {
        throw new Error("Invalid request line");
    }
    const [method, uri, version] = parts;
    if (!version.startsWith("HTTP/")) {
        throw new Error("Invalid HTTP version");
    }
    return [
        method,
        Buffer.from(uri, "latin1"),
        version.substring(5),
    ];
}
// Basic validation for header fields
function validateHeader(header) {
    const text = header.toString("latin1");
    const idx = text.indexOf(":");
    if (idx <= 0) {
        return false;
    }
    return true;
}
