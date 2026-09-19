// 待辦清單應用程式(純原生 JavaScript,無任何框架)
(function () {
  "use strict";

  const STORAGE_KEY = "todo-list-items";
  const THEME_STORAGE_KEY = "todo-list-theme";

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const emptyHint = document.getElementById("empty-hint");
  const counter = document.getElementById("counter");
  const themeToggle = document.getElementById("theme-toggle");
  const filterRow = document.getElementById("filter-row");

  // 待辦事項陣列,每一筆為 { id, text, completed }
  let todos = loadTodos();
  // 目前的篩選條件:all(全部) / active(未完成) / completed(已完成)
  let currentFilter = "all";

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

  // 依使用者儲存的偏好或作業系統設定,套用深色 / 淺色主題
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️ 淺色模式";
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeToggle.textContent = "🌙 深色模式";
    }
  }

  // 初始化主題:若使用者手動設定過就沿用,否則跟隨作業系統設定
  function initTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  // 依目前的 todos 重新渲染整個列表畫面
  function render() {
    list.innerHTML = "";

    // 依目前篩選條件過濾要顯示的項目
    const filteredTodos = todos.filter((todo) => {
      if (currentFilter === "active") {
        return !todo.completed;
      }
      if (currentFilter === "completed") {
        return todo.completed;
      }
      return true;
    });

    filteredTodos.forEach((todo) => {
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

    // 依篩選結果決定提示文字,並在結果為空時顯示
    emptyHint.textContent = getEmptyHintText();
    emptyHint.style.display = filteredTodos.length === 0 ? "block" : "none";

    // 未完成數量永遠以整體 todos 計算,不受篩選影響
    const uncompletedCount = todos.filter((todo) => !todo.completed).length;
    counter.textContent = `未完成:${uncompletedCount} 項`;
  }

  // 依目前篩選條件回傳清單為空時應顯示的提示文字
  function getEmptyHintText() {
    // 若整體清單本來就沒有任何待辦事項,顯示原始的初次使用提示
    if (todos.length === 0) {
      return "還沒有任何待辦事項,新增一個吧!";
    }
    // 否則代表項目只是被目前的篩選條件隱藏,並非被刪除,需明確告知使用者
    if (currentFilter === "active") {
      return "目前沒有未完成的事項,其他項目仍在,只是被篩選條件隱藏了。";
    }
    if (currentFilter === "completed") {
      return "目前沒有已完成的事項,其他項目仍在,只是被篩選條件隱藏了。";
    }
    return "還沒有任何待辦事項,新增一個吧!";
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

  // 深色 / 淺色模式切換按鈕,點擊後手動記住使用者的選擇
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  });

  // 篩選按鈕點擊事件,切換目前篩選條件並更新按鈕樣式
  filterRow.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter-btn");
    if (!btn) {
      return;
    }
    currentFilter = btn.dataset.filter;
    filterRow
      .querySelectorAll(".filter-btn")
      .forEach((el) => el.classList.toggle("active", el === btn));
    render();
  });

  initTheme();
  render();
})();
