import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${port}`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
	socket.onAny((e) => {
		console.log(`Socket Event : ${e}`);
	});
	socket.on("enter_room", (roomName, done) => {
		socket.join(roomName);
		done();
	});
});

// const sockets = [];

// wss.on("connection", (socket) => {
// 	sockets.push(socket);
// 	socket["nickname"] = "Anonymous";
// 	console.log("conneted to browser ✔");
// 	socket.on("close", () => console.log("disconneted to browser ❌"));
// 	socket.on("message", (msg) => {
// 		const message = JSON.parse(msg);
// 		switch (message.type) {
// 			case "new_message":
// 				sockets.forEach((e) => {
// 					e.send(`${socket.nickname}: ${message.payload}`);
// 				});
// 			case "nickname":
// 				socket["nickname"] = message.payload;
// 		}
// 	});
// });

httpServer.listen(port, handleListen);
