"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soInit = soInit;
exports.soRead = soRead;
exports.soWrite = soWrite;
// Create wrapper
function soInit(socket) {
    const conn = {
        socket: socket,
        err: null,
        ended: false,
        reader: null,
    };
    // Data received
    socket.on("data", (data) => {
        if (!conn.reader) {
            throw new Error("No reader is waiting.");
        }
        conn.socket.pause();
        conn.reader.resolve(data);
        conn.reader = null;
    });
    // EOF
    socket.on("end", () => {
        conn.ended = true;
        if (conn.reader) {
            conn.reader.resolve(Buffer.from(""));
            conn.reader = null;
        }
    });
    // Error
    socket.on("error", (err) => {
        conn.err = err;
        if (conn.reader) {
            conn.reader.reject(err);
            conn.reader = null;
        }
    });
    return conn;
}
// Promise-based socket read
function soRead(conn) {
    if (conn.reader) {
        throw new Error("Another read is already pending.");
    }
    return new Promise((resolve, reject) => {
        // Error already happened
        if (conn.err) {
            reject(conn.err);
            return;
        }
        // EOF already happened
        if (conn.ended) {
            resolve(Buffer.from(""));
            return;
        }
        conn.reader = {
            resolve,
            reject,
        };
        conn.socket.resume();
    });
}
// Promise-based socket write
function soWrite(conn, data) {
    if (data.length === 0) {
        throw new Error("Cannot write empty buffer.");
    }
    return new Promise((resolve, reject) => {
        if (conn.err) {
            reject(conn.err);
            return;
        }
        conn.socket.write(data, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
