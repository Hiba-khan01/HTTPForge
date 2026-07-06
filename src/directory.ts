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

    let rows = "";

    if (requestPath !== "/") {

        rows += `
<tr>
<td>📁</td>
<td><a href="../">..</a></td>
<td>-</td>
<td>-</td>
</tr>
`;
    }

    for (const entry of entries) {

        const fullPath = path.join(dirPath, entry.name);

        const stat = await fs.stat(fullPath);

        const href =
            path.posix.join(requestPath, entry.name) +
            (entry.isDirectory() ? "/" : "");

        rows += `
<tr>
<td>${entry.isDirectory() ? "📁" : "📄"}</td>
<td><a href="${href}">${entry.name}${entry.isDirectory() ? "/" : ""}</a></td>
<td>${entry.isDirectory() ? "-" : stat.size + " B"}</td>
<td>${stat.mtime.toLocaleString()}</td>
</tr>
`;
    }

    const html = `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<title>Index of ${requestPath}</title>

<style>

body{
    font-family:Segoe UI,Arial,sans-serif;
    max-width:900px;
    margin:40px auto;
    background:#fafafa;
    color:#222;
}

h1{
    border-bottom:2px solid #ddd;
    padding-bottom:10px;
}

table{
    width:100%;
    border-collapse:collapse;
}

th,td{
    padding:10px;
    border-bottom:1px solid #eee;
    text-align:left;
}

th{
    background:#f3f3f3;
}

a{
    text-decoration:none;
    color:#0066cc;
}

a:hover{
    text-decoration:underline;
}

</style>

</head>

<body>

<h1>📁 Index of ${requestPath}</h1>

<table>

<tr>

<th></th>

<th>Name</th>

<th>Size</th>

<th>Modified</th>

</tr>

${rows}

</table>

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