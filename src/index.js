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
const possibleCardsContainer = document.querySelector(".possible-cards");

// Events
possibleCards.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.stopPropagation();
    handleCardClick(element);
  });
});
revealbutton.addEventListener("click", (e) => {
  e.stopPropagation();
  handleRevealButtonClick();
});
playagain.addEventListener("click", (e) => {
  handlePlayAgainClick();
});

document.addEventListener("click", (e) => {
  possibleCards.forEach((element) => {
    if (e.target != element) {
      element.classList.remove("active");
    }
  });
  chosencard.classList.remove("active");
  chosencard.innerHTML = "";
});

//Functions
function handleCardClick(element) {
  possibleCards.forEach((card) => {
    card.classList.remove("active");
  });
  // try to make it faster with removing active from the previously chosen element
  element.classList.add("active");
  chosencard.classList.add("active");
  revealbutton.classList.add("display");
  pick.classList.add("inactive-important");
  pick.classList.remove("display");
  revealbutton.classList.remove("inactive-important");
  revealbutton.classList.remove("inactive");
  chosencard.innerHTML = element.innerHTML;
  chosencard.classList.add("black-text");
  socket.emit("cardValue", chosencard.innerHTML);
}

function handleRevealButtonClick() {
  revealbutton.classList.add("inactive");
  revealbutton.classList.remove("display");
  playagain.classList.add("display-grey");
  playagain.classList.remove("inactive");

  const activeCard = document.querySelector(".card.active");
  if (activeCard) {
    updateChosenCard(activeCard.innerHTML);
  }

  updateChosenCards2();

  deactivatePossibleCards();
  average.classList.add("display");
}

function updateChosenCard(content) {
  chosencard.innerHTML = content;
  chosencard.classList.add("white-text");
  chosencard.classList.remove("black-text");
  socket.emit("cardValue", content);
}

function updateChosenCards2() {
  const card2 = document.querySelector(".chosen-cards2");
  if (card2) {
    card2.classList.add("white-text");
    card2.classList.remove("inactive-important");
  }
}

function deactivatePossibleCards() {
  possibleCardsContainer.classList.add("inactive");
}

function handlePlayAgainClick() {
  playagain.classList.add("inactive");
  playagain.classList.remove("display-grey");
  pick.classList.add("display");
  pick.classList.remove("inactive-important");
  chosencard.innerHTML = "";
  activatePossibleCards();
  resetChosenCards2();

  average.classList.remove("display");
  socket.emit("resetAverage");
}

function activatePossibleCards() {
  possibleCardsContainer.classList.remove("inactive");
}

function resetChosenCards2() {
  const card2 = document.querySelector(".chosen-cards2");
  if (card2) {
    card2.classList.remove("chosen-cards2");
    card2.innerHTML = "";
  }
}

// Client Side Code

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to server with id%o", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
// save username on localstorage

function getName() {
  const userName =
    localStorage.getItem("userName") || prompt("Please enter your name:");

  let divContent = document.querySelector("#name");

  if (userName !== null && userName !== "") {
    divContent.innerHTML = userName;
    localStorage.setItem("userName", userName);
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
// rename to ListenWhenUsersConnected /// 159 -- addCard
// add user simple , voted, discovered  classes , make distinction on who voted or did not voted based on id's
function ListenWhenUsersConnected() {
  socket.on("UsernamesConnected", (usernames) => {
    if (usernames.length > 1) {
      socket.on("SelectedCard", addCard);
      console.log(user.firstChild);
    } else {
      chosencard.innerHTML = "";
      socket.off("SelectedCard", addCard);
    }
  });
}

function addCard(card) {
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
ListenWhenUsersConnected();
displayUsers();
getAverage();
getName();
sendName();
// update readme to install the app as a new user
