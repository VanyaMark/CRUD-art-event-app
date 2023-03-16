// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("CRUD-art-event-app JS imported successfully!");
});

let input = [...document.getElementsByTagName("input")];
input.forEach((input)=>{
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });
})

let wallSizeValue = [...document.querySelectorAll('.price-by-wall-size')]

let totalPrice = [...document.querySelectorAll('.cart-total')]

window.onload = ()=>{
  wallSizeValue.forEach((wall)=>{
    if (wall.value === '1m space - €80 per week'){
      totalPrice.forEach((total)=>{
        total.innerHTML= 80
      })
    }
    else if (wall.value === '2m space - €120 per week'){
      totalPrice.forEach((total)=>{
        total.innerHTML= 120
      })
    }
    else if (wall.value === '3m space - €150 per week'){
      totalPrice.forEach((total)=>{
        total.innerHTML= 150
      })
    }
  })
}


