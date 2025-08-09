const logEvents = require("./logEvent");

const EventEmmiter = require("events");

class MyEmitter extends EventEmmiter {}
const myEmmitter = new MyEmitter();

myEmmitter.on("log", (msg) => logEvents(msg));
setTimeout(() => {
  // emit the event
  myEmmitter.emit("log", "event emmited");
}, 2500);
