const nav = document.querySelector('.listaLinks')
const menu = document.querySelector('#menuHamburguesa')
let activacionMenu = false
let recipes = JSON.parse(localStorage.getItem('recipes')) || []

// Clases
class Recipe{
  constructor(name, pasos, tips, ...ingredients){
    this.name = name
    this.pasos = pasos
    this.tips = tips
    this.ingredients = ingredients
  }
}

class funciones {
  quitarMensaje(){
    if(recipes.length > 0 ){
      document.querySelector('#textoInformativo').style.display = 'none'
    } else if (recipes.length === 0){
      document.querySelector('#textoInformativo').style.display = 'inline-block'
    }
  }

  addIngredient() {
    const ingredientDiv = document.querySelector('#ingredientList')
    const element = document.createElement('div')
    element.classList.add('ingInd')
    element.innerHTML = `<input type="text" name="ingredientes" class="ingredientes" placeholder="Ingrediente">
      <button class="inputAgregar">+</button>
      <button class="inputEliminar">-</button>`;                                           
    ingredientDiv.appendChild(element)
  }

  deleteingredient(element){
    if(element.parentElement.dataset.index){
      recipes.splice(element.parentElement.dataset.index, element.parentElement.dataset.index + 1)
      localStorage.setItem('recipes', JSON.stringify(recipes))
    }
    element.parentElement.remove()
  }

  resetForm(){
    const ingredientesExtras = document.querySelectorAll('.ingInd')
    ingredientesExtras.forEach(elemt => elemt.remove())
    document.querySelector('form').reset()
  }

  publishRecipes(items){
    const publish = document.querySelector('#recetas')
    publish.innerHTML = items.map((item, index) => {
      return `<article class="recipesPusblish" data-index="${index}"><h3>${item.name}</h3>
              <h4>Ingredientes</h4>
                <ul>
                  ${item.ingredients[0].map(algo => `<li>${algo}</li>`).join('')}
                </ul>
              <h4>Pasos</h4>
                <p class="descReceta">${item.pasos}</p>
              <h4>Tips</h4>
                <p class="descReceta">${item.tips}</p>
                <button class="eliminarReceta">X</button></article>`
              }).join('')
  }

  avisos(mensaje, res, tipo){
    const div = document.createElement('div')
    div.innerHTML = `<div id="aviso" class="${tipo}">
                      <h2>${res}</h2>
                      <p>${mensaje}</p>
                     </div>`
    document.querySelector('main').appendChild(div)
    setTimeout(function(){
      document.querySelector('main').removeChild(div)
    },1000)
  }
}

// EVENTOS

// Guardar y Elminar receta
document.querySelector('.enviar')
        .addEventListener('click', function(e){
  e.preventDefault()
  const int = new funciones()
  
  const name = document.querySelector('#name').value 
  const pasos = document.querySelector('#pasos').value 
  const tips = document.querySelector('#tips').value 
  const ingredientsL = Array.from(document.querySelectorAll('#ingredientList .ingredientes'))
  const ingredients = ingredientsL.map((ing) => {
    return ing.value
  })


  if(name === '' || pasos === '' || tips === '' || ingredients.length === 0 || ingredients.some(elemnt => elemnt === '')){
    int.avisos('Debes completar todos los campos', 'Datos incorrectos', 'eliminar')
    return false
  }
  
  const receta = new Recipe(name, pasos, tips, ingredients)
  recipes.push(receta)
  localStorage.setItem('recipes', JSON.stringify(recipes))

  int.resetForm()
  int.publishRecipes(recipes)
  int.quitarMensaje()
  int.avisos('Tu receta fue Guardada con exito!', 'Exito!!', 'exito')

})

document.querySelector('#recetas')
        .addEventListener('click', function(e){
  const int = new funciones()
  if(e.target.classList.contains('eliminarReceta')){
    int.deleteingredient(e.target)
    int.quitarMensaje()
    int.avisos('Tu receta fue retirada con extio!', 'Eliminacion con exito!', 'exito')
  }
})

// Ingrediente
document.querySelector('#ingredientList')
        .addEventListener('click', function(e){
  e.preventDefault()
  const int = new funciones()
  if(e.target.classList.contains('inputAgregar')){
    int.addIngredient()
  }else if(e.target.classList.contains('inputEliminar')){
    int.deleteingredient(e.target)
  }
})

// Hamburguesa
menu.addEventListener('click', function(){
  if(!activacionMenu){
    menu.classList.add('menuAnimacion')
    activacionMenu = true
    nav.style.height = "50vh";
  }else{
    menu.classList.remove('menuAnimacion')
    activacionMenu = false
    nav.style.height = "0vh";
  }
})

// Al cargar el documento
document.addEventListener('DOMContentLoaded', function(){
  const int = new funciones()
  int.publishRecipes(recipes)
  int.quitarMensaje()
})