import { promises as fs } from "fs";

import { TCPConn, soRead } from "./tcp";
import { DynBuf, bufPush, bufPop } from "./dynbuf";
import { HTTPReq, BodyReader, HTTPError } from "./http";

// ======================================================
// Memory Body Reader
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

        const name = text
            .slice(0, idx)
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
// HTTP Request Body Reader
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

            while (buf.length === 0) {

                const data = await soRead(conn);

                if (data.length === 0) {
                    throw new Error("Unexpected EOF");
                }

                bufPush(buf, data);
            }

            const consume = Math.min(
                remain,
                buf.length
            );

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
// File Reader (supports byte ranges)
// ======================================================

export async function readerFromFile(
    filePath: string,
    range?: {
        start: number;
        end: number;
    }
): Promise<BodyReader> {

    const handle = await fs.open(filePath, "r");

    const stat = await handle.stat();

    const start =
        range?.start ?? 0;

    const end =
        range?.end ?? (stat.size - 1);

    if (
        start < 0 ||
        end < start ||
        end >= stat.size
    ) {

        await handle.close();

        throw new Error(
            "Invalid byte range"
        );
    }

    let offset = start;

    const CHUNK_SIZE = 64 * 1024;
        return {

        length: end - start + 1,

        async read(): Promise<Buffer> {

            if (offset > end) {
                return Buffer.alloc(0);
            }

            const size = Math.min(
                CHUNK_SIZE,
                end - offset + 1
            );

            const buffer = Buffer.alloc(size);

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

        async close(): Promise<void> {
            await handle.close();
        },
    };
}