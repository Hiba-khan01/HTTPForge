import { HTTPReq, HTTPRes, BodyReader } from "./http";
import { readerFromMemory } from "./body";

// Handle one HTTP request
export async function handleReq(
    req: HTTPReq,
    body: BodyReader
): Promise<HTTPRes> {

    let respBody: BodyReader;

    switch (req.uri.toString("latin1")) {

        case "/echo":
            // Echo request body
            respBody = body;
            break;

        default:
            // Default response
            respBody = readerFromMemory(
                Buffer.from("hello world.\n")
            );
            break;
    }

    return {
        code: 200,
        headers: [
            Buffer.from("Server: HTTPForge"),
        ],
        body: respBody,
    };
}