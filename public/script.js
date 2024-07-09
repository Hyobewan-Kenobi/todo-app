const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

//This array will store all the tasks along with their associated data, including title, due date, and description. This storage will enable you to keep track of tasks, display them on the page, and save them to localStorage.
const taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

//refactoring submit eventlistener to 2 parts
//#1 add the input values to taskData
const addOrUpdateTask=()=>{
  addOrUpdateTaskBtn.innerText = "Add Task"  
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    const taskObj = {
      id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
      title: titleInput.value,
      date: dateInput.value,
      description: descriptionInput.value,
    };
  
      if (dataArrIndex === -1) {
      taskData.unshift(taskObj);
      } else {
        taskData[dataArrIndex] = taskObj
      }

    //save task items to local storage when the user adds, updates, or removes a task
    localStorage.setItem("data", JSON.stringify(taskData))
    
    updateTaskContainer();
    reset();
}

//#2 adding the tasks to the DOM
const updateTaskContainer=()=>{
    //clear out the existing contents of tasksContainer to remove duplicate when you add another task
    tasksContainer.innerHTML = ""
    taskData.forEach(
      ({ id, title, date, description }) => {
          (tasksContainer.innerHTML += `
          <div class="task" id="${id}">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Description:</strong> ${description}</p>
            <button type="button" class="btn" onclick="editTask(this)">Edit</button>
            <button type="button" class="btn" onclick="deleteTask(this)">Delete</button>
          </div>
        `)
      }
    );
}

const deleteTask = (buttonEl) => {
    const dataArrIndex = taskData.findIndex(
      (item) => item.id === buttonEl.parentElement.id
    );
    
    buttonEl.parentElement.remove();
    taskData.splice(dataArrIndex,1);
    //You also want a deleted task to be removed from local storage. For this, you don't need the removeItem() or clear() methods. Since you already use splice() to remove the deleted task from taskData, all you need to do now is save taskData to local storage again.
    localStorage.setItem("data", JSON.stringify(taskData))
}

const editTask=(buttonEl)=>{
  const dataArrIndex = taskData.findIndex(
    (item)=> item.id === buttonEl.parentElement.id);
  
    //task to be edited is now in the currentTask
    currentTask = taskData[dataArrIndex];
    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    descriptionInput.value = currentTask.description;
    
    addOrUpdateTaskBtn.innerText = 'Update Task'

    taskForm.classList.toggle("hidden"); 
}

//created a reset function that clears all input fields, toggle the form, and reset currentTask to an empty object
const reset = () => {
    titleInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    taskForm.classList.toggle("hidden");
    currentTask = {};
  }

//check the length to see if there is anything inside of taskData, if there is (greater 0 value), run updateTaskContainer()
if (taskData.length) {
  updateTaskContainer()
}

//The toggle method will add the class if it is not present on the element, and remove the class if it is present on the element.
openTaskFormBtn.addEventListener('click', function(){
    taskForm.classList.toggle('hidden');
  });

//modal is presented when 'x' is clicked
closeTaskFormBtn.addEventListener('click',()=>{
    const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description;
    
    //formInputValuesUpdated added as the second condition for the if statement so the 'cancel' and 'discard' buttons in the modal won't be displayed to the user if they haven't made any changes to the input fields while attempting to edit a task
    if (formInputsContainValues && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        reset();
    }
    
})

//cancel button only closes the modal
cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener('click',()=>{
    //close the modal
    confirmCloseDialog.close();
    reset();
  })

taskForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    addOrUpdateTask();
    
    /*
    REFACTORED

    //implicit return
    const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
    //when a user creates a task, save in an object
    const taskObj = {
        //make a unique title input id with the value entered by the user. made lowercase, split then joined to convert spaces into a hyphen, added timestamp at the end to make it more unique
        id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title: titleInput.value,
        date: dateInput.value,
        description: descriptionInput.value,
    };
    if (dataArrIndex === -1){
        taskData.unshift(taskObj);
      };
    taskData.forEach(({id, title, date, description}) => {
        (tasksContainer.innerHTML += `
            <div class="task" id="${id}">
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Description:</strong> ${description}</p>
            <button type="button" class="btn">Edit</button>
            <button type="button" class="btn">Delete</button>
            </div>
        `)
        } 
    );
    */

})
