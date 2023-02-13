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

  console.log(res, 'res in ansync');

  return res
}

io.on("connection", (socket) => {
  console.log("coming in");
  console.log("user connected", socket.id);
  socket.on("join", (data) => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("user joined");
  });

  let loginDetails = {}

  socket.on('loginDetails', async (data) => {
    console.log(data, 'details')
    loginDetails = data
    updateContactStatus(loginDetails._id, 'online').then(()=>[
      io.emit("updateContactStatus", {
        _id: loginDetails._id,
        status: 'online'
      })
    ])
  })


  socket.on('disconnect', async () => {
    console.log(`Client disconnected: ${socket.id}`, loginDetails);
    updateContactStatus(loginDetails._id, 'offline').then(()=>{
      io.emit("updateContactStatus", {
        _id: loginDetails._id,
        status: 'offline'
      })
    })
  });

  socket.on("goOnline", (data) => {
    socket.join(data._id)
    io.in(data.room).emit("onlineStatus", {
      id: data.id,
      status: "online"
    });
  })

  socket.on("goOffline", (data) => {
    // console.log(data, "data going offline");
    socket.join(data._id)
    io.in(data.room).emit("onlineStatus", {
      id: data.id,
      status: "offline"
    });
  })

  socket.on("bot message", (args, cb) => {
    console.log(args);
    cb("Shut the fuck up and talk to real people");
  });

  socket.on("message", (data) => {
    console.log("message coming", data);
    io.in(data.room).emit("new message", {
      sender: data.sendUser,
      message: data.message,
    });
  });

  socket.on("notify", (data) => {
    console.log("notification received");
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
