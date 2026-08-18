const pet = document.getElementById("pet");
const container = document.getElementById("pet-container");
const bubble = document.getElementById("bubble");
const counterEl = document.getElementById("counter");
const dragBtn = document.getElementById("dragBtn");
const scaleSelect = document.getElementById("scaleSelect");
const characterSelect = document.getElementById("characterSelect");

// ===== 公告 =====
const noticeBtn = document.getElementById("noticeBtn");
const noticePanel = document.getElementById("noticePanel");
const closeNotice = document.getElementById("closeNotice");

// ===== 设置 =====
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

// ===== 背包 =====
const bagBtn = document.getElementById("bagBtn");
const bagPanel = document.getElementById("bagPanel");

// ===== 宝箱 =====
const chestBtn = document.getElementById("chestBtn");
const chestPanel = document.getElementById("chestPanel");

// ===== 背景颜色 =====
const bgColorPicker = document.getElementById("bgColorPicker");

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

// ===== 存档 KEY =====
const SAVE_KEY = "petGameSave";

// ===== 游戏数据 =====
let gameData = {

  character: "aruvelut",

  characters: {

    aruvelut: {
      clickCount: 0
    },

    pxh: {
      clickCount: 0
    }
  }
};

// ===== 更新点击数 =====
function updateCounter() {

  counterEl.textContent =
    `Clicks: ${currentChar.clickCount}`;
}

// ===== 图片路径 =====
function img(state) {

  return `assets/${currentChar.name}/${state}.jpg`;
}

// ===== 随机睁眼 =====
function randomOpen() {

  return Math.random() < 0.5
    ? "open1"
    : "open2";
}

// ===== 切换角色 =====
function switchCharacter(key) {

  currentChar = characters[key];

  currentChar.clickCount =
    gameData.characters[key]?.clickCount || 0;

  gameData.character = key;

  // 同步 UI
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

// ===== 点击 =====
document.addEventListener("click", (e) => {

  // 拖拽模式不计数
  if (dragMode) return;

  currentChar.clickCount++;

  // 保存当前角色点击数
  gameData.characters[currentChar.name].clickCount =
    currentChar.clickCount;

  updateCounter();

  // 点到 pet 才触发动作
  if (e.target === pet) {

    const closeState =
      Math.random() < 0.5
        ? "close1"
        : "close2";

    pet.src = img(closeState);

    setTimeout(() => {

      pet.src = img(randomOpen());

    }, 200);

    // 咕咕
    if (
      currentChar.canGugu &&
      Math.random() < 0.4
    ) {

      bubble.style.display = "block";

      setTimeout(() => {

        bubble.style.display = "none";

      }, 800);
    }
  }
});

// ===== 拖拽模式 =====
dragBtn.onclick = () => {

  dragMode = !dragMode;

  dragBtn.textContent =
    `Drag: ${dragMode ? "ON" : "OFF"}`;
};

// ===== Pointer 拖拽（支持手机）=====
container.addEventListener("pointerdown", e => {

  if (!dragMode) return;

  isDragging = true;

  offsetX =
    e.clientX - container.offsetLeft;

  offsetY =
    e.clientY - container.offsetTop;
});

document.addEventListener("pointermove", e => {

  if (!isDragging) return;

  container.style.left =
    e.clientX - offsetX + "px";

  container.style.top =
    e.clientY - offsetY + "px";
});

document.addEventListener("pointerup", () => {

  isDragging = false;
});

// ===== 缩放 =====
scaleSelect.onchange = () => {

  pet.style.transform =
    `scale(${scaleSelect.value})`;
};

// ===== 保存 =====
function saveGame() {

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify(gameData)
  );
}

// ===== 读取 =====
function loadGame() {

  const saved =
    localStorage.getItem(SAVE_KEY);

  if (saved) {

    gameData = JSON.parse(saved);
  }

  // 防止旧存档炸
  if (!gameData.characters) {

    gameData.characters = {

      aruvelut: {
        clickCount: 0
      },

      pxh: {
        clickCount: 0
      }
    };
  }
}

// ===== 重置 =====
function resetGame() {

  const ok =
    confirm("确定要重置所有存档吗？");

  if (!ok) return;

  localStorage.removeItem(SAVE_KEY);

  location.reload();
}

// ===== 角色选择 =====
characterSelect.onchange = () => {

  switchCharacter(
    characterSelect.value
  );
};

// ===== 公告 =====

// 打开
noticeBtn.onclick = () => {

  noticePanel.classList.remove("hidden");

  document.body.classList.add("panel-open");
};

// 关闭
closeNotice.onclick = (e) => {

  e.stopPropagation();

  noticePanel.classList.add("hidden");

  document.body.classList.remove("panel-open");
};

// 点击背景关闭
noticePanel.addEventListener("click", (e) => {

  if (e.target === noticePanel) {

    noticePanel.classList.add("hidden");

    document.body.classList.remove("panel-open");
  }
});

// ===== 设置 =====
settingsBtn.onclick = () => {

  settingsPanel.classList.remove("hidden");

  document.body.classList.add("panel-open");
};

// ===== 背包 =====
bagBtn.onclick = () => {

  bagPanel.classList.remove("hidden");

  document.body.classList.add("panel-open");
};

// ===== 宝箱 =====
chestBtn.onclick = () => {

  chestPanel.classList.remove("hidden");

  document.body.classList.add("panel-open");
};

// ===== 全部关闭按钮 =====
document.querySelectorAll(".closeBtn")
.forEach(btn => {

  btn.onclick = () => {

    btn.closest(".panel-overlay")
      .classList.add("hidden");

    document.body.classList.remove("panel-open");
  };
});

// ===== 点击背景关闭 =====
document.querySelectorAll(".panel-overlay")
.forEach(panel => {

  panel.addEventListener("click", e => {

    if (e.target === panel) {

      panel.classList.add("hidden");

      document.body.classList.remove("panel-open");
    }
  });
});

// ===== 背景颜色 =====

// 默认颜色
const savedBg =
  localStorage.getItem("bgColor")
  || "#ffffff";

// 页面启动读取
document.body.style.backgroundColor =
  savedBg;

// 同步 color picker
bgColorPicker.value = savedBg;

// 修改颜色
bgColorPicker.addEventListener("input", () => {

  document.body.style.backgroundColor =
    bgColorPicker.value;

  // 保存
  localStorage.setItem(
    "bgColor",
    bgColorPicker.value
  );
});

// ===== 初始化 =====
loadGame();

switchCharacter(
  gameData.character || "aruvelut"
);

autoBlink();

// ===== 自动保存 =====
setInterval(saveGame, 10000);
