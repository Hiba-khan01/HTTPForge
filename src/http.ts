// ===============================
// HTTP Types
// ===============================

// Parsed HTTP request
export type HTTPReq = {
    method: string;
    uri: Buffer;
    version: string;
    headers: Buffer[];
};

// Generic body reader.
//
// A BodyReader can represent:
//
// - Memory
// - Request body
// - File
// - Gzip stream (future)
// - Chunked transfer (future)
export interface BodyReader {

    // Total body length.
    // -1 means unknown length.
    readonly length: number;

    // Read the next chunk.
    // Returns an empty Buffer on EOF.
    read(): Promise<Buffer>;

    // Optional cleanup.
    close?(): Promise<void>;
}

// HTTP Response
export interface HTTPRes {
    code: number;
    headers: Buffer[];
    body: BodyReader;
}

// Custom HTTP exception
export class HTTPError extends Error {

    readonly code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}