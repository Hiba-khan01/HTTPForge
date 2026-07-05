"use strict";
// ===============================
// HTTP Types
// ===============================
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
// Custom HTTP exception
class HTTPError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.HTTPError = HTTPError;
