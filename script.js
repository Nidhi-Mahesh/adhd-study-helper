// Pomodoro
let timer = 25 * 60;
let timerInterval;

function updateTimer() {
  const mins = String(Math.floor(timer / 60)).padStart(2, '0');
  const secs = String(timer % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${mins}:${secs}`;
}

document.getElementById('start').onclick = () => {
  if (timerInterval) clearInterval(timerInterval);
  timer = 25 * 60;
  timerInterval = setInterval(() => {
    if (timer > 0) {
      timer--;
      updateTimer();
      growTree();
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

function growTree() {
  const tree = document.getElementById('tree-growth');
  tree.textContent += '🌱'; // Simple growth animation
}

// Sticky note
const sticky = document.getElementById('sticky-note');
sticky.value = localStorage.getItem('sticky') || '';
sticky.addEventListener('input', () => {
  localStorage.setItem('sticky', sticky.value);
});

// Distraction note
const distractBox = document.getElementById('distract-note');
const toggleBtn = document.getElementById('toggle-distract');
toggleBtn.onclick = () => {
  distractBox.style.display = distractBox.style.display === 'block' ? 'none' : 'block';
};
distractBox.value = localStorage.getItem('distract') || '';
distractBox.addEventListener('input', () => {
  localStorage.setItem('distract', distractBox.value);
});

// To-do list
const todoInput = document.getElementById('todo-input');
const todos = JSON.parse(localStorage.getItem('todos') || '[]');
const todoList = document.getElementById('todos');

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((t, i) => {
    const li = document.createElement('li');
    li.textContent = t;
    li.onclick = () => {
      todos.splice(i, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      renderTodos();
    };
    todoList.appendChild(li);
  });
}

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    todos.push(todoInput.value);
    todoInput.value = '';
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
  }
});
renderTodos();

// Drawing board
const canvas = document.getElementById('draw-note');
const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#fff';
ctx.lineWidth = 2;
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
});

// Voice note
const recordBtn = document.getElementById('record');
const audioPlayer = document.getElementById('audio-player');
let mediaRecorder, audioChunks = [];

recordBtn.onclick = async () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks);
      audioPlayer.src = URL.createObjectURL(blob);
      audioChunks = [];
    };
    mediaRecorder.start();
    recordBtn.textContent = '🔴 Stop';
  } else {
    mediaRecorder.stop();
    recordBtn.textContent = '🎙 Record';
  }
};

// Save notes
fetch('http://localhost:3000/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sticky: sticky.value,
      distraction: distractBox.value,
      voiceNoteUrl: audioPlayer.src // or empty
    })
  });
  
  // Fetch todos
  fetch('http://localhost:3000/api/todos')
    .then(res => res.json())
    .then(data => {
      console.log("Todos from DB", data);
    });
  
  // Add todo
  fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Study JS' })
  });
  
  async function saveNote() {
    await fetch('http://localhost:3000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sticky: document.getElementById('stickyNote').value,
        distraction: document.getElementById('distractBox').value,
        voiceNoteUrl: localStorage.getItem('voiceNoteUrl') || ""
      })
    });
  }

  document.getElementById('stickyNote').addEventListener('input', saveNote);
document.getElementById('distractBox').addEventListener('input', saveNote);
