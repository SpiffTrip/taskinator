var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");

var tasks = [];

var taskFormHandler = function(event) {

    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("you need to fill out the task form!");
        return false;
    }
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task id and call funtion to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attrubute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    };

    createTaskEl(taskDataObj);
     
    }
};

var createTaskEl = function(taskDataObj) {
    
        //create list item
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        // add task id as a custom attribute
        listItemEl.setAttribute("data-task-id", taskIdCounter);


        //create div to hold task info and add to list item
        var taskInfoEl = document.createElement("div");
        //give it a class name
        taskInfoEl.className = "task-info";
        //add html content to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    
        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(taskIdCounter);
        listItemEl.appendChild(taskActionsEl);

        taskDataObj.id = taskIdCounter;
        tasks.push(taskDataObj);

        saveTasks();
        
        
    
        //add entire list item to list
        tasksToDoEl.appendChild(listItemEl);

        //increase task counter for next unique id
        taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);
    
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("Option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        //apend to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;

};

var completeEditTask = function(taskName, taskType, taskId) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

   taskSelected.querySelector("h3.task-name").textContent = taskName;
   taskSelected.querySelector("span.task-type").textContent = taskType;

   alert("Task Updated!");

   formEl.removeAttribute("data-task-id");
   document.querySelector("#save-task").textContent = "Add Task";

   //loop through tasks array and task object with new content
   for (var i = 0; i < tasks.length; i++) {
       if (tasks[i].id === parseInt(taskId)) {
           tasks[i].name = taskName;
           tasks[i].type = taskType;
       }
       saveTasks()
   }
};


var taskButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")){
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
 };

 var editTask = function(taskId) {
     // get task element
     var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

     var taskName = taskSelected.querySelector("h3.task-name").textContent;
     

     var taskType = taskSelected.querySelector("span.task-type").textContent;

     document.querySelector("input[name='task-name']").value = taskName;
     document.querySelector("select[name='task-type']").value = taskType;
     document.querySelector("#save-task").textContent = "Save Task";
     formEl.setAttribute("data-task-id", taskId);
     
};

var taskStatusChangeHandler = function(event) {
    // get the task items id
   var taskId = event.target.getAttribute("data-task-id");
    // get teh currently selected options value and convert it to lowercase
   var statusValue = event.target.value.toLowerCase();
    // find the parent task item element based on the id
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

   if (statusValue === "to do") {
       tasksToDoEl.appendChild(taskSelected);
   }
   else if (statusValue === "in progress") {
       tasksInProgressEl.appendChild(taskSelected);
   }
   else if (statusValue === "completed") {
       tasksCompletedEl.appendChild(taskSelected);
   }
   // update tasks in tasks array
   for (var i = 0; i < tasks.length; i++) {
       if (tasks[i].id === parseInt(taskId)) {
           tasks[i].status = statusValue;
           
       }
    }
    saveTasks();

};


 

var deleteTask = function(taskId) {
    console.log(taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    // create new array to hold updated list of tasks
    var updatedTaskArr = [];
    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesnt match the value of taskId, lets keep that task
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassignt tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks()
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
    // if no tasks, set tasks to empty array and return out of function

    if (!savedTasks) {
        return false;
    }
    console.log("Found saved tasks");
    // else load up saved tasks

    // parse into array of objects
    savedTasks = JSON.parse(savedTasks);
    // loop through saved tasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task obj into the createtaskel function
        createTaskEl(savedTasks[i]);
    }

}


pageContentEl.addEventListener("change", taskStatusChangeHandler);
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);

loadTasks();