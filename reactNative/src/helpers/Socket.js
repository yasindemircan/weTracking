import io from "socket.io-client";
import Link from "../helpers/links";
const connectionConfig = {
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ["websocket"],
};

const socket = io(Link.socketIO, connectionConfig);
socket.on("connect", () => {
  console.log("id:", socket.id);
});
export default socket;
