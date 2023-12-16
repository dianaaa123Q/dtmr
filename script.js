// Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

let sharedVariable = localStorage.getItem('userId');
let sharedName = localStorage.getItem('userName');
const welcomeHeading = document.getElementById('welcome');
welcomeHeading.innerHTML = `Write your homework ${sharedName}`;

// Event listeners
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

// Mock API URL
const apiUrl = `https://656951d1de53105b0dd6e610.mockapi.io/user`;

// Functions
showTodosFromDatabase();

async function getTodosFromDatabase() {
  try {
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch todos from the database.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching todos from the database:", error);
    return [];
  }
}

async function showTodosFromDatabase() {
  const todos = await getTodosFromDatabase();
  console.log(todos);
  todos.forEach(todo => {
    // Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    // create id
    todoDiv.dataset.id = todo.id;
    // Create list
    const newTodo = document.createElement("li");
    newTodo.innerText = todo.name;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // Set completed class if todo is completed
    if (todo.completed) {
      todoDiv.classList.add("completed");
    }

    // Attach todo to the list
    todoList.appendChild(todoDiv);
  });
}

async function addTodoToDatabase(todoText) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: todoText,
        completed: false,
      }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      console.log('Todo added to database successfully!', newTodo);
      return newTodo;
    } else {
      console.error('Failed to add todo to the database.');
      return null;
    }
  } catch (error) {
    console.error('Error adding todo to the database:', error);
    return null;
  }
}

// Call this function to initially load todos from the database
async function addTodo(e) {
  e.preventDefault();

  // Create todo div
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  // Add to database and get the new todo with ID
  const addedTodo = await addTodoToDatabase(todoInput.value);

  console.log("Added Todo:", addedTodo);

  if (addedTodo) {
    // Set dataset.id using the ID from the new todo
    todoDiv.dataset.id = addedTodo.id;

    // Create list item and other elements as needed
    const newTodoItem = document.createElement("li");
    newTodoItem.innerText = addedTodo.name;
    newTodoItem.classList.add("todo-item");
    todoDiv.appendChild(newTodoItem);

    // Create Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // Create trash button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // Attach final Todo
    todoList.appendChild(todoDiv);

    console.log("UI Updated");

    // Clear input
    todoInput.value = "";
  }
}

async function deleteCheck(e) {
  const item = e.target;

  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    console.log(todo);

    todo.classList.add("fall");
    todo.addEventListener("transitionend", e => {
      // Remove the todo from the database before removing it from the UI
      const todoId = todo.dataset.id; // Assuming you have a data-id attribute set on the todo element
      console.log(todoId)
      deleteTodoFromDatabase(todoId);
      todo.remove();
    });
  }

  if (item.classList[0] === "complete-btn") {
    const todo = item.parentElement;
    todo.classList.toggle("completed");

    // Update the completed status in the database
    const todoId = todo.dataset.id; // Assuming you have a data-id attribute set on the todo element
    console.log(todoId);
    const completedStatus = todo.classList.contains("completed");
    console.log(completedStatus);
    updateTodoStatusInDatabase(todoId, completedStatus);
  }
}

async function updateTodoStatusInDatabase(todoId, completedStatus) {
  try {
    const response = await fetch(`${apiUrl}/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: completedStatus,
      }),
    });

    if (response.ok) {
      console.log("Todo status updated in the database successfully!");
    } else {
      console.error("Failed to update todo status in the database.");
    }
  } catch (error) {
    console.error("Error updating todo status in the database:", error);
  }
}

async function deleteTodoFromDatabase(todoId) {
  try {
    const response = await fetch(`${apiUrl}/${todoId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Todo deleted from the database successfully!");
    } else {
      console.error("Failed to delete todo from the database.");
    }
  } catch (error) {
    console.error("Error deleting todo from the database:", error);
  }
}

function filterTodo(e) {
  const todos = Array.from(todoList.children);
  todos.forEach(function (todo) {
    if (todo.nodeType === 1) {
      switch (e.target.value) {
        case "all":
          todo.style.display = "flex";
          break;
        case "completed":
          if (todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          break;
        case "uncompleted":
          if (!todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          break;
      }
    }
  });
}
async function addTodoToDatabase(todoText) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: todoText,
        completed: false,
      }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      console.log('Todo added to database successfully!', newTodo);
      return newTodo;
    } else {
      console.error('Failed to add todo to the database.');
      return null;
    }
  } catch (error) {
    console.error('Error adding todo to the database:', error);
    return null;
  }
}

async function updateTodoStatusInDatabase(todoId, completedStatus) {
  try {
    const response = await fetch(`${apiUrl}/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: completedStatus,
      }),
    });

    if (response.ok) {
      console.log("Todo status updated in the database successfully!");
    } else {
      console.error("Failed to update todo status in the database.");
    }
  } catch (error) {
    console.error("Error updating todo status in the database:", error);
  }
}

async function deleteTodoFromDatabase(todoId) {
  try {
    const response = await fetch(`${apiUrl}/${todoId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Todo deleted from the database successfully!");
    } else {
      console.error("Failed to delete todo from the database.");
    }
  } catch (error) {
    console.error("Error deleting todo from the database:", error);
  }
}
