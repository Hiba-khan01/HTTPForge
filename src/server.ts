import * as net from "net";
import { soInit, soRead, soWrite, TCPConn } from "./tcp";
import { DynBuf, bufPush } from "./dynbuf";
import { cutMessage } from "./protocol";

// Handle one client
async function serveClient(socket: net.Socket): Promise<void> {
    const conn: TCPConn = soInit(socket);

    const buf: DynBuf = {
        data: Buffer.alloc(0),
        length: 0,
    };

    while (true) {
        // Try to extract one complete message
        const msg = cutMessage(buf);

        if (!msg) {
            // Need more data
            const data = await soRead(conn);

            bufPush(buf, data);

            // EOF
            if (data.length === 0) {
                console.log("🔌 Client disconnected");
                return;
            }

            continue;
        }

       // Process message
        const text = msg.toString().trim();

        console.log(JSON.stringify(text));

        if (text === "quit") {
            await soWrite(conn, Buffer.from("Bye.\n"));
            socket.destroy();
            return;
        } else {
            const reply = Buffer.from(`Echo: ${text}\n`);
            await soWrite(conn, reply);
        }
            }
}

// Handle new connection
async function newConn(socket: net.Socket): Promise<void> {
    console.log("🎉 New Client Connected");
    console.log("IP:", socket.remoteAddress);
    console.log("Port:", socket.remotePort);

    try {
        await serveClient(socket);
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        socket.destroy();
    }
}

// Create TCP server
const server = net.createServer({
    pauseOnConnect: true,
});

server.on("connection", (socket) => {
    void newConn(socket);
});

server.listen(1234, "127.0.0.1", () => {
    console.log("🚀 HTTPForge running on 127.0.0.1:1234");
});