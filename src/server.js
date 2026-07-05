"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const tcp_1 = require("./tcp");
const dynbuf_1 = require("./dynbuf");
const http_1 = require("./http");
const protocol_1 = require("./protocol");
const body_1 = require("./body");
const handler_1 = require("./handler");
const response_1 = require("./response");
async function serveClient(conn) {
    const buf = {
        data: Buffer.alloc(0),
        length: 0,
    };
    while (true) {
        // Try to parse one request
        const msg = (0, protocol_1.cutMessage)(buf);
        if (!msg) {
            // Need more data
            const data = await (0, tcp_1.soRead)(conn);
            (0, dynbuf_1.bufPush)(buf, data);
            // EOF
            if (data.length === 0 && buf.length === 0) {
                return;
            }
            if (data.length === 0) {
                throw new http_1.HTTPError(400, "Unexpected EOF.");
            }
            continue;
        }
        // Read request body
        const reqBody = (0, body_1.readerFromReq)(conn, buf, msg);
        // Handle request
        const res = await (0, handler_1.handleReq)(msg, reqBody);
        // Send response
        await (0, response_1.writeHTTPResp)(conn, res);
        // Close HTTP/1.0 connection
        if (msg.version === "1.0") {
            return;
        }
        // Consume remaining body
        while ((await reqBody.read()).length > 0) {
            // empty
        }
    }
}
async function newConn(socket) {
    const conn = (0, tcp_1.soInit)(socket);
    try {
        await serveClient(conn);
    }
    catch (exc) {
        console.error("exception:", exc);
        if (exc instanceof http_1.HTTPError) {
            const resp = {
                code: exc.code,
                headers: [],
                body: (0, body_1.readerFromMemory)(Buffer.from(exc.message + "\n")),
            };
            try {
                await (0, response_1.writeHTTPResp)(conn, resp);
            }
            catch {
                // ignore
            }
        }
    }
    finally {
        socket.destroy();
    }
}
const server = net.createServer({
    pauseOnConnect: true,
    noDelay: true,
});
server.on("connection", (socket) => {
    void newConn(socket);
});
server.listen(1234, "127.0.0.1", () => {
    console.log("🚀 HTTPForge listening on http://127.0.0.1:1234");
});
