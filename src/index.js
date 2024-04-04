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
//make another div in which you add the value
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
    socket.emit("cardValue", element.innerHTML);
    socket.emit("updateCardValue", {
      socketId: socket.id,
      card: element.innerHTML,
    });
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
  deactivatePossibleCards();
  for (let i = 0; i < counter; i++) {
    const card2 = document.querySelector(`.chosen-cards${i} .inactive`);
    if (card2) {
      card2.classList.remove("inactive");
    }
  }
  possibleCards.forEach((element) => {
    element.classList.remove("active");
  });
  average.classList.add("display");
}

function whiteningAndEmittingChosenCard(content) {
  for (let i = 0; i < counter; i++) {
    const card2 = document.querySelector(`.chosen-cards${i}`);
    if (card2.innerHTML.trim() === "") {
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
  addedCards = [];
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
async function getName() {
  let userName = localStorage.getItem("userName");

  if (!userName) {
    userName = await simplePrompt("Please enter your name:");
    let divContent = document.querySelector("#name");

    if (userName && userName !== "") {
      divContent.innerHTML = userName;
      localStorage.setItem("userName", userName);
      socket.emit("SendUsername", userName); // Emit username to server
    } else {
      alert("You did not enter a name.");
    }
  } else {
    // If username exists in localStorage, set it on the page
    document.querySelector("#name").innerHTML = userName;
    socket.emit("SendUsername", userName); // Emit username to server
  }
}
function getAverage() {
  socket.on("Average", (media) => {
    average.innerHTML = "The average is : " + media;
  });
}

function addCard(card, dataName) {
  const cardContainer = document.createElement("div");
  const cardDiv = document.createElement("div");
  const valueDiv = document.createElement("div");
  const nameDiv = document.createElement("div");
  valueDiv.innerHTML = card;
  valueDiv.classList.add("inactive");
  nameDiv.innerHTML = dataName;
  cardDiv.classList.add(`chosen-cards${counter}`);
  cardDiv.appendChild(valueDiv);
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

// Another prompt

export async function simplePrompt(message, placeholder = "", _default = "") {
  const el = document.createElement("div");
  el.id = "custom-prompt-container";
  el.innerHTML = `
    <form id="custom-prompt">
      <label for="custom-prompt-input">${message}</label>
      <div class="tbar">
        <input type="text" id="custom-prompt-input" placeholder="${placeholder}" required>
        <button type="submit">OK</button> 
      </div>
    </form>`;

  return new Promise((resolve) => {
    document.body.appendChild(el);
    const input = document.querySelector("#custom-prompt-input");
    input.focus();
    input.value = _default;
    document
      .querySelector("#custom-prompt")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const answer = input.value;
        document.body.removeChild(el);
        resolve(answer);
      });
  });
}
