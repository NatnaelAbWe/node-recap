const fs = require("fs");
const path = require("path");

fs.readFile(path.join(__dirname, "lorem.txt"), "utf-8", (err, data) => {
  if (err) {
    throw err;
  } else {
    console.log(data);
  }
});

process.on("uncaughtException", (err) => {
  console.log("there was an uncaught error");
  process.exit(1);
});

fs.writeFile(path.join(__dirname, "hi.txt"), "hello node", (err) =>
  console.err(err)
);
