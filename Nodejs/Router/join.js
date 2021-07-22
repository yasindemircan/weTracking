const express = require('express');
const router = express.Router();
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*',
  }
});
const path = require('path');

const User = require('../Database-models/User')
const Activity = require("../Database-models/Activity");

const { addUser, getUser, deleteUser, getUsers } = require('../helpers/socketUsers')

const emitter = require("../helpers/eventEmitter");
const emitterEvent = emitter.myEmitter;


router.get('/connect/:roomId', async (req, res) => {
  const { roomId } = req.params;
  if (!roomId) {
    res.status(404).json({ success: false, message: "RoomId Giriniz" })
    return
  }
  try {
    const activeRoom = await Activity.findOne({ creatorId: roomId, isActive: true })
    if (!activeRoom) {
      res.status(404).json({ success: false, message: "Aktif oda Bulunamadı" })
      return
    }
    const findActivityCreator = await User.findOne({ publicId: activeRoom.creatorId });
    if (!findActivityCreator) {
      res.status(404).json({ success: false, message: "Kullanıcı Bulunamadı" })
      return
    }
    res.status(200).json({
      success: true,
      roomCreator: findActivityCreator.name,
      startAddress: activeRoom.startAddress,
      finishAddress: activeRoom.finishAddress,
      waypoints: activeRoom.waypoints
    })
  } catch (err) {
    res.status(500).json({ success: false, message: "Beklenmedik bir hata olu?tu tekrar deneyiniz.", errorMessage: err })
  }
});

const SocketEvents = ({
  ConnectionEVENT: "connection",
  LoginEvent: "login",
  CoordEVENT: "coord",
  DisconnectEvent: "disconnect",
  CHAT_EVENT: "chat"
})

const COLORS = [
  "#C54B6C", "#D5E4C3", "#218B82", "#BEB4C5", "#E6A57E", "#CCD4BF", "#5784BA", "#ffd992", "#ff5b5d", "#00a65b"
]
const timeFormatter = () => {
  const format = (number) => {
    if (number < 10) {
      return `0${number}`
    }
    return number
  }
  let newTime = new Date();
  let hours = format(newTime.getHours())
  let minutes = format(newTime.getMinutes())
  return (`${hours}:${minutes}`);
}

const SelectRandomColor = () => {
  return COLORS.splice(Math.floor(Math.random() * COLORS.length), 1).toString();
}

const sendUserList = (roomId) => {
  return io.in(roomId).emit('users', getUsers(roomId))
}


io.on(SocketEvents.ConnectionEVENT, async (socket) => {
  socket.on(SocketEvents.LoginEvent, ({ username, roomId, deviceId }, callback) => {
    const { user, error } = addUser(socket.id, deviceId, username, roomId, SelectRandomColor())
    if (error) return callback(error)
    socket.join(user.roomId)
    sendUserList(user.roomId)
    callback()
  })

  socket.on(SocketEvents.CoordEVENT, async (msg) => {
    const user = await getUser(msg.deviceId, socket.id)
    socket.to(user.roomId).emit("Scoord", { user, data: msg })
  })
  socket.on(SocketEvents.CHAT_EVENT, async (msg) => {
    const user = await getUser(msg.deviceId, socket.id)
    let time = timeFormatter();
    io.in(user.roomId).emit("SocketMsg", { user, data: { ...msg, time } })
  })

  socket.on(SocketEvents.DisconnectEvent, () => {
    const user = deleteUser(socket.id)
    if (user) {
      COLORS.push(user.color);
      sendUserList(user.roomId)
      socket.leave(user.roomId);
    }
  });

  emitterEvent.on("userList", (roomId) => {
    socket.join(roomId)
    sendUserList(roomId);
  })

});

server.listen(3001, () => {
  console.log(`Listening on port ${3001}`);
})
module.exports = router;