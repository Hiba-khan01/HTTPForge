import { promises as fs } from "fs";
import * as path from "path";

import { HTTPReq, HTTPRes } from "./http";
import { readerFromFile } from "./body";
import { getMimeType } from "./mime";
import { serveDirectory } from "./directory";
import {
    parseRangeHeader,
    generateETag,
    lastModified,
    getHeader,
} from "./utils";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function serveStatic(
    req: HTTPReq
): Promise<HTTPRes | null> {

    let reqPath = req.uri.toString("latin1");

    if (reqPath === "") {
        reqPath = "/";
    }

    const filePath = path.normalize(
        path.join(PUBLIC_DIR, reqPath)
    );

    if (!filePath.startsWith(PUBLIC_DIR)) {
        return null;
    }

    try {

        const stat = await fs.stat(filePath);

        if (stat.isDirectory()) {

            const indexFile = path.join(
                filePath,
                "index.html"
            );

            try {

                const indexStat =
                    await fs.stat(indexFile);

                if (indexStat.isFile()) {

                    const etag =
                        generateETag(indexStat);

                    if (
                        getHeader(
                            req.headers,
                            "If-None-Match"
                        ) === etag
                    ) {

                        return {
                            code: 304,
                            headers: [
                                Buffer.from("Server: HTTPForge"),
                                Buffer.from(`ETag: ${etag}`),
                                Buffer.from(
                                    `Last-Modified: ${lastModified(indexStat)}`
                                ),
                            ],
                            body: await readerFromFile(
                                indexFile,
                                {
                                    start: 0,
                                    end: -1,
                                }
                            ),
                        };
                    }

                    return {
                        code: 200,
                        headers: [
                            Buffer.from("Server: HTTPForge"),
                            Buffer.from(
                                `Content-Type: ${getMimeType(indexFile)}`
                            ),
                            Buffer.from(
                                `ETag: ${etag}`
                            ),
                            Buffer.from(
                                `Last-Modified: ${lastModified(indexStat)}`
                            ),
                            Buffer.from(
                                "Accept-Ranges: bytes"
                            ),
                        ],
                        body: await readerFromFile(
                            indexFile
                        ),
                    };
                }

            } catch {
            }

            return await serveDirectory(
                filePath,
                reqPath.endsWith("/")
                    ? reqPath
                    : reqPath + "/"
            );
        }

        const etag =
            generateETag(stat);

        if (
            getHeader(
                req.headers,
                "If-None-Match"
            ) === etag
        ) {

            return {
                code: 304,
                headers: [
                    Buffer.from("Server: HTTPForge"),
                    Buffer.from(`ETag: ${etag}`),
                    Buffer.from(
                        `Last-Modified: ${lastModified(stat)}`
                    ),
                ],
                                body: {
                    length: 0,

                    async read(): Promise<Buffer> {
                        return Buffer.alloc(0);
                    },
                },
            };
        }

        const range =
            parseRangeHeader(req.headers);

        if (range) {

            if (range.end >= stat.size) {
                range.end = stat.size - 1;
            }

            return {

                code: 206,

                headers: [

                    Buffer.from("Server: HTTPForge"),

                    Buffer.from(
                        `Content-Type: ${getMimeType(filePath)}`
                    ),

                    Buffer.from(
                        "Accept-Ranges: bytes"
                    ),

                    Buffer.from(
                        `ETag: ${etag}`
                    ),

                    Buffer.from(
                        `Last-Modified: ${lastModified(stat)}`
                    ),

                    Buffer.from(
                        `Content-Range: bytes ${range.start}-${range.end}/${stat.size}`
                    ),

                ],

                body: await readerFromFile(
                    filePath,
                    {
                        start: range.start,
                        end: range.end,
                    }
                ),
            };
        }

        return {

            code: 200,

            headers: [

                Buffer.from("Server: HTTPForge"),

                Buffer.from(
                    `Content-Type: ${getMimeType(filePath)}`
                ),

                Buffer.from(
                    "Accept-Ranges: bytes"
                ),

                Buffer.from(
                    `ETag: ${etag}`
                ),

                Buffer.from(
                    `Last-Modified: ${lastModified(stat)}`
                ),

            ],

            body: await readerFromFile(filePath),
        };

    } catch {

        return null;
    }
}