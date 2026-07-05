import { TCPConn, soRead } from "./tcp";
import { DynBuf, bufPush, bufPop } from "./dynbuf";
import { HTTPReq, BodyReader, HTTPError } from "./http";

// BodyReader from in-memory data
export function readerFromMemory(data: Buffer): BodyReader {
    let done = false;

    return {
        length: data.length,

        read: async (): Promise<Buffer> => {
            if (done) {
                return Buffer.from("");
            }

            done = true;
            return data;
        },
    };
}

// Look up an HTTP header (case-insensitive)
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

        const name = text.slice(0, idx).trim().toLowerCase();

        if (name === key) {
            return Buffer.from(
                text.slice(idx + 1).trim(),
                "latin1"
            );
        }
    }

    return null;
}

// Parse decimal integer
function parseDec(text: string): number {
    return Number.parseInt(text, 10);
}

// BodyReader from an HTTP request
export function readerFromReq(
    conn: TCPConn,
    buf: DynBuf,
    req: HTTPReq
): BodyReader {

    let bodyLen = -1;

    const contentLen = fieldGet(
        req.headers,
        "Content-Length"
    );

    if (contentLen) {
        bodyLen = parseDec(
            contentLen.toString("latin1")
        );

        if (Number.isNaN(bodyLen)) {
            throw new HTTPError(
                400,
                "bad Content-Length"
            );
        }
    }

    const bodyAllowed =
        !(req.method === "GET" || req.method === "HEAD");

    const transferEncoding = fieldGet(
        req.headers,
        "Transfer-Encoding"
    );

    const chunked =
        transferEncoding?.equals(
            Buffer.from("chunked")
        ) || false;

    if (!bodyAllowed && (bodyLen > 0 || chunked)) {
        throw new HTTPError(
            400,
            "HTTP body not allowed"
        );
    }

    if (!bodyAllowed) {
        bodyLen = 0;
    }

    if (bodyLen >= 0) {
        return readerFromConnLength(
            conn,
            buf,
            bodyLen
        );
    } else if (chunked) {
        throw new HTTPError(
            501,
            "TODO"
        );
    } else {
        throw new HTTPError(
            501,
            "TODO"
        );
    }
}

// BodyReader from a socket with known Content-Length
function readerFromConnLength(
    conn: TCPConn,
    buf: DynBuf,
    remain: number
): BodyReader {

    return {
        length: remain,

        read: async (): Promise<Buffer> => {

            if (remain === 0) {
                return Buffer.from("");
            }

            if (buf.length === 0) {
                const data = await soRead(conn);

                bufPush(buf, data);

                if (data.length === 0) {
                    throw new Error(
                        "Unexpected EOF from HTTP body"
                    );
                }
            }

            const consume = Math.min(
                buf.length,
                remain
            );

            remain -= consume;

            const data = Buffer.from(
                buf.data.subarray(0, consume)
            );

            bufPop(buf, consume);

            return data;
        },
    };
}