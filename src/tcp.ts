import * as net from "net";

// Promise-based wrapper around Node.js Socket
export type TCPConn = {
    socket: net.Socket;

    // Error from the "error" event
    err: Error | null;

    // True after EOF
    ended: boolean;

    // Current pending read promise
    reader: null | {
        resolve: (value: Buffer) => void;
        reject: (reason: Error) => void;
    };
};

// Create wrapper
export function soInit(socket: net.Socket): TCPConn {
    const conn: TCPConn = {
        socket: socket,
        err: null,
        ended: false,
        reader: null,
    };

    // Data received
    socket.on("data", (data: Buffer) => {
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
    socket.on("error", (err: Error) => {
        conn.err = err;

        if (conn.reader) {
            conn.reader.reject(err);
            conn.reader = null;
        }
    });

    return conn;
}

// Promise-based socket read
export function soRead(conn: TCPConn): Promise<Buffer> {
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
export function soWrite(conn: TCPConn, data: Buffer): Promise<void> {
    if (data.length === 0) {
        throw new Error("Cannot write empty buffer.");
    }

    return new Promise((resolve, reject) => {
        if (conn.err) {
            reject(conn.err);
            return;
        }

        conn.socket.write(data, (err?: Error | null) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}