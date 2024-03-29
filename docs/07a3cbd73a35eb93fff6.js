import"./style.css";import{io}from"socket.io-client";const card=document.querySelectorAll(".card"),chosencard=document.querySelector(".chosen-cards"),revealbutton=document.querySelector(".reveal-cards"),playagain=document.querySelector(".play-again"),average=document.querySelector(".average"),pick=document.querySelector(".pick"),user=document.querySelector(".usernames");card.forEach((e=>{e.addEventListener("click",(c=>{e.classList.toggle("active"),e.classList.contains("active")?(chosencard.classList.add("active"),revealbutton.classList.add("active4"),pick.classList.add("active5"),pick.classList.remove("active4"),revealbutton.classList.remove("active5"),revealbutton.classList.remove("active2"),chosencard.innerHTML=e.innerHTML,chosencard.style.color="black",socket.emit("cardValue",chosencard.innerHTML)):(chosencard.classList.remove("active"),revealbutton.classList.add("active5"),pick.classList.add("active4"),pick.classList.remove("active5"),chosencard.innerHTML="")}))})),document.addEventListener("click",(e=>{card.forEach((c=>{e.target!=c&&c.classList.remove("active")}))})),revealbutton.addEventListener("click",(e=>{revealbutton.classList.add("active2"),revealbutton.classList.remove("active4"),playagain.classList.add("active3"),playagain.classList.remove("active2");const c=document.querySelector(".card.active");c&&(chosencard.innerHTML=c.innerHTML,chosencard.style.color="white",socket.emit("cardValue",chosencard.innerHTML)),card.forEach((e=>{e.classList.add("active2")})),average.classList.add("active4")})),playagain.addEventListener("click",(e=>{playagain.classList.add("active2"),playagain.classList.remove("active3"),pick.classList.add("active4"),pick.classList.remove("active5"),chosencard.innerHTML="",card.forEach((e=>{e.classList.remove("active2")})),average.classList.remove("active4"),socket.emit("resetAverage")}));const socket=io("http://localhost:3000");function getName(){const e=prompt("Please enter your name:");let c=document.querySelector("#name");null!==e&&""!==e?c.innerHTML+=e:alert("You did not enter a name.")}function sendName(){let e=document.querySelector("#name").innerHTML;socket.emit("Username",e)}function getAverage(){socket.on("Average",(e=>{average.innerHTML="The average is : "+e}))}function displayCards(){socket.on("Usernames",(e=>{e.length>1?socket.on("SelectedCard",handleSelectedCard):(chosencard.innerHTML="",socket.off("SelectedCard",handleSelectedCard))}))}function handleSelectedCard(e){const c=document.createElement("div");c.innerHTML=e,c.classList.add("chosen-cards2"),chosencard.appendChild(c)}function displayUsers(){socket.on("Usernames",(e=>{user.innerHTML="Connected users : ",e.forEach((e=>{const c=document.createElement("li");c.textContent=e,user.appendChild(c)}))}))}socket.on("connect",(()=>{console.log("Connected to server with id%o",socket.id)})),socket.on("disconnect",(()=>{console.log("Disconnected from server")})),displayCards(),displayUsers(),getAverage(),getName(),sendName();