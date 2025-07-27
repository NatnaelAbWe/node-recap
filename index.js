const fs = require("fs");
const path = require("path");

fs.readFile(
  path.join(__dirname, "01-TUT", "lorem.txt"),
  "utf-8",
  (err, data) => {
    if (err) {
      throw err;
    } else {
      console.log(data);
    }
  }
);

process.on("uncaughtException", (err) => {
  console.log("there was an uncaught error");
  process.exit(1);
});
