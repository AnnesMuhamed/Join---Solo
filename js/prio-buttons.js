let priority = null;

/**
 * Manages the state of radio buttons, allowing deselection of an already selected button,
 * changing the associated images, and updating the priority value.
 * Ensures only one radio button is active at a time and resets images for others.
 */
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

/**
 * Updates the image of a selected radio button to indicate its selected state based on its value.
 * 
 * @param {HTMLInputElement} radio - The radio button element that is selected.
 */
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

/**
* Resets the image of a radio button to its default (unselected) state based on its value.
* 
* @param {HTMLInputElement} radio - The radio button element to reset.
*/
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

/**
* Sets the global `priority` variable based on the value of the selected radio button.
* 
* @param {string} id - The ID of the selected radio button.
*/
function getPriority(id) {
  let radioButton = document.getElementById(`${id}`);
  priority = radioButton.value;
}