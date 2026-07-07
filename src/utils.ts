// Utility functions for HTTP parsing

import { Stats } from "fs";

// ===============================
// Split an HTTP header into CRLF-separated lines
// ===============================
export function splitLines(data: Buffer): Buffer[] {
    return data
        .toString("latin1")
        .split("\r\n")
        .map(line => Buffer.from(line, "latin1"));
}

// ===============================
// Parse request line
// ===============================
export function parseRequestLine(
    line: Buffer
): [string, Buffer, string] {

    const parts = line.toString("latin1").split(" ");

    if (parts.length !== 3) {
        throw new Error("Invalid request line");
    }

    const [method, uri, version] = parts;

    if (!version.startsWith("HTTP/")) {
        throw new Error("Invalid HTTP version");
    }

    return [
        method,
        Buffer.from(uri, "latin1"),
        version.substring(5),
    ];
}

// ===============================
// Validate header
// ===============================
export function validateHeader(
    header: Buffer
): boolean {

    const text = header.toString("latin1");

    return text.indexOf(":") > 0;
}

// ===============================
// HTTP Range
// ===============================

export interface HTTPRange {
    start: number;
    end: number;
}

export function parseRangeHeader(
    headers: Buffer[]
): HTTPRange | null {

    for (const h of headers) {

        const text = h.toString("latin1");

        if (
            !text
                .toLowerCase()
                .startsWith("range:")
        ) {
            continue;
        }

        const value = text
            .substring(text.indexOf(":") + 1)
            .trim();

        if (!value.startsWith("bytes=")) {
            return null;
        }

        const range = value.substring(6);

        const dash = range.indexOf("-");

        if (dash < 0) {
            return null;
        }

        const start =
            Number.parseInt(
                range.substring(0, dash),
                10
            );

        const end =
            Number.parseInt(
                range.substring(dash + 1),
                10
            );

        if (
            Number.isNaN(start) ||
            Number.isNaN(end) ||
            start < 0 ||
            end < start
        ) {
            return null;
        }

        return { start, end };
    }

    return null;
}

// ===============================
// Generate ETag
// ===============================

export function generateETag(
    stat: Stats
): string {

    return `${stat.size}-${stat.mtimeMs}`;
}

// ===============================
// Format Last-Modified
// ===============================

export function lastModified(
    stat: Stats
): string {

    return stat.mtime.toUTCString();
}

// ===============================
// Read a header
// ===============================

export function getHeader(
    headers: Buffer[],
    key: string
): string | null {

    key = key.toLowerCase();

    for (const h of headers) {

        const text = h.toString("latin1");

        const idx = text.indexOf(":");

        if (idx < 0) {
            continue;
        }

        const name =
            text
                .slice(0, idx)
                .trim()
                .toLowerCase();

        if (name === key) {

            let value = text
                .slice(idx + 1)
                .trim();

            if (
                value.startsWith('"') &&
                value.endsWith('"')
            ) {
                value = value.slice(1, -1);
            }

            return value;
        }
    }

    return null;
}