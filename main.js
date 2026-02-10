const pet = document.getElementById("pet");
const container = document.getElementById("pet-container");
const bubble = document.getElementById("bubble");
const counterEl = document.getElementById("counter");

const characterSelect = document.getElementById("characterSelect");
const dragBtn = document.getElementById("dragBtn");
const scaleSelect = document.getElementById("scaleSelect");

let dragMode = false;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const characters = {
  aruvelut: {
    name: "aruvelut",
    clickCount: 0,
    canGugu: true
  },
  pxh: {
    name: "pxh",
    clickCount: 0,
    canGugu: false
  }
};

let currentChar = characters.aruvelut;

// ===== 图片工具 =====
function img(state) {
  return `assets/${currentChar.name}/${state}.jpg`;
}
function randomOpen() {
  return Math.random() < 0.5 ? "open1" : "open2";
}
// ===== 切换角色 =====
function switchCharacter(key) {
  currentChar = characters[key];
  pet.src = img("open1");
  updateCounter();
}

function updateCounter() {
  counterEl.textContent = `Clicks: ${currentChar.clickCount}`;
}

// ===== 自动眨眼 =====
function autoBlink() {
  setTimeout(() => {
    pet.src = img("close2");
    setTimeout(() => {
      pet.src = img(randomOpen());
      autoBlink();
    }, 150);
  }, 3000 + Math.random() * 3000);
}

// ===== 点击角色 =====
pet.addEventListener("click", () => {
  if (dragMode) return;

  currentChar.clickCount++;
  updateCounter();

  const closeState = Math.random() < 0.5 ? "close1" : "close2";
  pet.src = img(closeState);

  setTimeout(() => {
    pet.src = img(randomOpen());
  }, 200);

  if (currentChar.canGugu && Math.random() < 0.4) {
    bubble.style.display = "block";
    setTimeout(() => bubble.style.display = "none", 800);
  }
});


// ===== 拖拽模式 =====
dragBtn.onclick = () => {
  dragMode = !dragMode;
  dragBtn.textContent = `Drag: ${dragMode ? "ON" : "OFF"}`;
};

container.addEventListener("mousedown", e => {
  if (!dragMode) return;
  isDragging = true;
  offsetX = e.clientX - container.offsetLeft;
  offsetY = e.clientY - container.offsetTop;
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;
  container.style.left = e.clientX - offsetX + "px";
  container.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// ===== 缩放 =====
scaleSelect.onchange = () => {
  pet.style.transform = `scale(${scaleSelect.value})`;
};

// ===== 初始化 =====
switchCharacter("aruvelut");
autoBlink();

characterSelect.onchange = e => switchCharacter(e.target.value);
