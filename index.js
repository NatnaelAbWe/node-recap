const fsPromises = require("fs").promises;
const path = require("path");

// fs.readFile(path.join(__dirname, "lorem.txt"), "utf-8", (err, data) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log(data);
//   }
// });

// process.on("uncaughtException", (err) => {
//   console.log("there was an uncaught error");
//   process.exit(1);
// });

// fs.writeFile(path.join(__dirname, "hi.txt"), "hello node", (err) =>
//   console.error(err)
// );

// fs.appendFile(
//   path.join(__dirname, "hi.txt"),
//   "\n\n i am recaping node",
//   (err) => console.log(err)
// );

// fs.rename(path.join(__dirname, "hi.txt"), "hello.txt", (err) =>
//   console.error(err)
// );

const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(
      path.join(__dirname, "starter.txt"),
      "utf-8"
    );
    console.log(data);
    console.log("reading");
    await fsPromises.writeFile(
      path.join(__dirname, "abebe.txt"),
      "hi i am abebe"
    );
    console.log("writting");
    await fsPromises.appendFile(
      path.join(__dirname, "abebe.txt"),
      "hi lulu zulu"
    );
    console.log("appending");
    await fsPromises.rename(
      path.join(__dirname, "abebe.txt"),
      path.join(__dirname, "next.txt")
    );
  } catch (err) {
    console.error(err);
  }
};

fileOps();
