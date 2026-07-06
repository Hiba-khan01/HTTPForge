"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readerFromMemory = readerFromMemory;
exports.readerFromReq = readerFromReq;
exports.readerFromFile = readerFromFile;
const fs_1 = require("fs");
const tcp_1 = require("./tcp");
const dynbuf_1 = require("./dynbuf");
const http_1 = require("./http");
// ======================================================
// Memory Body
// ======================================================
function readerFromMemory(data) {
    let done = false;
    return {
        length: data.length,
        async read() {
            if (done) {
                return Buffer.alloc(0);
            }
            done = true;
            return data;
        },
    };
}
// ======================================================
// Header Helpers
// ======================================================
function fieldGet(headers, key) {
    key = key.toLowerCase();
    for (const h of headers) {
        const text = h.toString("latin1");
        const idx = text.indexOf(":");
        if (idx < 0) {
            continue;
        }
        const name = text.slice(0, idx)
            .trim()
            .toLowerCase();
        if (name === key) {
            return Buffer.from(text.slice(idx + 1).trim(), "latin1");
        }
    }
    return null;
}
function parseDec(text) {
    return Number.parseInt(text, 10);
}
// ======================================================
// HTTP Request Body
// ======================================================
function readerFromReq(conn, buf, req) {
    let bodyLen = -1;
    const contentLen = fieldGet(req.headers, "Content-Length");
    if (contentLen) {
        bodyLen = parseDec(contentLen.toString("latin1"));
        if (Number.isNaN(bodyLen)) {
            throw new http_1.HTTPError(400, "bad Content-Length");
        }
    }
    const bodyAllowed = !(req.method === "GET" ||
        req.method === "HEAD");
    if (!bodyAllowed) {
        bodyLen = 0;
    }
    return readerFromConnLength(conn, buf, bodyLen);
}
// ======================================================
// Fixed-Length Connection Reader
// ======================================================
function readerFromConnLength(conn, buf, remain) {
    return {
        length: remain,
        async read() {
            if (remain === 0) {
                return Buffer.alloc(0);
            }
            if (buf.length === 0) {
                const data = await (0, tcp_1.soRead)(conn);
                if (data.length === 0) {
                    throw new Error("Unexpected EOF");
                }
                (0, dynbuf_1.bufPush)(buf, data);
            }
            const consume = Math.min(remain, buf.length);
            const chunk = Buffer.from(buf.data.subarray(0, consume));
            remain -= consume;
            (0, dynbuf_1.bufPop)(buf, consume);
            return chunk;
        },
    };
}
// ======================================================
// File Reader (NEW)
// ======================================================
async function readerFromFile(filePath) {
    const handle = await fs_1.promises.open(filePath, "r");
    const stat = await handle.stat();
    let offset = 0;
    const CHUNK_SIZE = 64 * 1024;
    return {
        length: stat.size,
        async read() {
            if (offset >= stat.size) {
                return Buffer.alloc(0);
            }
            const size = Math.min(CHUNK_SIZE, stat.size - offset);
            const buffer = Buffer.alloc(size);
            const { bytesRead } = await handle.read(buffer, 0, size, offset);
            offset += bytesRead;
            return buffer.subarray(0, bytesRead);
        },
        async close() {
            await handle.close();
        },
    };
}
