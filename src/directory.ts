import { promises as fs } from "fs";
import * as path from "path";

import { HTTPRes } from "./http";
import { readerFromMemory } from "./body";

export async function serveDirectory(
    dirPath: string,
    requestPath: string
): Promise<HTTPRes> {

    const entries = await fs.readdir(dirPath, {
        withFileTypes: true,
    });

    entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
    });

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Index of ${requestPath}</title>
<style>
body{
    font-family:Arial,Helvetica,sans-serif;
    max-width:900px;
    margin:40px auto;
    padding:0 20px;
}
h1{
    border-bottom:1px solid #ddd;
    padding-bottom:10px;
}
ul{
    list-style:none;
    padding:0;
}
li{
    margin:10px 0;
}
a{
    color:#0d6efd;
    text-decoration:none;
}
a:hover{
    text-decoration:underline;
}
</style>
</head>
<body>

<h1>Index of ${requestPath}</h1>

<ul>
`;

    if (requestPath !== "/") {
        html += `<li><a href="../">../</a></li>\n`;
    }

    for (const entry of entries) {

        const suffix = entry.isDirectory() ? "/" : "";

        const href =
            path.posix.join(requestPath, entry.name) + suffix;

        html += `<li><a href="${href}">${entry.name}${suffix}</a></li>\n`;
    }

    html += `
</ul>

</body>
</html>
`;

    return {
        code: 200,
        headers: [
            Buffer.from("Server: HTTPForge"),
            Buffer.from("Content-Type: text/html; charset=utf-8"),
        ],
        body: readerFromMemory(Buffer.from(html)),
    };
}