// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const filter = document.querySelector("#filter-select");
let doneList = null;
let allList = null;

let oldInputValue;

let saveDoneList = [];
let saveTodoList = [];

localStorage.setItem("saveDoneList", JSON.stringify([]));
localStorage.setItem("saveTodoList", JSON.stringify([]));

// Funções
const saveTodo = (text) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-todo");
  removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(removeBtn);

  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
    }
  });
};

const search = () => {
  doneList = document.querySelectorAll(".done");
  allList = document.querySelectorAll(".todo");
  if (filter.value === "done") {
    allList.forEach((element) => {
      element.style.display = "none";
      doneList.forEach((element) => {
        element.style.display = "flex";
      });
    });
  }
  if (filter.value === "all") {
    allList.forEach((element) => {
      element.style.display = "flex";
    });
  }
  if (filter.value === "todo") {
    allList.forEach((element) => (element.style.display = "flex"));
    doneList.forEach((element) => (element.style.display = "none"));
  }
};

const save = () => {
  const saveDone = document.querySelectorAll(".done");
  saveDoneList = [];
  saveTodoList = [];

  for (let i = 0; i < saveDone.length; i++) {
    saveDoneList.push(saveDone[i].children[0].innerText);
  }

  const saveTodo = document.querySelectorAll(".todo");
  // console.log(saveTodo);
  for (let i = 0; i < saveTodo.length; i++) {
    if (saveTodo[i].classList[1] === "done") {
    } else {
      saveTodoList.push(saveTodo[i].children[0].innerText);
    }
  }
  localStorage.setItem("saveDoneList", JSON.stringify(saveDoneList));
  localStorage.setItem("saveTodoList", JSON.stringify(saveTodoList));
};

const retorno = () => {
  let retornoTodoList = localStorage.getItem("saveTodoList");
  let retornoDoneList = localStorage.getItem("saveDoneList");
  JSON.parse(retornoTodoList).forEach((element) => {
    saveTodo(element);
  });

  JSON.parse(retornoDoneList).forEach((element) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.classList.add("done");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = element;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(removeBtn);

    todoList.appendChild(todo);
  });
};

retorno();

// Filtro por nome

// pegar o elemento de filtro
const filterElemnt = document.querySelector("#search-input");

// Pegar todos os elementos q serão filtrados
const listElements = document.querySelectorAll(".todo");

// Adicionar evento de input
filterElemnt.addEventListener("input", filterList);

// Filter Function
function filterList() {
  // se o filtro não for vazio
  if (filterElemnt.value !== "") {
    // Para cada item da lista uma ação deve ser tomada
    for (let item of listElements) {
      // pegar o titulo q sera filtrado
      let title = item.querySelector("h3");
      // transformar os elemetos em lowercase
      title = title.textContent.toLowerCase();
      // Transformar o value do filtro em lowercase
      let filterTxt = filterElemnt.value.toLowerCase();
      // Se a lista não tiver o filterTxt
      if (!title.includes(filterTxt)) {
        item.style.display = "none";
      } else {
        item.style.display = "flex";
      }
    }
  } else {
    for (item of listElements) {
      item.style.display = "flex";
    }
  }
}

const clearSearch = document.querySelector("#erase-button");
clearSearch.addEventListener("click", (e) => {
  e.preventDefault();
  filterElemnt.value = "";
  filterList();
});

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
  save();
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    save();
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    save();
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;
  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
  save();
});

filter.addEventListener("change", search);
