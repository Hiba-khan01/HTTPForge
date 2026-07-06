import { promises as fs } from "fs";

import { TCPConn, soRead } from "./tcp";
import { DynBuf, bufPush, bufPop } from "./dynbuf";
import { HTTPReq, BodyReader, HTTPError } from "./http";

// ======================================================
// Memory Body
// ======================================================

export function readerFromMemory(data: Buffer): BodyReader {

    let done = false;

    return {
        length: data.length,

        async read(): Promise<Buffer> {

            if (done) {
                return Buffer.alloc(0);
            }

            done = true;

            return data;
        },
    };
}

// ======================================================
// Header Helpers
// ======================================================

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

function parseDec(text: string): number {
    return Number.parseInt(text, 10);
}

// ======================================================
// HTTP Request Body
// ======================================================

export function readerFromReq(
    conn: TCPConn,
    buf: DynBuf,
    req: HTTPReq
): BodyReader {

    let bodyLen = -1;

    const contentLen =
        fieldGet(req.headers, "Content-Length");

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
        !(req.method === "GET" ||
          req.method === "HEAD");

    if (!bodyAllowed) {
        bodyLen = 0;
    }

    return readerFromConnLength(
        conn,
        buf,
        bodyLen
    );
}

// ======================================================
// Fixed-Length Connection Reader
// ======================================================

function readerFromConnLength(
    conn: TCPConn,
    buf: DynBuf,
    remain: number
): BodyReader {

    return {

        length: remain,

        async read(): Promise<Buffer> {

            if (remain === 0) {
                return Buffer.alloc(0);
            }

            if (buf.length === 0) {

                const data = await soRead(conn);

                if (data.length === 0) {
                    throw new Error(
                        "Unexpected EOF"
                    );
                }

                bufPush(buf, data);
            }

            const consume =
                Math.min(remain, buf.length);

            const chunk = Buffer.from(
                buf.data.subarray(0, consume)
            );

            remain -= consume;

            bufPop(buf, consume);

            return chunk;
        },
    };
}

// ======================================================
// File Reader (NEW)
// ======================================================

export async function readerFromFile(
    filePath: string
): Promise<BodyReader> {

    const handle =
        await fs.open(filePath, "r");

    const stat =
        await handle.stat();

    let offset = 0;

    const CHUNK_SIZE = 64 * 1024;

    return {

        length: stat.size,

        async read(): Promise<Buffer> {

            if (offset >= stat.size) {
                return Buffer.alloc(0);
            }

            const size = Math.min(
                CHUNK_SIZE,
                stat.size - offset
            );

            const buffer =
                Buffer.alloc(size);

            const { bytesRead } =
                await handle.read(
                    buffer,
                    0,
                    size,
                    offset
                );

            offset += bytesRead;

            return buffer.subarray(
                0,
                bytesRead
            );
        },

        async close() {

            await handle.close();
        },
    };
}