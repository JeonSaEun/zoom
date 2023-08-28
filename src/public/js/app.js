const socket = io();

let roomName;
let nickName;
const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const roomNumberForm = welcome.querySelector("#roomNumber");
const nameForm = welcome.querySelector("#name");

room.hidden = true;

roomNumberForm.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

function addMessage(msg) {
	const ul = room.querySelector("ul");
	const li = document.createElement("li");
	li.innerText = msg;
	ul.appendChild(li);
}

function showRoom(newCount) {
	welcome.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;
	const msgForm = room.querySelector("#msg");
	msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleMessageSubmit(e) {
	e.preventDefault();
	const input = room.querySelector("#msg input");
	const value = input.value;
	socket.emit("new_message", input.value, roomName, () => {
		addMessage(`You: ${value}`);
	});

	input.value = "";
}

function handleNicknameSubmit(e) {
	e.preventDefault();
	const input = nameForm.querySelector("input");
	socket.emit("nickname", input.value);
	nickName = input.value;
}

function handleRoomSubmit(e) {
	e.preventDefault();
	if (!nickName) {
		alert("닉네임을 입력해주세요.");
		return;
	}

	const input = roomNumberForm.querySelector("input");
	socket.emit("enter_room", input.value, showRoom);
	roomName = input.value;
	input.value = "";
}

socket.on("welcome", (nickname, newCount) => {
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;
	addMessage(`${nickname}님이 입장했습니다. 환영해요! 😍`);
});

socket.on("bye", (nickname, newCount) => {
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;
	addMessage(`${nickname}님이 떠났습니다. 잘가요 🥲`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
	const roomList = welcome.querySelector("ul");
	roomList.innerHTML = "";
	if (rooms.length === 0) {
		return;
	}
	rooms.forEach((room) => {
		const li = document.createElement("li");
		li.innerText = room;
		roomList.append(li);
	});
});
