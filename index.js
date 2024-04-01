// const addBtn = document.querySelector("#add-btn");

// const newTaskInput = document.querySelector("#wrapper input");

// const tasksContainer = document.querySelector("#tasks");

// const error = document.getElementById("error");

// const countValue = document.querySelector(".count-value");

// let taskCount = 0;

// const displayCount = (taskCount) => {
//   countValue.innerText = taskCount;
// };

// const addTask = () => {
//   const taskName = newTaskInput.value.trim();
//   error.style.display = "none";

//   if (!taskName) {
//     setTimeout(() => {
//       error.style.display = "block";
//     }, 200);
//     return;
//   }

//   let task = `<div class="task">
//     <input type="checkbox" class="task-check">
//     <span class="taskname">${taskName}</span>
//     <button class="edit">
//       <i class="fa-solid fa-pen-to-square"></i>
//     </button>
//     <button class="delete">
//       <i class="fa-solid fa-trash"></i>
//     </button>
//     </div>`;

//   tasksContainer.insertAdjacentHTML("beforeend", task);

//   const deleteButtons = document.querySelectorAll(".delete");

//   deleteButtons.forEach((button) => {
//     button.onclick = () => {
//       button.parentNode.remove();
//       taskCount -= 1;
//       displayCount(taskCount);
//     };
//   });

//   const editButtons = document.querySelectorAll(".edit");

//   editButtons.forEach((editBtn) => {
//     editBtn.onclick = (e) => {
//       let targetElement = e.target;
//       if (!(e.target.className == "edit")) {
//         targetElement = e.target.parentElement;
//       }

//       newTaskInput.value = targetElement.previousElementsSibling?.innerText;
//       targetElement.parentNode.remove();
//       taskCount -= 1;
//       displayCount(taskCount);
//     };
//   });

//   const tasksCheck = document.querySelectorAll(".task-check");
//   tasksCheck.forEach((checkBox) => {
//     checkBox.onChange = () => {
//       checkBox.nextElementSibling.classList.toggle("completed");
//       if (checkBox.checked) {
//         taskCount -= 1;
//       } else {
//         taskCount += 1;
//       }

//       displayCount(taskCount);
//     };
//   });

//   taskCount += 1;
//   displayCount(taskCount);
//   newTaskInput.value = "";
// };

// addBtn.addEventListener("click", addTask);

// window.onload = () => {
//   taskCount = 0;
//   displayCount(taskCount);
//   newTaskInput.value = "";
// };

//Initial References
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;
const error = document.getElementById("error");
//Function on window load
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};
//Function to Display The Tasks
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksDiv.style.display = "inline-block";
  } else {
    tasksDiv.style.display = "none";
  }
  //Clear the tasks
  tasksDiv.innerHTML = "";
  //Fetch All The Keys in local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();
  for (let key of tasks) {
    let classValue = "";
    //Get all values
    let value = localStorage.getItem(key);
    let taskInnerDiv = document.createElement("div");
    taskInnerDiv.classList.add("task");
    taskInnerDiv.setAttribute("id", key);
    taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;
    //localstorage would store boolean as string so we parse it to boolean back
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskInnerDiv.classList.add("completed");
    }
    taskInnerDiv.appendChild(editButton);
    taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksDiv.appendChild(taskInnerDiv);
  }
  //tasks completed
  tasks = document.querySelectorAll(".task");
  tasks.forEach((element, index) => {
    element.onclick = () => {
      //local storage update
      if (element.classList.contains("completed")) {
        updateStorage(element.id.split("_")[0], element.innerText, false);
      } else {
        updateStorage(element.id.split("_")[0], element.innerText, true);
      }
    };
  });
  //Edit Tasks
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      //Stop propogation to outer elements (if removed when we click delete eventually rhw click will move to parent)
      e.stopPropagation();
      //disable other edit buttons when one task is being edited
      disableButtons(true);
      //update input value and remove div
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      //set updateNote to the task that is being edited
      updateNote = parent.id;
      //remove task
      parent.remove();
    });
  });
  //Delete Tasks
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      //Delete from local storage and remove div
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;
    });
  });
};
//Disable Edit Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};
//Remove Task from local storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};
//Add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};
//Function To Add New Task
document.querySelector("#push").addEventListener("click", () => {
  //Enable the edit button
  disableButtons(false);
  error.style.display = "none";
  if (newTaskInput.value.length == 0) {
    setTimeout(() => {
      error.style.display = "block";
    }, 200);
    return;
  } else {
    //Store locally and display from local storage
    if (updateNote == "") {
      //new task
      updateStorage(count, newTaskInput.value, false);
    } else {
      //update task
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count += 1;
    newTaskInput.value = "";
  }
});
