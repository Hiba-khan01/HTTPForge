import * as net from "net";
import { soInit, soRead, soWrite, TCPConn } from "./tcp";

// Handle one client
async function serveClient(socket: net.Socket): Promise<void> {
    const conn: TCPConn = soInit(socket);

    while (true) {
        const data = await soRead(conn);

        // Empty buffer means EOF
        if (data.length === 0) {
            console.log("🔌 Client disconnected");
            break;
        }

        console.log("📩 Received:", data.toString());

        await soWrite(conn, data);
    }
}

// Called whenever a client connects
async function newConn(socket: net.Socket): Promise<void> {
    console.log("🎉 New client connected!");
    console.log("IP Address:", socket.remoteAddress);
    console.log("Port:", socket.remotePort);

    try {
        await serveClient(socket);
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        socket.destroy();
    }
}

// Create server
const server = net.createServer({
    pauseOnConnect: true,
});

server.on("connection", (socket) => {
    newConn(socket);
});

server.listen(1234, "127.0.0.1", () => {
    console.log("🚀 HTTPForge is running on 127.0.0.1:1234");
});