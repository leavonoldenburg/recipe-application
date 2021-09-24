window.addEventListener(
  'load',
  () => {
    //
    // ##########################
    // ##  RECIPE CREATE FORM  ##
    // ##########################
    //
    // ### Set ingredient input field count ###
    let ingredientCount = 1;
    // ### Get DOM element nodes ###
    const ingredientsContainerElement = document.getElementById(
      'ingredient-container'
    );
    const addIngredientButtonElement =
      document.getElementById('add-ingredient');
    const removeIngredientButtonElement =
      document.getElementById('remove-ingredient');
    // ### Add ingredient input field function ###
    const addIngredient = () => {
      ingredientCount++;
      const newIngredientElement = document.createElement('input');
      document
        .getElementById('ingredient-container')
        .appendChild(newIngredientElement);
      newIngredientElement.setAttribute('class', 'input-ingredients');
      newIngredientElement.setAttribute('type', 'text');
      newIngredientElement.setAttribute('name', 'ingredients');
      newIngredientElement.setAttribute(
        'placeholder',
        `Ingredient ${ingredientCount}`
      );
    };
    // ### Remove ingredient input field function ###
    const removeIngredient = () => {
      if (ingredientsContainerElement.childElementCount > 3) {
        ingredientCount--;
        ingredientsContainerElement.removeChild(
          ingredientsContainerElement.lastElementChild
        );
      }
    };
    // ### Add button event listeners ###
    if (addIngredientButtonElement) {
      addIngredientButtonElement.addEventListener('click', addIngredient);
    }
    if (removeIngredientButtonElement) {
      removeIngredientButtonElement.addEventListener('click', removeIngredient);
    }
    //
    // ######################################
    // ##  CHANGE PAGINATION BUTTON COLOR  ##
    // ######################################
    //
    // ### Get page number ###
    let page = Number(
      document.getElementById('recipe-count').innerText.split(' ')[0]
    );
    page = page === 0 ? 0 : (page - 1) / 12;
    // ### Set css target depending on page ###
    const paginationButtonElements = document.querySelectorAll('.btn-page');
    console.log(paginationButtonElements);
    paginationButtonElements[page].setAttribute(
      'class',
      'btn btn-sm btn-page active-page'
    );

    console.log('Ironmaker app started successfully!');
  },
  false
);
