window.addEventListener('load', () => {
  console.log('Ironmaker app started successfully!');
}, false);


let ingredientCount = 1;
const ingredientsContainerElement = document.getElementById('ingredient-container');
const addIngredientButtonElement = document.getElementById('add-ingredient');
const removeIngredientButtonElement = document.getElementById('remove-ingredient');
addIngredient = () => {
  ingredientCount++; const newIngredientElement = document.createElement("input");
  document.getElementById("ingredient-container").appendChild(newIngredientElement);
  newIngredientElement.setAttribute('class', 'input-ingredients');
  newIngredientElement.setAttribute('type', 'text');
  newIngredientElement.setAttribute('name', 'ingredients');
  newIngredientElement.setAttribute('placeholder', `Ingredient${ingredientCount}`); console.log(ingredientCount);
}
removeIngredient = () => {
  if (ingredientsContainerElement.lastElementChild.getAttribute('class') === 'input-ingredients') {
    if (ingredientCount > 0) ingredientCount--;
    ingredientsContainerElement.removeChild(ingredientsContainerElement.lastElementChild);
  }
}

addIngredientButtonElement.addEventListener('click', addIngredient);
removeIngredientButtonElement.addEventListener('click', removeIngredient);
