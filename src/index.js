import "./style.css";
import { io } from "socket.io-client";
const possibleCards = document.querySelectorAll(".card");
const chosencard = document.querySelector(".chosen-cards");
const revealbutton = document.querySelector(".reveal-cards");
const playagain = document.querySelector(".play-again");
const average = document.querySelector(".average");
const pick = document.querySelector(".pick");
const user = document.querySelector(".usernames");
const cards = document.querySelector(".cards");

possibleCards.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.stopPropagation();
    handleCardClick(element);
  });
});

function handleCardClick(element) {
  possibleCards.forEach((card) => {
    card.classList.remove("active");
  });

  element.classList.add("active");
  chosencard.classList.add("active");
  revealbutton.classList.add("active4");
  pick.classList.add("active5");
  pick.classList.remove("active4");
  revealbutton.classList.remove("active5");
  revealbutton.classList.remove("active2");
  chosencard.innerHTML = element.innerHTML;
  chosencard.style.color = "black";
  socket.emit("cardValue", chosencard.innerHTML);
}

document.addEventListener("click", (e) => {
  possibleCards.forEach((element) => {
    if (e.target != element) {
      element.classList.remove("active");
    }
  });
  chosencard.classList.remove("active");
  chosencard.innerHTML = "";
});

function handleRevealButtonClick() {
  revealbutton.classList.add("active2");
  revealbutton.classList.remove("active4");
  playagain.classList.add("active3");
  playagain.classList.remove("active2");

  const activeCard = document.querySelector(".card.active");
  if (activeCard) {
    updateChosenCard(activeCard.innerHTML);
  }

  updateChosenCards2();

  activatePossibleCards();
  average.classList.add("active4");
}

function updateChosenCard(content) {
  chosencard.innerHTML = content;
  chosencard.style.color = "white";
  socket.emit("cardValue", content);
}

function updateChosenCards2() {
  const card2 = document.querySelector(".chosen-cards2");
  if (card2) {
    card2.style.color = "white";
    card2.classList.remove("active5");
  }
}

function activatePossibleCards() {
  possibleCards.forEach((element) => {
    element.classList.add("active2");
  });
}

revealbutton.addEventListener("click", (e) => {
  e.stopPropagation();
  handleRevealButtonClick();
});
function handlePlayAgainClick() {
  playagain.classList.add("active2");
  playagain.classList.remove("active3");
  pick.classList.add("active4");
  pick.classList.remove("active5");
  chosencard.innerHTML = "";
  deactivatePossibleCards();
  resetChosenCards2();
  average.classList.remove("active4");
  socket.emit("resetAverage");
}

function deactivatePossibleCards() {
  possibleCards.forEach((element) => {
    element.classList.remove("active2");
  });
}

function resetChosenCards2() {
  const card2 = document.querySelector(".chosen-cards2");
  if (card2) {
    card2.classList.add("active5");
  }
}

playagain.addEventListener("click", (e) => {
  handlePlayAgainClick();
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
  socket.emit("SendUsername", username);
}
function getAverage() {
  socket.on("Average", (media) => {
    average.innerHTML = "The average is : " + media;
  });
}

function displayCards() {
  socket.on("UsernamesConnected", (usernames) => {
    if (usernames.length > 1) {
      socket.on("SelectedCard", handleSelectedCard);
    } else {
      chosencard.innerHTML = "";
      socket.off("SelectedCard", handleSelectedCard);
    }
  });
}

function handleSelectedCard(card) {
  if (!document.querySelector(".chosen-cards2")) {
    const div = document.createElement("div");
    div.innerHTML = card;
    div.classList.add("chosen-cards2");

    cards.appendChild(div);
  }
}

function displayUsers() {
  socket.on("UsernamesConnected", (usernames) => {
    user.innerHTML = "Connected users : ";

    usernames.forEach((username) => {
      const listItem = document.createElement("li");
      listItem.textContent = username;
      user.appendChild(listItem);
    });
  });
}
displayCards();
displayUsers();
getAverage();
getName();
sendName();
