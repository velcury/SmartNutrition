// Global variable to store selected fruit index for Update operation
let selectedIndex = null;

// Global variable to store fetched fruit data for sorting
let fruitData = [];

// Function to switch between different pages in the application
function showPage(page){

    // Hide all pages first
    document.getElementById("homePage").style.display="none"
    document.getElementById("recommendPage").style.display="none"
    document.getElementById("analysisPage").style.display="none"

    // Display selected page
    if(page=="home")
        document.getElementById("homePage").style.display="block"

    if(page=="recommend")
        document.getElementById("recommendPage").style.display="block"

    if(page=="analysis")
        document.getElementById("analysisPage").style.display="block"
}

// Function to fetch fruit data from FruityVice API
async function loadFruits(){

    let response = await fetch("https://www.fruityvice.com/api/fruit/all")
    fruitData = await response.json()

    displayFruits(fruitData)
}

// Function to display fetched fruit data on Home Page
function displayFruits(data){

    let list = document.getElementById("fruitList")
    list.innerHTML = ""

    data.forEach(fruit => {

        let li = document.createElement("li")
        li.classList.add("fruitCard")

        // Display fruit nutritional information
        li.innerHTML = `
        ${fruit.name}
        | Calories: ${fruit.nutritions.calories}
        | Sugar: ${fruit.nutritions.sugar}
        | Protein: ${fruit.nutritions.protein}
        | Fat: ${fruit.nutritions.fat}
        | Carbs: ${fruit.nutritions.carbohydrates}

        <button onclick="addFruit('${fruit.name}')">Recommend</button>
        `

        list.appendChild(li)

    })
}

// Function to sort fruit list alphabetically
function sortFruits(){

    fruitData.sort((a,b)=>{
        return a.name.localeCompare(b.name)
    })

    displayFruits(fruitData)
}

// CREATE operation: Add recommended fruit to localStorage
function addFruit(name){

    let data = JSON.parse(localStorage.getItem("fruits")) || []

    data.push(name)

    localStorage.setItem("fruits",JSON.stringify(data))

    displayFruit()
}

// READ operation: Display saved recommended fruits
function displayFruit(){

    let data = JSON.parse(localStorage.getItem("fruits")) || []

    let list = document.getElementById("recommendList")
    list.innerHTML=""

    data.forEach((fruit,index)=>{

        let li = document.createElement("li")

        li.innerHTML = `
        ${fruit}
        <button onclick="selectFruit(${index})">Edit</button>
        <button onclick="deleteFruit(${index})">Delete</button>
        `

        list.appendChild(li)

    })
}

// DELETE operation: Remove selected fruit
window.deleteFruit = function(index){

    let data = JSON.parse(localStorage.getItem("fruits")) || []

    data.splice(index,1)

    localStorage.setItem("fruits",JSON.stringify(data))

    displayFruit()
}

// Select fruit to be updated
window.selectFruit = function(index){

    selectedIndex = index

    let data = JSON.parse(localStorage.getItem("fruits")) || []

    document.getElementById("updateFruit").value = data[index]
}

// UPDATE operation: Update selected fruit
window.updateFruit = function(){

    let data = JSON.parse(localStorage.getItem("fruits")) || []

    let newFruit = document.getElementById("updateFruit").value

    if(selectedIndex !== null){
        data[selectedIndex] = newFruit
        localStorage.setItem("fruits",JSON.stringify(data))
        displayFruit()
    }
}

// Data Manipulation: Calculate average calories
async function calculateAverage(){

    let saved = JSON.parse(localStorage.getItem("fruits")) || []

    let response = await fetch("https://www.fruityvice.com/api/fruit/all")
    let data = await response.json()

    let total = 0
    let count = 0

    saved.forEach(selected => {

        let fruit = data.find(f=>f.name==selected)

        if(fruit){
            total += fruit.nutritions.calories
            count++
        }
    })

    let avg = total / count

    document.getElementById("avgResult").innerHTML =
    "Average Calories of Recommended Fruits: " + avg
}

// Data Manipulation: Identify fruit with highest sugar
async function highestSugar(){

    let saved = JSON.parse(localStorage.getItem("fruits")) || []

    let response = await fetch("https://www.fruityvice.com/api/fruit/all")
    let data = await response.json()

    let maxSugar = 0
    let highestFruit = ""

    saved.forEach(selected => {

        let fruit = data.find(f=>f.name==selected)

        if(fruit && fruit.nutritions.sugar > maxSugar){
            maxSugar = fruit.nutritions.sugar
            highestFruit = fruit.name
        }
    })

    document.getElementById("sugarResult").innerHTML =
    "Fruit with Highest Sugar: " + highestFruit + 
    " (" + maxSugar + "g)"
}

// Load saved recommended fruits when application starts
window.onload = displayFruit;