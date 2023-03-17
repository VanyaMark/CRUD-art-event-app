// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event

document.addEventListener("DOMContentLoaded", () => {
  console.log("CRUD-art-event-app JS imported successfully!");
});


//This prevents default enter from an input field, and instead forces user to click on a button using the mouse

let input = [...document.getElementsByTagName("input")];
input.forEach((input) => {
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
})

//Initialization

let wallSizeValue = [...document.querySelectorAll('.price-by-wall-size')]

let totalPrice = [...document.querySelectorAll('.cart-total')]

let dateInput = [...document.querySelectorAll('.dt')]


//Function to create numbers array, showing number of individuals per gender

function createArray(users) {

  let newGenderArray = []
  let female = 0;
  let male = 0;
  let nonBinary = 0;
  let ratherNotSay = 0;
  for (let i = 1; i < users.length; i++) {
    if (users[i].gender === "Female") {
      female += 1
    }
    if (users[i].gender === "Male") {
      male += 1
    }
    if (users[i].gender === "Non-Binary") {
      nonBinary += 1
    }
    if (users[i].gender === "Rather Not Say") {
      ratherNotSay += 1
    }
  }
  newGenderArray.push(female);
  newGenderArray.push(male);
  newGenderArray.push(nonBinary);
  newGenderArray.push(ratherNotSay);
  console.log(newGenderArray)
  return newGenderArray

}

window.onload = () => {

  //To ensure that date of birth can only be picked from the past

  dateInput.forEach((date) => {
    date.max = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
  })

  //To calculate total cart price depending on which wall size an artist picks
  
  wallSizeValue.forEach((wall) => {
    if (wall.value === '1m space - €80 per week') {
      totalPrice.forEach((total) => {
        total.innerHTML = 80
      })
    }
    else if (wall.value === '2m space - €120 per week') {
      totalPrice.forEach((total) => {
        total.innerHTML = 120
      })
    }
    else if (wall.value === '3m space - €150 per week') {
      totalPrice.forEach((total) => {
        total.innerHTML = 150
      })
    }
  })

  //To draw the charts on the statistics page

  const canvas = document.querySelector("#my-canvas")
  const ctx = canvas.getContext('2d')

  fetch("http://localhost:3000/statsDetails", { credentials: "same-origin" })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      const users = data.map(user => {
        return {
          gender: user.gender,
        }
      })
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['female', 'male', 'non-binary', 'rather not say'],
          datasets: [
            {
              backgroundColor: ['red', 'blue','green','yellow'],
              label: "Users by Gender",
              data: createArray(users)
            }
          ]
        },
        options: {
          scale: {
            y: {
              min: 0
            }
          }
        }
      })
    })
}


