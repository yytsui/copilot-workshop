// 待辦清單應用程式(純原生 JavaScript,無任何框架)
(function () {
  "use strict";

  const STORAGE_KEY = "todo-list-items";

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const emptyHint = document.getElementById("empty-hint");
  const counter = document.getElementById("counter");

  // 待辦事項陣列,每一筆為 { id, text, completed }
  let todos = loadTodos();

  // 從 localStorage 讀取資料,若無資料或格式錯誤則回傳空陣列
  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  // 將目前的待辦事項陣列存回 localStorage
  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  // 依目前的 todos 重新渲染整個列表畫面
  function render() {
    list.innerHTML = "";

    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "刪除";
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });

    // 清單為空時顯示提示文字,否則隱藏
    emptyHint.style.display = todos.length === 0 ? "block" : "none";

    const uncompletedCount = todos.filter((todo) => !todo.completed).length;
    counter.textContent = `未完成:${uncompletedCount} 項`;
  }

  // 新增一筆待辦事項
  function addTodo(text) {
    todos.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      text,
      completed: false,
    });
    saveTodos();
    render();
  }

  // 切換指定待辦事項的完成狀態
  function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
      render();
    }
  }

  // 刪除指定待辦事項
  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
    render();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    // 空白內容不新增
    if (!text) {
      return;
    }
    addTodo(text);
    input.value = "";
    input.focus();
  });

  render();
})();
