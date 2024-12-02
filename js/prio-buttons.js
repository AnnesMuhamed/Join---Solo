let priority = null;

function radioButtonsSelectState() {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  let lastChecked = null;
  radioButtons.forEach((radio) => {
    radio.addEventListener("click", function () {
      if (this === lastChecked) {
        this.checked = false;
        resetRadioImg(this);
        lastChecked = null;
        priority = null;
      } else {
        if (lastChecked != this) {
          radioButtons.forEach((radio) => {
            resetRadioImg(radio);
          });
        }
        changeRadioImg(this);
        getPriority(this.id);
        lastChecked = this;
      }
    });
  });
}

function changeRadioImg(radio) {
  let img = radio.nextElementSibling.querySelector("img");
  if (radio.value === "3") {
    img.src = "./assets/img/prio-high-selected.png";
  } else if (radio.value === "2") {
    img.src = "./assets/img/prio-med-selected.png";
  } else if (radio.value === "1") {
    img.src = "./assets/img/prio-low-selected.png";
  }
}

function resetRadioImg(radio) {
  let img = radio.nextElementSibling.querySelector("img");
  if (radio.value === "3") {
    img.src = "./assets/img/prio-high.png";
  } else if (radio.value === "2") {
    img.src = "./assets/img/prio-med.png";
  } else if (radio.value === "1") {
    img.src = "./assets/img/prio-low.png";
  }
}

function getPriority(id) {
  let radioButton = document.getElementById(`${id}`);
  priority = radioButton.value;
}
