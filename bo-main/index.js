const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
const getRouter = require("./routes/getRoutes");
const userRouter = require("./routes/userRoutes");
const contactsRouter = require("./routes/contactRoutes");
const messagesRouter = require("./routes/messagesRoutes");
const roomsRouter = require("./routes/roomRoutes")

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*" } });

server.listen(3001, () => {
  console.log("socket server running");
});

io.on("connection", (socket) => {
  console.log("coming in");
  console.log("user connected", socket.id);
  socket.on("join", (data) => {
    console.log(data, "data while join");
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("user joined");
  });

  socket.on("bot message", ((args, cb)=>{
    console.log(args);
    cb('shut the fuck up and talk to real people')
  }))

  socket.on("message", (data) => {
    console.log("message coming", data);
    io.in(data.room).emit("new message", {
      sender: data.sendUser,
      message: data.message,
    });
  });
});

// set security http headers
app.use(helmet());

//Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// limiting request from same IP
app.use("/data", limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/data", getRouter);
app.use("/users", userRouter);
app.use("/contacts", contactsRouter);
app.use("/messages", messagesRouter);
app.use("/rooms", roomsRouter)
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `cannot find ${req.originalUrl} is not found in this server`,
      404
    )
  );
});
app.use(errorHandler);

module.exports = app;
