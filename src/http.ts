// ===============================
// HTTP Types
// ===============================

// Parsed HTTP request header
export type HTTPReq = {
    method: string;
    uri: Buffer;
    version: string;
    headers: Buffer[];
};

// Interface for reading an HTTP body
export type BodyReader = {
    // Content-Length (-1 if unknown)
    length: number;

    // Returns an empty Buffer on EOF
    read: () => Promise<Buffer>;
};

// HTTP response
export type HTTPRes = {
    code: number;
    headers: Buffer[];
    body: BodyReader;
};

// Custom HTTP exception
export class HTTPError extends Error {
    code: number;

    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}