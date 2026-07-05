import * as net from "net";

import { TCPConn, soInit, soRead } from "./tcp";
import { DynBuf, bufPush } from "./dynbuf";

import { HTTPReq, HTTPRes, HTTPError, BodyReader } from "./http";
import { cutMessage } from "./protocol";
import { readerFromReq, readerFromMemory } from "./body";
import { handleReq } from "./handler";
import { writeHTTPResp } from "./response";

async function serveClient(conn: TCPConn): Promise<void> {
    const buf: DynBuf = {
        data: Buffer.alloc(0),
        length: 0,
    };

    while (true) {
        // Try to parse one request
        const msg: HTTPReq | null = cutMessage(buf);

        if (!msg) {
            // Need more data
            const data = await soRead(conn);

            bufPush(buf, data);

            // EOF
            if (data.length === 0 && buf.length === 0) {
                return;
            }

            if (data.length === 0) {
                throw new HTTPError(400, "Unexpected EOF.");
            }

            continue;
        }

        // Read request body
        const reqBody: BodyReader = readerFromReq(
            conn,
            buf,
            msg
        );

        // Handle request
        const res: HTTPRes = await handleReq(
            msg,
            reqBody
        );

        // Send response
        await writeHTTPResp(conn, res);

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

async function newConn(socket: net.Socket): Promise<void> {
    const conn: TCPConn = soInit(socket);

    try {
        await serveClient(conn);
    } catch (exc) {
        console.error("exception:", exc);

        if (exc instanceof HTTPError) {
            const resp: HTTPRes = {
                code: exc.code,
                headers: [],
                body: readerFromMemory(
                    Buffer.from(exc.message + "\n")
                ),
            };

            try {
                await writeHTTPResp(conn, resp);
            } catch {
                // ignore
            }
        }
    } finally {
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
    console.log(
        "🚀 HTTPForge listening on http://127.0.0.1:1234"
    );
});