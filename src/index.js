import "./style.css";
const card = document.querySelectorAll(".card");
const chosencard = document.querySelector(".chosen-cards");
const revealbutton = document.querySelector(".reveal-cards");
const playagain = document.querySelector(".play-again");
const average = document.querySelector(".average");
const pick = document.querySelector(".pick");
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
    }
  });
  card.forEach((element) => {
    element.classList.add("active2");
  });

  average.innerHTML = "Average: " + chosencard.innerHTML;
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
  average.innerHTML = "Average : " + chosencard.innerHTML;
});
