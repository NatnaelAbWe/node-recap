const logEvents = require("./logEvent");
const EventEmitter = require("events");
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromise = require("fs").promises;

class Emitter extends EventEmitter {}
// initalize object
const myEmitter = new Emitter();
myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, res) => {
  // guard to catch bad calls
  if (
    !res ||
    typeof res.writeHead !== "function" ||
    typeof res.end !== "function"
  ) {
    console.error("serveFile called with bad response arg:", res);
    throw new TypeError("serveFile 3rd arg must be the Node response object");
  }

  try {
    const isText =
      contentType.startsWith("text/") ||
      contentType === "application/json" ||
      contentType === "image/svg+xml";

    const rawdata = await fsPromise.readFile(
      filePath,
      isText ? "utf-8" : undefined
    );

    const data =
      contentType === "application/json" ? JSON.parse(rawdata) : rawdata;
    res.writeHead(200, { "Content-Type": contentType });

    res.end(contentType === "application/json" ? JSON.stringify(data) : data);
  } catch (err) {
    console.error(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Server Error");
  }
};

const server = http.createServer(async (req, res) => {
  console.log(req.url, req.method);
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  // determine extension & content type
  const extension = path.extname(req.url);
  let contentType;
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break; // <-- important
    default:
      contentType = "text/html";
  }

  // build absolute file path
  let filePath =
    contentType === "text/html" && (req.url === "/" || req.url === "")
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  // allow /about -> /about.html
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  // Optional hardening: prevent path traversal
  // filePath = path.normalize(filePath);
  // if (!filePath.startsWith(path.join(__dirname, 'views'))) { ... }

  try {
    if (fs.existsSync(filePath)) {
      await serveFile(filePath, contentType, res);
      return;
    }

    // handle redirects by filename
    const base = path.basename(filePath);
    if (base === "old-page.html") {
      res.writeHead(301, { Location: "/new-page.html" });
      return res.end();
    }
    if (base === "new-page.html") {
      res.writeHead(301, { Location: "/" });
      return res.end();
    }

    // 404 fallback (ALWAYS pass 3 args)
    await serveFile(
      path.join(__dirname, "views", "404.html"),
      "text/html",
      res
    );
  } catch (err) {
    console.error("request error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 Server Error");
  }
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
