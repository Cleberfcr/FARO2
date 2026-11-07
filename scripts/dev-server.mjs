import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { buildSite } from "./build.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 3000);
const host = "0.0.0.0";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".ico": "image/x-icon",
};

buildSite();
const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(req.url || "/", `http://${req.headers.host || "localhost"}`)
        .pathname,
    );
  } catch {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }
  if (pathname.includes("\0") || pathname.split("/").includes("..")) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }
  let target =
    pathname === "/"
      ? path.join(dist, "index.html")
      : path.resolve(dist, `.${pathname}`);
  if (
    !target.startsWith(`${dist}${path.sep}`) &&
    target !== path.join(dist, "index.html")
  ) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory())
    target = path.join(target, "index.html");
  if (!path.extname(target) && fs.existsSync(`${target}/index.html`))
    target = `${target}/index.html`;
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    const notFound = path.join(dist, "404.html");
    const body = fs.existsSync(notFound)
      ? fs.readFileSync(notFound)
      : Buffer.from("Not found");
    res.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end(body);
    return;
  }
  const body = fs.readFileSync(target);
  res.writeHead(200, {
    "Content-Type": mime[path.extname(target)] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  res.end(body);
});
server.listen(port, host, () =>
  console.log(`FARO está servindo dist/ em http://${host}:${port}`),
);
