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
const roomsRouter = require("./routes/roomRoutes");
const contactUserRouter = require("./routes/contactUserRoutes")
const cors = require("cors")
const cookieParser = require('cookie-parser');
const socketSevice = require('./services/socketService')

const contactModel = require("./models/contactModel")

const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*" } });

app.use(cors(
  {
    origin: "http://localhost:4200",
    credentials: true
  }
))

app.use(cookieParser())

server.listen(3001, () => {
  console.log("socket server running");
});

async function updateContactStatus(id, status) {

  let res = {}

  if(id && status){

    res = await contactModel.findByIdAndUpdate(id, {
      status
    }, {
      new: true
    })
  }

  return res
}

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("user joined");
  });

  let loginDetails = {}

  socket.on('loginDetails', async (data) => {
    loginDetails = data

    socket.join(loginDetails._id);
    socket.broadcast.to(loginDetails._id)

    updateContactStatus(loginDetails._id, 'online').then(()=>[
      io.emit("updateContactStatus", {
        _id: loginDetails._id,
        status: 'online'
      })
    ])
  })

  socket.on('notifyContact', (notification)=>{

    io.in(notification.contact._id).emit('myNotification', {
      ...notification
    })

  })

  socket.on('handleRoomMessagesStatus', (contact)=>{

    socketSevice.handleRoomMessagesStatus(contact)

  })

  socket.on('disconnect', async () => {
    updateContactStatus(loginDetails._id, 'offline').then(()=>{
      io.emit("updateContactStatus", {
        _id: loginDetails._id,
        status: 'offline'
      })
    })
  });

  socket.on("bot message", (args, cb) => {
    cb("Shut the fuck up and talk to real people");
  });

  socket.on("message", (data) => {
    io.in(data.room).emit("new message", {
      sender: data.sendUser,
      message: data.message,
      roomData: data.roomData
    });
  });

  socket.on("notify", (data) => {
    io.local.emit("new notification", {
      data,
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
app.use("/rooms", roomsRouter);
app.use("/contactsAuth", contactUserRouter)
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
