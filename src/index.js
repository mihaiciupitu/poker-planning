import "./style.css";
import { io } from "socket.io-client";
const card = document.querySelectorAll(".card");
const chosencard = document.querySelector(".chosen-cards");
const revealbutton = document.querySelector(".reveal-cards");
const playagain = document.querySelector(".play-again");
const average = document.querySelector(".average");
const pick = document.querySelector(".pick");
const user = document.querySelector(".usernames");

card.forEach((element) => {
  element.addEventListener("click", (e) => {
    element.classList.toggle("active");

    if (element.classList.contains("active")) {
      chosencard.classList.add("active");
      revealbutton.classList.add("active4");
      pick.classList.add("active5");
      pick.classList.remove("active4");
      revealbutton.classList.remove("active5");
      revealbutton.classList.remove("active2");
      chosencard.innerHTML = element.innerHTML;
      chosencard.style.color = "black";
      const selectedCard = chosencard.innerHTML;
      socket.emit("cardValue", selectedCard);
    } else {
      chosencard.classList.remove("active");
      revealbutton.classList.add("active5");
      pick.classList.add("active4");
      pick.classList.remove("active5");
    }
  });
});

document.addEventListener("click", (e) => {
  card.forEach((element) => {
    if (e.target != element) {
      element.classList.remove("active");
    }
  });
});

revealbutton.addEventListener("click", (e) => {
  revealbutton.classList.add("active2");
  revealbutton.classList.remove("active4");
  playagain.classList.add("active3");
  playagain.classList.remove("active2");
  card.forEach((element) => {
    if (element.classList.contains("active")) {
      chosencard.innerHTML = element.innerHTML;
      chosencard.style.color = "white";
    }
  });
  card.forEach((element) => {
    element.classList.add("active2");
  });

  average.classList.add("active4");
});
playagain.addEventListener("click", (e) => {
  playagain.classList.add("active2");
  playagain.classList.remove("active3");
  pick.classList.add("active4");
  pick.classList.remove("active5");
  chosencard.innerHTML = "";
  card.forEach((element) => {
    element.classList.remove("active2");
  });
  average.classList.remove("active4");
  socket.emit("resetAverage");
});

// Client Side Code

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server with id%o", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
function getName() {
  const userName = prompt("Please enter your name:");
  let divContent = document.querySelector("#name");

  if (userName !== null && userName !== "") {
    divContent.innerHTML += userName;
  } else {
    alert("You did not enter a name.");
  }
}
function sendName() {
  let username = document.querySelector("#name").innerHTML;
  socket.emit("Username", username);
}
function getAverage() {
  socket.on("Average", (media) => {
    average.innerHTML = "The average is : " + media;
  });
}

function displayUsers() {
  socket.on("Usernames", (usernames) => {
    user.innerHTML = "Connected users : ";

    usernames.forEach((username) => {
      const listItem = document.createElement("li");
      listItem.textContent = username;
      user.appendChild(listItem);
    });
  });
}

displayUsers();
getAverage();
getName();
sendName();
