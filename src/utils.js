"use strict";
// Utility functions for HTTP parsing
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitLines = splitLines;
exports.parseRequestLine = parseRequestLine;
exports.validateHeader = validateHeader;
exports.parseRangeHeader = parseRangeHeader;
// ===============================
// Split an HTTP header into CRLF-separated lines
// ===============================
function splitLines(data) {
    return data
        .toString("latin1")
        .split("\r\n")
        .map(line => Buffer.from(line, "latin1"));
}
// ===============================
// Parse request line
// Example:
// GET / HTTP/1.1
// ===============================
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
// ===============================
// Validate HTTP header
// ===============================
function validateHeader(header) {
    const text = header.toString("latin1");
    const idx = text.indexOf(":");
    return idx > 0;
}
// Parse:
//
// Range: bytes=100-500
//
// Returns:
//
// { start:100, end:500 }
//
// or null if header doesn't exist.
function parseRangeHeader(headers) {
    for (const h of headers) {
        const text = h.toString("latin1");
        if (!text.toLowerCase().startsWith("range:")) {
            continue;
        }
        const value = text
            .substring(text.indexOf(":") + 1)
            .trim();
        if (!value.startsWith("bytes=")) {
            return null;
        }
        const range = value.substring(6);
        const dash = range.indexOf("-");
        if (dash < 0) {
            return null;
        }
        const start = Number.parseInt(range.substring(0, dash), 10);
        const end = Number.parseInt(range.substring(dash + 1), 10);
        if (Number.isNaN(start) ||
            Number.isNaN(end) ||
            start < 0 ||
            end < start) {
            return null;
        }
        return {
            start,
            end,
        };
    }
    return null;
}
