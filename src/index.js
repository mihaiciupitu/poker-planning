import "./style.css";
import { io } from "socket.io-client";
const possibleCards = document.querySelectorAll(".card");
const chosencard = document.querySelector(".chosen-cards0");
const revealbutton = document.querySelector(".reveal-cards");
const playagain = document.querySelector(".play-again");
const average = document.querySelector(".average");
const pick = document.querySelector(".pick");
const user = document.querySelector(".usernames");
const cards = document.querySelector(".cards");
const possibleCardsContainer = document.querySelector(".possible-cards");
let counter = 1;
const userChosenCards = {};

let usersVoted = [];
let addedCards = [];
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

//Functions
function handleCardClick(element) {
  if (usersVoted.includes(socket.id)) {
    console.log("The user already voted");
    alert("You already voted");

    return;
  } else {
    element.classList.add("active");
    chosencard.classList.add("active");
    revealbutton.classList.add("display");
    pick.classList.add("inactive-important");
    pick.classList.remove("display");
    revealbutton.classList.remove("inactive-important");
    revealbutton.classList.remove("inactive");

    // Add the selected card's value to the addedCards array

    // Emit the selected card value to the server
    socket.emit("cardValue", element.innerHTML);
    socket.emit("updateCardValue", {
      socketId: socket.id,
      card: element.innerHTML,
    });

    // Update the display of users who voted
    usersVoted.push(socket.id);
    displayUsersWhoVoted();
  }
}

function handleRevealButtonClick() {
  revealbutton.classList.add("inactive");
  revealbutton.classList.remove("display");
  playagain.classList.add("display-grey");
  playagain.classList.remove("inactive");

  const activeCard = document.querySelector(".card.active");
  if (activeCard) {
    whiteningAndEmittingChosenCard(activeCard.innerHTML);
  }

  // Clear the addedCards array
  addedCards = [];

  deactivatePossibleCards();
  possibleCards.forEach((element) => {
    element.classList.remove("active");
  });
  average.classList.add("display");
}

function whiteningAndEmittingChosenCard(content) {
  for (let i = 0; i < counter; i++) {
    const card2 = document.querySelector(`.chosen-cards${i}`);
    if (card2.innerHTML.trim() === "") {
      // Check if the card content is empty
      card2.innerHTML = content;
    }
    card2.classList.add("white-text");
    card2.classList.remove("black-text");
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
  resetChosenCards();
  average.classList.remove("display");
  socket.emit("resetAverage");
  usersVoted = [];

  counter = 1;
  possibleCards.forEach((card) => {
    card.classList.remove("active");
  });
  document.querySelectorAll("li").forEach((element) => {
    element.classList.remove("voted");
  });
}
function activatePossibleCards() {
  possibleCardsContainer.classList.remove("inactive");
}

function resetChosenCards() {
  for (let i = 1; i < counter; i++) {
    const card = document.querySelector(`.chosen-cards${i}`);
    const name = document.querySelector(`.chosen-name${i}`);
    console.log(card);
    console.log(name);
    if (card && name) {
      card.classList.remove(`chosen-cards${i}`);
      name.classList.remove(`chosen-name${i}`);
      name.innerHTML = "";
      card.innerHTML = "";
      console.log(`Reset card ${i}`);
    } else {
      console.log(`Card ${i} not found`);
    }
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
function ListenWhenUsersVoted() {
  socket.on("SelectedCard", (data) => {
    const socketID = data.socketID;

    if (!usersVoted.includes(socketID)) {
      // Only add the user to the list of voted users if they haven't voted before
      usersVoted.push(socketID);
      displayUsersWhoVoted();

      // Display the card for each user if there are 4 or fewer users
      if (usersVoted.length <= 4) {
        addCard(data.card, data.name);
      }
    }
  });

  // Listen for the updateCardValue event to update the chosen card's value
  socket.on("updateCardValue", (data) => {
    const socketID = data.socketID;
    const cardValue = data.card;

    // Update the chosen card's value if it belongs to the current user
    if (socketID === socket.id) {
      chosencard.innerHTML = cardValue;
    }
  });
}
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

function addCard(card, dataName) {
  const cardContainer = document.createElement("div");
  const cardDiv = document.createElement("div");
  const nameDiv = document.createElement("div");
  cardDiv.innerHTML = card;
  nameDiv.innerHTML = dataName;
  cardDiv.classList.add(`chosen-cards${counter}`);
  nameDiv.classList.add(`chosen-name${counter}`);
  cardContainer.appendChild(cardDiv);
  cardContainer.appendChild(nameDiv);
  cards.appendChild(cardContainer);
  counter++;
}
function displayUsers() {
  socket.on("UsernamesConnected", (usernames) => {
    user.innerHTML = "Connected users : ";

    usernames.forEach((username) => {
      const listItem = document.createElement("li");
      listItem.textContent = username.name;
      listItem.dataset.data = username.socketID;
      user.appendChild(listItem);
    });
  });
}
function displayUsersWhoVoted() {
  document.querySelectorAll("li").forEach((element) => {
    if (usersVoted.find((vote) => vote === element.dataset.data))
      element.classList.add("voted");
  });
}

ListenWhenUsersVoted();
displayUsers();
getAverage();
getName();
sendName();
// update readme to install the app as a new user
