document.addEventListener('DOMContentLoaded', async () => {
const appId = "82f6a6de";
const appKey = "12d9ce315e26aecc7cbe188279ad6c5f";
const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${appKey}`;
const recipeContainer = document.querySelector("#recipe-container");
const textSearch = document.querySelector("#textSearch");
const buttonFind = document.querySelector(".button");
const loadingElement = document.querySelector("#loading");
const feedbackButton = document.getElementById("feedback-button")
 

buttonFind.addEventListener("click", () => loadRecipes(textSearch.value));

textSearch.addEventListener("keyup", (e) => {
    const inputVal = textSearch.value;
    if (e.keyCode === 13) {
        loadRecipes(inputVal);
    }
});

const toggleLoad = (element, isShow) => {
    element.classList.toggle("hide", isShow);
}

const setScrollPosition = () => {
    recipeContainer.scrollTo({ top : 0, behavior : "smooth"});
}

//use fetch to make the API request
function loadRecipes( type = "chicken", filter = "all") {
    toggleLoad(loadingElement, false);
    let url = baseUrl + `&q=${type}`;
    if (filter !== "all"){
        url += `&health=${filter}`
    }
    console.log(url);
    fetch(url)
     .then((res) =>{
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
      return res.json()})
     .then((data) => {
      renderRecipes(data.hits);
      toggleLoad(loadingElement, true); 
     })
     .catch((error) => toggleLoad(loadingElement, true))
     .finally(() => setScrollPosition()); 
}
loadRecipes();

const filterDropdown = document.querySelector("#filterDropdown");
filterDropdown.addEventListener("change", () => {
  const selectedFilter = filterDropdown.value;
  loadRecipes(textSearch.value, selectedFilter);
});

   const getRecipeStepsString = (ingredientLines = []) => {
    let string = "";
    for (const step of ingredientLines){
        string = string+`<li>${step}</li>`
    }
    return string;
   }

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

  
      // Add event listener to show recipe details on hover
      const recipe = recipeContainer.lastElementChild;
      recipe.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("click");
        const modal = document.createElement("div");
        modal.classList.add("modal");
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
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
  
        const closeModal = () => {
          console.log("Closing modal");
          modal.remove();
        };
        const closeElement = modal.querySelector(".close");
        if (closeElement) {
          closeElement.addEventListener("click", closeModal);
        }
        window.addEventListener("click", (event) => {
          if (event.target === modal) {
            closeModal();
          }
        });
      });
    });
  };

 feedbackButton.addEventListener("click", () => {
    const feedback = prompt("Please leave your feedback:");
    if (feedback) {
 alert("Thank you for your feedback!");
    }
 })
})
