// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskDescription = document.getElementById('taskDescription');
const prioritySelect = document.getElementById('prioritySelect');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskForm = document.getElementById('addTaskForm');
const todoList = document.getElementById('todoList');
const darkModeToggle = document.getElementById('darkModeToggle');
const searchInput = document.getElementById('searchInput');
const loadingSpinner = document.getElementById('loadingSpinner');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortByDateBtn = document.getElementById('sortByDate');
const sortByPriorityBtn = document.getElementById('sortByPriority');
const sortByCategoryBtn = document.getElementById('sortByCategory');
const selectAllBtn = document.getElementById('selectAllBtn');
const batchDeleteBtn = document.getElementById('batchDeleteBtn');
const batchCompleteBtn = document.getElementById('batchCompleteBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importInput = document.getElementById('importInput');
const notification = document.getElementById('notification');
const editModal = document.getElementById('editModal');
const editTaskText = document.getElementById('editTaskText');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const body = document.body;

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'none'; // ✅ default is none, not all
let currentSort = 'none';
let selectedTasks = new Set();
let editingTaskIndex = null;
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Initialize dark mode
if (isDarkMode) {
  body.classList.add('dark');
  darkModeToggle.textContent = '☀️ Light Mode';
} else {
  darkModeToggle.textContent = '🌙 Dark Mode';
}

// Notification
function showNotification(message, type = 'success') {
  notification.textContent = message;
  notification.className = `notification bg-${type === 'error' ? 'red' : 'green'}-500`;
  notification.classList.remove('hidden');
  setTimeout(() => notification.classList.add('hidden'), 3000);
}

// Render tasks
function renderTasks() {
  todoList.innerHTML = '';

  let filteredTasks = tasks;

  // Filtering
  // Filtering
  // Filtering
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === 'high') {
    filteredTasks = tasks.filter(t => t.priority === 'high');
  } else if (currentFilter === 'all') {
    filteredTasks = tasks;
  } else if (currentFilter === 'none') {
    filteredTasks = []; // ✅ show nothing by default
  }



  // Sorting
  if (currentSort === 'date') {
    filteredTasks = [...filteredTasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (currentSort === 'priority') {
    const order = { high: 1, medium: 2, low: 3 };
    filteredTasks = [...filteredTasks].sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (currentSort === 'category') {
    filteredTasks = [...filteredTasks].sort((a, b) => a.category.localeCompare(b.category));
  }

  filteredTasks.forEach((task, index) => {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card p-4 rounded-lg shadow-md ${task.completed ? 'task-completed' : ''} priority-${task.priority}`;
    taskCard.innerHTML = `
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg">${task.title}</h3>
        <input type="checkbox" ${selectedTasks.has(index) ? 'checked' : ''} data-index="${index}" class="select-checkbox">
      </div>
      <p>${task.description}</p>
      <p><strong>Category:</strong> ${task.category} | <strong>Priority:</strong> ${task.priority}</p>
      <p><strong>Due:</strong> ${task.dueDate ? task.dueDate : 'No date'}</p>
      <div class="flex gap-2 mt-2">
        <button class="complete-btn bg-green-500 text-white px-2 py-1 rounded" data-index="${index}">✔ Complete</button>
        <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded" data-index="${index}">✏ Edit</button>
        <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">🗑 Delete</button>
      </div>
    `;
    todoList.appendChild(taskCard);
  });
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ========== Event Listeners ==========

// Add Task
addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return showNotification('Task cannot be empty!', 'error');

  tasks.push({
    title,
    description: taskDescription.value.trim(),
    priority: prioritySelect.value,
    category: categorySelect.value,
    dueDate: dueDateInput.value,
    completed: false // ✅ always set default
  });

  saveTasks();
  renderTasks();
  addTaskForm.reset();
  showNotification('Task added!');
});

// Task actions (event delegation)
todoList.addEventListener('click', (e) => {
  const index = e.target.dataset.index;
  if (e.target.classList.contains('delete-btn')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    showNotification('Task deleted!');
  }
  if (e.target.classList.contains('complete-btn')) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
    showNotification('Task updated!');
  }
  if (e.target.classList.contains('edit-btn')) {
    editingTaskIndex = index;
    editTaskText.value = tasks[index].title;
    editModal.classList.add('show');
  }
  if (e.target.classList.contains('select-checkbox')) {
    if (e.target.checked) selectedTasks.add(Number(index));
    else selectedTasks.delete(Number(index));
    batchDeleteBtn.classList.toggle('hidden', selectedTasks.size === 0);
    batchCompleteBtn.classList.toggle('hidden', selectedTasks.size === 0);
  }
});

// Edit modal
saveEditBtn.addEventListener('click', () => {
  if (editingTaskIndex !== null) {
    tasks[editingTaskIndex].title = editTaskText.value.trim();
    saveTasks();
    renderTasks();
    editModal.classList.remove('show');
    showNotification('Task edited!');
  }
});
cancelEditBtn.addEventListener('click', () => editModal.classList.remove('show'));

// Dark Mode
darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  isDarkMode = !isDarkMode;
  localStorage.setItem('darkMode', isDarkMode);
  darkModeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('filter-active'));
    btn.classList.add('filter-active');
    renderTasks();
  });
});

// Sorting
sortByDateBtn.addEventListener('click', () => { currentSort = 'date'; renderTasks(); });
sortByPriorityBtn.addEventListener('click', () => { currentSort = 'priority'; renderTasks(); });
sortByCategoryBtn.addEventListener('click', () => { currentSort = 'category'; renderTasks(); });

// Batch actions
selectAllBtn.addEventListener('click', () => {
  selectedTasks = new Set(tasks.map((_, i) => i));
  renderTasks();
  batchDeleteBtn.classList.remove('hidden');
  batchCompleteBtn.classList.remove('hidden');
});
batchDeleteBtn.addEventListener('click', () => {
  tasks = tasks.filter((_, i) => !selectedTasks.has(i));
  selectedTasks.clear();
  saveTasks();
  renderTasks();
  batchDeleteBtn.classList.add('hidden');
  batchCompleteBtn.classList.add('hidden');
  showNotification('Selected tasks deleted!');
});
batchCompleteBtn.addEventListener('click', () => {
  tasks.forEach((t, i) => { if (selectedTasks.has(i)) t.completed = true; });
  selectedTasks.clear();
  saveTasks();
  renderTasks();
  batchDeleteBtn.classList.add('hidden');
  batchCompleteBtn.classList.add('hidden');
  showNotification('Selected tasks marked complete!');
});

// Export JSON
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(tasks)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tasks.json';
  a.click();
});

// Import JSON
importBtn.addEventListener('click', () => importInput.click());
importInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    tasks = JSON.parse(event.target.result);
    saveTasks();
    renderTasks();
    showNotification('Tasks imported!');
  };
  reader.readAsText(file);
});

// Search
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  document.querySelectorAll('.task-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(term) ? '' : 'none';
  });
});

// ========== Contact Form with EmailJS ==========
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    showNotification("Sending message...", "success");

    emailjs.sendForm(
      "service_dvamb17",   // ← Replace with your Service ID
      "template_2nh1rdp",  // ← Replace with your Template ID
      contactForm,
      "H64a24jIy1rV5z618"  // ← Replace with your Public Key
    )
    .then(
      () => {
        showNotification("Message sent successfully!", "success");
        contactForm.reset();
      },
      (error) => {
        console.error("EmailJS error:", error);
        showNotification("Failed to send message. Try again!", "error");
      }
    );
  });
}

// Initial render
renderTasks();

// Ensure no filter button is selected at first load
filterBtns.forEach(b => b.classList.remove('filter-active'));

