import { HTTPReq, HTTPRes, BodyReader } from "./http";
import { readerFromMemory } from "./body";
import { serveStatic } from "./static";

// Handle one HTTP request
export async function handleReq(
    req: HTTPReq,
    body: BodyReader
): Promise<HTTPRes> {

    // Echo endpoint
    if (
        req.method === "POST" &&
        req.uri.toString("latin1") === "/echo"
    ) {
        return {
            code: 200,
            headers: [
                Buffer.from("Server: HTTPForge"),
                Buffer.from("Content-Type: text/plain"),
            ],
            body,
        };
    }

    // Serve static files
    const file = await serveStatic(req);

    if (file) {
        return file;
    }

    // 404
    return {
        code: 404,
        headers: [
            Buffer.from("Server: HTTPForge"),
            Buffer.from("Content-Type: text/plain"),
        ],
        body: readerFromMemory(
            Buffer.from("404 Not Found\n")
        ),
    };
}