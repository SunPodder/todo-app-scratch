const input = document.getElementById("input")
const todoList = document.getElementById("todos")
const todoMenu = document.getElementById("add-todo")
const openBtn = document.getElementById("open-btn")
const form = document.querySelector("form")
const submit = todoMenu.querySelector("button")
const dueDateInput = document.getElementById("dueDateInput")
const remindDateInput = document.getElementById("remindDateInput")
const repeatDateInput = document.getElementById("repeatDateInput")
const dueDateCon = document.getElementById("dueDate")
const remindDateCon = document.getElementById("remindDate")
const repeatDateCon = document.getElementById("repeatDate")
const completedTodos = document.getElementById("completed-todos")
const details = document.querySelector("details")

form.addEventListener('submit', e => {
  e.preventDefault()
  AddTodo()
  input.value = ""
})

document.getElementById("todo-container").addEventListener('click', () => {
  CloseAddMenu()
})

input.addEventListener('input', () => {
  if(input.value == ""){
    submit.disabled = true
  }else{
    submit.disabled = false
  }
})

function AddTodo(){
  let todo = input.value
  let dueDate = dueDateInput.value.replace(/T/, "; ")
  let remindDate = remindDateInput.value.replace(/T/, "; ")
  let repeatDate = repeatDateInput.value.replace(/T/, "; ")
  if(todo != "" || todo != (null || undefined)){
    let todos = JSON.parse(localStorage.todos)
    let length = todos.length
    let task = {id: length, name: todo, isCompleted: false, due: dueDate, remind: remindDate, repeat: repeatDate}
    let el = document.createElement("li")
    el.id = length
    el.innerHTML = `
      <input type="checkbox" oninput="CompleteTodo('${el.id}')">
      &nbsp; <span>${todo}</span>&emsp;&emsp;
      ${dueDate ? '<small>Due: '+dueDate+'</small>' : ""}
      <button onclick="removeTodo('${el.id}')" class="right"><i class="fa fa-trash"></i></button>` 
    todoList.appendChild(el)
    todos.push(task)
    localStorage.todos = JSON.stringify(todos)
  }
  submit.disabled = true
  dueDateInput.value = undefined
  remindDateInput.value = undefined
  repeatDateInput.value = undefined
  dueDateCon.innerHTML = "Set Due Date"
  remindDateCon.innerHTML = "Remind me"
  repeatDateCon.innerHTML = "Repeat"
}

function removeTodo(id){
  let el = document.getElementById(id)
  el.innerHTML = ""
  try{
    todoList.removeChild(el)
  }catch(err){
    completedTodos.removeChild(el)
  }
  let todos = JSON.parse(localStorage.todos)
  todos.forEach(todo => {
    if(id == todo.id){
      if(todos.length == 1){
        todos = []
      }else {
        todos.splice(todos.indexOf(todo), 1)
      }
    }
  })
  localStorage.todos = JSON.stringify(todos)
  if(details.querySelector("li")){
    details.style.display = "block"
  }else{
    details.style.display = "none"
  }
}

function CompleteTodo(id){
  let li = document.getElementById(id)
  let span = li.querySelector("span")
  let check = li.querySelector("input").checked
  let todos = JSON.parse(localStorage.todos)
  if(check == true){
    span.classList.add("checked")
    todos.forEach(todo => {
      if(todo.id == id){
        todo.isCompleted = true
        todoList.removeChild(li)
        completedTodos.appendChild(li)
      }
    })
  }else if(check == false){
    span.classList.remove("checked")
    todos.forEach(todo => {
      if(todo.id == id){
        todo.isCompleted = false
        completedTodos.removeChild(li)
        todoList.appendChild(li)
      }
    }) 
  }
  localStorage.todos = JSON.stringify(todos)
  if(details.querySelector("li")){
    details.style.display = "block"
  }else{
    details.style.display = "none"
  }
}

function LoadTodos(){
  if(localStorage.todos === "undefined"){
    localStorage.todos = JSON.stringify([])
  }
  let todos = JSON.parse(localStorage.todos)
  todos.forEach(todo => {
    let el = document.createElement("li")
    el.id = todo.id
    el.innerHTML = `
      <input type="checkbox" oninput="CompleteTodo('${todo.id}')">
      &nbsp; <span>${todo.name}</span>&emsp;&emsp;
      ${todo.due ? '<small>Due: '+todo.due+'</small>' : ""}
      <button onclick="removeTodo('${todo.id}')" class="right"><i class="fa fa-trash"></i></button>
      `
    el.querySelector('input').checked = todo.isCompleted
    let span = el.querySelector("span")
    if(todo.isCompleted){
      span.classList.add("checked")
      completedTodos.appendChild(el)
    }else{
      span.classList.remove("checked")
      todoList.appendChild(el)
    }
  })
  if(details.querySelector("li")){
    details.style.display = "block"
  }else{
    details.style.display = "none"
  }
}
LoadTodos()

function addDate(input, con, def){
  let date = input.value
  date = date.replace(/T/, "; ")
  con.innerHTML = date
  if(con.innerHTML == ""){
    con.innerHTML = def
  }
}

function ShowAddMenu(){
  todoMenu.style.display = "block"
  openBtn.style.display = "none"
}

function CloseAddMenu(){
  todoMenu.style.display = "none"
  openBtn.style.display = "flex"
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("../serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}else{
  alert("Service Worker isn't supported by your browser. You won't be able to use this app offline and receive push notifications.")
}