import { TCPConn, soWrite } from "./tcp";
import { HTTPRes } from "./http";

// Send an HTTP response
export async function writeHTTPResp(
    conn: TCPConn,
    resp: HTTPRes
): Promise<void> {

    if (resp.body.length < 0) {
        throw new Error("TODO: chunked encoding");
    }

    console.assert(
        !fieldGet(resp.headers, "Content-Length")
    );

    resp.headers.push(
        Buffer.from(
            `Content-Length: ${resp.body.length}`
        )
    );

    await soWrite(conn, encodeHTTPResp(resp));

    try {

        while (true) {

            const chunk =
                await resp.body.read();

            if (chunk.length === 0) {
                break;
            }

            await soWrite(conn, chunk);
        }

    } finally {

        if (resp.body.close) {
            await resp.body.close();
        }
    }
}

function encodeHTTPResp(resp: HTTPRes): Buffer {

    let out =
        `HTTP/1.1 ${resp.code} ${statusText(resp.code)}\r\n`;

    for (const h of resp.headers) {
        out += h.toString("latin1") + "\r\n";
    }

    out += "\r\n";

    return Buffer.from(out, "latin1");
}

function fieldGet(
    headers: Buffer[],
    key: string
): Buffer | null {

    key = key.toLowerCase();

    for (const h of headers) {

        const text = h.toString("latin1");

        const idx = text.indexOf(":");

        if (idx < 0) {
            continue;
        }

        const name =
            text.slice(0, idx)
                .trim()
                .toLowerCase();

        if (name === key) {

            return Buffer.from(
                text.slice(idx + 1).trim(),
                "latin1"
            );
        }
    }

    return null;
}

function statusText(code: number): string {

    switch (code) {

        case 200:
            return "OK";

        case 206:
            return "Partial Content";

        case 304:
            return "Not Modified";

        case 400:
            return "Bad Request";

        case 404:
            return "Not Found";

        case 413:
            return "Payload Too Large";

        case 500:
            return "Internal Server Error";

        case 501:
            return "Not Implemented";
        
        default:
            return "Unknown";

    }
}