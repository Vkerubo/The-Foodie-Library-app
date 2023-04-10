// Wait for the DOM to load before executing this code
document.addEventListener('DOMContentLoaded', async () => {
    // Define constants for the Edamam API app ID, app key, and base URL
    const appId = "82f6a6de";
    const appKey = "12d9ce315e26aecc7cbe188279ad6c5f";
    const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${appKey}`;
    //Get references to important DOM elements
    const recipeContainer = document.querySelector("#recipe-container");
    const textSearch = document.querySelector("#textSearch");
    const buttonFind = document.querySelector(".button");
    const loadingElement = document.querySelector("#loading");
    const feedbackButton = document.getElementById("feedback-button");
    const aboutButton = document.getElementById("about-button");
 
    // Add event listener to the search button to load recipes
    buttonFind.addEventListener("click", () => loadRecipes(textSearch.value));
    // Add event listener to the search box to load recipes when "Enter" key is pressed
    textSearch.addEventListener("keyup", (e) => {
      const inputVal = textSearch.value;
      if (e.keyCode === 13) {
        loadRecipes(inputVal);
      }
    });

     // Function to toggle loading spinner on/off
    const toggleLoad = (element, isShow) => {
      element.classList.toggle("hide", isShow);
    }

    // Function to set the scroll position to the top of the recipe container
    const setScrollPosition = () => {
      recipeContainer.scrollTo({ top : 0, behavior : "smooth"});
    }

    // Function to make the API request and load recipes onto the webpage
    function loadRecipes( type = "chicken", filter = "all") {
      // Show the "loading" spinner
      toggleLoad(loadingElement, false);
      let url = baseUrl + `&q=${type}`;
      // Add health filter to the URL if specified
      if (filter !== "all"){
        url += `&health=${filter}`
      }
      console.log(url);
      // Use fetch to make the API request
      fetch(url)
        .then((res) =>{
           if (!res.ok) {
            throw new Error("Network response was not ok");
           }
        return res.json()})
       .then((data) => {
        renderRecipes(data.hits); // Render the recipes on the page
        toggleLoad(loadingElement, true); // Hide the "loading" spinner
       })
       .catch((error) => toggleLoad(loadingElement, true))  // Handle any errors and hide the spinner
       .finally(() => setScrollPosition());   // Scroll to the top of the recipe container
    }
    //Load the default recipes when the page first loads
    loadRecipes();

    // Add an event listener to the health filter dropdown to trigger a search with the selected filter
    const filterDropdown = document.querySelector("#filterDropdown");
    filterDropdown.addEventListener("change", () => {
      const selectedFilter = filterDropdown.value;
      loadRecipes(textSearch.value, selectedFilter);
    });

    // Function to get a string of HTML for the recipe steps list
    const getRecipeStepsString = (ingredientLines = []) => {
      let string = "";
      for (const step of ingredientLines){
        string = string+`<li>${step}</li>`
      }
      return string;
    }

    // Function to render the list of recipes on the page
    const renderRecipes = (recipeList = []) => {
      recipeContainer.innerHTML = "";
      recipeList.forEach((recipeObj) => {
        const {
          label: recipeTitle,
          ingredientLines,
          image: recipeImage,
          calories,
          cautions,
          cuisineType,
          dietLabels,
          healthLabels,
          mealType,
          totalNutrients,
        } = recipeObj.recipe;
        const recipeStepString = getRecipeStepsString(ingredientLines);
        const htmlString = ` <div class="recipe">
          <div class="recipe-title">
            ${recipeTitle}
            <button class="heart-button">
              <i class="far fa-heart"></i>
              <i class="fas fa-heart"></i>
            </button>
          </div>
          <div class="recipe-image">
            <img src="${recipeImage}" alt="Recipe" />
          </div>
        </div>`;
        recipeContainer.insertAdjacentHTML("beforeend", htmlString);
  
      // Add event listener to the heart button
      const heartButton = recipeContainer.lastElementChild.querySelector(
        ".heart-button"
      );
      heartButton.addEventListener("click", () => {
        heartButton.classList.toggle("clicked");
        heartButton.querySelector("i").classList.toggle("far");
      });

  
      // Add event listener to the recipe container to show recipe details in a modal when the recipe is clicked
      const recipe = recipeContainer.lastElementChild;  // Select the last child element of the recipe container
      recipe.addEventListener("click", (e) => {  // Add a click event event listener to the recipe element
        e.stopPropagation();  // Stop the click element from propagating to other elements
        console.log("click");
        // Create a new 'div' element to hold the modal and add class to it
        const modal = document.createElement("div");
        modal.classList.add("modal");
        // Define contents of the modal
        const modalContent = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <div class="recipe-details">
              <img src="${recipeImage}" alt="Recipe" />
              <div class="recipe-info">
                <h2>${recipeTitle}</h2>
                <p>Calories: ${calories.toFixed(2)}</p>
                <p>Cautions: ${cautions.join(", ")}</p>
                <p>Cuisine Type: ${cuisineType}</p>
                <p>Diet Labels: ${dietLabels.join(", ")}</p>
                <p>Health Labels: ${healthLabels.join(", ")}</p>
                <p>Meal Type: ${mealType.join(", ")}</p>
                <p>Total Nutrients:</p>
                <ul>
                  <li>Carbs: ${totalNutrients.CHOCDF.quantity.toFixed(
                    2
                  )} ${totalNutrients.CHOCDF.unit}</li>
                  <li>Fat: ${totalNutrients.FAT.quantity.toFixed(
                    2
                  )} ${totalNutrients.FAT.unit}</li>
                  <li>Protein: ${totalNutrients.PROCNT.quantity.toFixed(
                    2
                  )} ${totalNutrients.PROCNT.unit}</li>
                </ul>
                <p>Recipe Steps:</p>
                <ul>
                  ${recipeStepString}
                </ul>
              </div>
            </div>
          </div>
        `;
        modal.innerHTML = modalContent;  // Add the modal content to the modal element
        document.body.appendChild(modal);  // Add the modal to the webpage
  
        // Define a function to close the modal
        const closeModal = () => {
          console.log("Closing modal");
          modal.remove();
        };
        // Add an event listener to the close button in the modal to call the closeModal function
        const closeElement = modal.querySelector(".close");
        if (closeElement) {
          closeElement.addEventListener("click", closeModal);
        }

        // Add an event listener to the window object to call the closeModal function when the user clicks outside the modal
        window.addEventListener("click", (event) => {
          if (event.target === modal) {
            closeModal();
          }
        });
      });
    });
   };

   // Add event listener to the "Feedback" button to allow users to submit feedback
   feedbackButton.addEventListener("click", () => {
     const feedback = prompt("Please leave your feedback:");
      if (feedback) {
        alert("Thank you for your feedback!");
      }
    })
  
    // Add event listener to the "About" button to display information about the app
    const aboutInfo = "The NutriCookLibrary allows you to search for recipes based on specific ingredients and health preferences. It is designed to help users find healthy recipes that meet their dietary requirements, or for those who want to try new recipes using ingredients they already have on hand.";
    aboutButton.addEventListener("click", () => {
       alert(aboutInfo);
    });
  
    // Add event listener to the "Contact" button to display the contacts of the app for any more information or inquiries
    const contactButton = document.getElementById("contact-button");
    const contactInfo = "Email us here";
    contactButton.addEventListener("click", () => {
      alert(contactInfo);
    });
});
