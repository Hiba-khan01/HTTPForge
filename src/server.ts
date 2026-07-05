import * as net from "net";

// Create a TCP server
const server = net.createServer();

// Handle new client connections
server.on("connection", (socket) => {
    console.log("🎉 New client connected!");
    console.log("IP Address:", socket.remoteAddress);
    console.log("Port:", socket.remotePort);

    // Receive data from the client
   
    socket.on("data", (data: Buffer) => {
        console.log("Buffer:", data);
        console.log("Hex:", data.toString("hex"));
        console.log("Text:", JSON.stringify(data.toString()));
        console.log("Length:", data.length);

          // Echo the data back to the client
        socket.write("I received your message!\n");
});
       
    // Client closed the connection
    socket.on("end", () => {
        console.log("👋 Client disconnected.");
    });

    // Handle socket errors
    socket.on("error", (err) => {
        console.error("❌ Socket Error:", err.message);
    });
});

// Handle server errors
server.on("error", (err) => {
    console.error("❌ Server Error:", err.message);
});

// Start listening
server.listen(
    {
        host: "127.0.0.1",
        port: 1234,
    },
    () => {
        console.log("🚀 HTTPForge is running on 127.0.0.1:1234");
    }
);