const pet = document.getElementById("pet");
const container = document.getElementById("pet-container");
const bubble = document.getElementById("bubble");
const counterEl = document.getElementById("counter");
const dragBtn = document.getElementById("dragBtn");
const scaleSelect = document.getElementById("scaleSelect");
const characterSelect = document.getElementById("characterSelect");

let dragMode = false;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// ===== 角色定义 =====
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

// ===== counter =====
function updateCounter() {
  counterEl.textContent = `Clicks: ${currentChar.clickCount}`;
}

// ===== 图片工具 =====
function img(state) {
  return `assets/${currentChar.name}/${state}.jpg`;
}
function randomOpen() {
  return Math.random() < 0.5 ? "open1" : "open2";
}

// ===== 全局数据（每个角色独立）=====
const SAVE_KEY = "petGameSave";

let gameData = {
  character: "aruvelut",
  characters: {
    aruvelut: { clickCount: 0 },
    pxh: { clickCount: 0 }
  }
};

// ===== 切换角色 =====
function switchCharacter(key) {
  currentChar = characters[key];

  currentChar.clickCount =
    gameData.characters[key]?.clickCount || 0;

  gameData.character = key;

  //  同步下拉框 UI
  if (characterSelect.value !== key) {
    characterSelect.value = key;
  }

  pet.src = img("open1");
  updateCounter();
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

  // 只存当前角色
  gameData.characters[currentChar.name].clickCount =
    currentChar.clickCount;

  updateCounter();

  const closeState = Math.random() < 0.5 ? "close1" : "close2";
  pet.src = img(closeState);

  setTimeout(() => {
    pet.src = img(randomOpen());
  }, 200);

  if (currentChar.canGugu && Math.random() < 0.4) {
    bubble.style.display = "block";
    setTimeout(() => (bubble.style.display = "none"), 800);
  }
});

// ===== 拖拽模式 =====
dragBtn.onclick = () => {
  dragMode = !dragMode;
  dragBtn.textContent = `Drag: ${dragMode ? "ON" : "OFF"}`;
};

container.addEventListener("pointerdown", e => {
  if (!dragMode) return;
  isDragging = true;
  offsetX = e.clientX - container.offsetLeft;
  offsetY = e.clientY - container.offsetTop;
});

document.addEventListener("pointermove", e => {
  if (!isDragging) return;
  container.style.left = e.clientX - offsetX + "px";
  container.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("pointerup", () => {
  isDragging = false;
});

// ===== 缩放 =====
scaleSelect.onchange = () => {
  pet.style.transform = `scale(${scaleSelect.value})`;
};

// ===== 存档 =====
function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    gameData = JSON.parse(saved);
  }

  // 防止旧存档炸
  if (!gameData.characters) {
    gameData.characters = {
      aruvelut: { clickCount: 0 },
      pxh: { clickCount: 0 }
    };
  }
}

function resetGame() {
  const ok = confirm("确定要重置所有存档吗？");
  if (!ok) return;
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

// ===== UI 绑定 =====
characterSelect.onchange = () => {
  switchCharacter(characterSelect.value);
};

// ===== 初始化 =====
loadGame();
switchCharacter(gameData.character || "aruvelut");
autoBlink();

// ===== 自动保存 =====
setInterval(saveGame, 10000);


// ===== 公告功能 =====
const noticeBtn = document.getElementById("noticeBtn");
const noticePanel = document.getElementById("noticePanel");
const closeNotice = document.getElementById("closeNotice");

// 打开公告
noticeBtn.onclick = () => {
  noticePanel.classList.remove("hidden");
};

// 关闭公告（×）
closeNotice.onclick = (e) => {
  e.stopPropagation(); // 防止事件冒泡冲突
  noticePanel.classList.add("hidden");
};

// 点击背景关闭（只点外层才关闭）
noticePanel.addEventListener("click", (e) => {
  if (e.target === noticePanel) {
    noticePanel.classList.add("hidden");
  }
});
