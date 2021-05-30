// ****** select items **********

const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option 
let editElement;
let editFlag = false;
let editID  = "";

// Event listners
form.addEventListener("submit", addItem);

// clear items
clearBtn.addEventListener("click", clearItems);

window.addEventListener('DOMContentLoaded', setupItems);

const deletebtn = document.querySelector('.delete-btn');

function addItem(e){
     e.preventDefault();
    //  console.log(grocery.value); 
    const value = grocery.value;

    const id = new Date().getTime().toString();   // to generate a random value 
    
    if(value && !editFlag){

        createListItem(id, value);
     
       // display alert
        displayAlert("items added to the list ", "success");
        // show container
        container.classList.add("show-container");
        // add local stroage
        addToLocalStorage(id, value);
        // back to defautl 
        setBackToDefault();
    }

    else if(value && editFlag){ 
        editElement.innerHTML = value;
        displayAlert('value changed', 'sucess');
        editLocalStorage(editID, value);
        setBackToDefault();
    }

    else{
      displayAlert("Empty fields", "danger");
    }
}

// display alert function
function displayAlert(text, action){       
     alert.textContent = text;
     alert.classList.add(`alert-${action}`);

     //remove alert -> after some time do this 
     setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
     }, 1000);     
}

function clearItems(){
    const items = document.querySelectorAll(".grocery-item");
    
    if(items.length  > 0){
        items.forEach(function(item){
            list.removeChild(item);
        })
    }

    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

function addToLocalStorage(id, value){
   
}

function deleteItem(e){
   const element = e.currentTarget.parentElement.parentElement;
   const id = element.dataset.id;

   list.removeChild(element);

   if(list.children.length === 0){
        container.classList.remove('show-container');
   }

   displayAlert('item deleted', "danger");
   setBackToDefault();    // remove from local storage

}

function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;  //set some form value 
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit"; 
}

function setBackToDefault(){
    grocery.value = '';
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

function addToLocalStorage(id, value){
   const grocery = {id: id, value: value};
   let items = getLocalStorage();
    
   items.push(grocery);
   localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage(id, value){
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")): []; 
}

function removeFromLocalStorage(id, value){
    let items = getLocalStorage();

    items = items.filter(function(item){
      if(item.id !== id){
           return item;
      } 
    })

    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value){
      let items = getLocalStorage();
      items = items.map(function(item){
          if(item.id === id){
              item.value = value;
          }
          return item;
      });

      localStorage.setItem("list", JSON.stringify(items));
}

function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(items.id, items.value)
        })         
    }

    container.classList.add("show-container");
}

function createListItem(id, value){
    const element = document.createElement('article');
    element.classList.add('grocery-list');  // adding items to the list 
    
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = ` <p class="title">${value}</p>
    <div class="btn-container">
         <button type="button" class="edit-btn">
             <i class="fas fa-edit"></i>
         </button>
         <button type="button" class="delete-btn">
             <i class="fas fa-trash"></i>
         </button>
    </div>`;

    const deletebtn = element.querySelector('.delete-btn');
    const editbtn = element.querySelector('.edit-btn');
    
    deletebtn.addEventListener('click', deleteItem);
    editbtn.addEventListener('click', editItem);

    // append child add to the list 
     list.appendChild(element);
}