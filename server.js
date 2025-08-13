const logEvents = require("./logEvent");
const EventEmmiter = require("events");
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromise = require("fs").promises;
class Emitter extends EventEmmiter {}

// initialize object
const myEmmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

let path;

if(req.url === "/" || req.url === "index.html"){
  res.statusCode = 200 ;
  res,setHeader("content-type", "text/html");
  path = path.join(__dirname, "views", "index.html"
  fs.readFile(path, "utf-8",(err, data) => {
      res.end(data)
  }) 
  )
}
;
// myEmmitter.on("log", (msg) => logEvents(msg));

//   myEmmitter.emit("log", "event emmited");
// },
