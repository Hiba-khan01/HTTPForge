import * as path from "path";

export function getMimeType(filePath: string): string {
    switch (path.extname(filePath).toLowerCase()) {

        case ".html":
            return "text/html; charset=utf-8";

        case ".css":
            return "text/css; charset=utf-8";

        case ".js":
            return "application/javascript";

        case ".json":
            return "application/json";

        case ".txt":
            return "text/plain; charset=utf-8";

        case ".png":
            return "image/png";

        case ".jpg":
        case ".jpeg":
            return "image/jpeg";

        case ".gif":
            return "image/gif";

        case ".svg":
            return "image/svg+xml";

        case ".ico":
            return "image/x-icon";

        default:
            return "application/octet-stream";
    }
}