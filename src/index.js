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
let selectedCardCount = 0;

let usersVoted = [];
let usersVotedUpdated = new Array(possibleCards.length).fill(false);
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
    chosencard.innerHTML = element.innerHTML;
    chosencard.classList.add("black-text");
    usersVotedUpdated[selectedCardCount - 1] = true;
    console.log(usersVotedUpdated);
    socket.emit("cardValue", chosencard.innerHTML);
    selectedCardCount++;
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

  deactivatePossibleCards();
  possibleCards.forEach((element) => {
    element.classList.remove("active");
  });
  average.classList.add("display");
}

function whiteningAndEmittingChosenCard(content) {
  for (let i = 0; i < counter; i++) {
    const card2 = document.querySelector(`.chosen-cards${i}`);
    card2.innerHTML = content;
    card2.classList.add("white-text");
    card2.classList.remove("black-text");
  }
  socket.emit("cardValue", content);
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

  usersVotedUpdated = new Array(counter).fill(false);
  counter = 1;
  selectedCardCount = 0;
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
    if (card) {
      card.classList.remove(`chosen-cards${i}`);

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

function ListenWhenUsersConnectedAndVoted() {
  socket.on("UsernamesConnected", (usernames) => {
    if (usernames.length > 1) {
      socket.on("SelectedCard", (data) => {
        // Get the name of the user who selected the card
        const name = data.name;
        // Check if the user who selected the card is in the list of connected usernames
        if (usernames.find((user) => user.name === name)) {
          // Get the socket ID of the user who selected the card
          const socketID = usernames.find(
            (user) => user.name === name
          ).socketID;
          // Check if the user has not already voted and the card for this user has not been added
          if (
            !usersVoted.includes(socketID) &&
            !usersVotedUpdated[counter - 1]
          ) {
            // Add the user's socket ID to the list of voted users
            usersVoted.push(socketID);
            // Update the voted status for this user's card
            usersVotedUpdated[counter - 1] = true;
            addCard(data.card);
            displayUsersWhoVoted();
          }
        }
      });
    } else {
      chosencard.innerHTML = "";
      resetChosenCards();
      console.log("else");
      socket.off("SelectedCard", addCard);
    }
  });
}
function addCard(card) {
  const cardID = "card-" + counter;
  const div = document.createElement("div");
  div.innerHTML = card;
  div.id = cardID;
  div.classList.add(`chosen-cards${counter}`);
  cards.appendChild(div);
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
ListenWhenUsersConnectedAndVoted();
displayUsers();
getAverage();
getName();
sendName();
// update readme to install the app as a new user
