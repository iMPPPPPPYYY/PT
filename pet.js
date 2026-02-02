const petImg = document.getElementById("pet-img");
const speech = document.getElementById("speech");
const counter = document.getElementById("counter");

const openImages = ["open1.jpg", "open2.jpg"];
let clickCount = 0;
let blinking = false;

function randomOpen() {
  return openImages[Math.floor(Math.random() * openImages.length)];
}

// 平时自动眨眼（只用 close2）
function autoBlink() {
  if (blinking) return;
  blinking = true;

  petImg.src = "close2.jpg";

  setTimeout(() => {
    petImg.src = randomOpen();
    blinking = false;
  }, 150);
}

// 随机间隔眨眼
function scheduleBlink() {
  const delay = 2000 + Math.random() * 4000;
  setTimeout(() => {
    autoBlink();
    scheduleBlink();
  }, delay);
}

// 点击角色
petImg.addEventListener("click", () => {
  clickCount++;
  counter.textContent = clickCount;

  // 显示对话框
  speech.style.opacity = 1;
  speech.textContent = "咕咕咕";

  // 点击时 close1 / close2 随机
  const closeImg = Math.random() < 0.5 ? "close1.jpg" : "close2.jpg";
  petImg.src = closeImg;

  setTimeout(() => {
    petImg.src = randomOpen();
  }, 150);

  setTimeout(() => {
    speech.style.opacity = 0;
  }, 1000);
});

// 启动自动眨眼
scheduleBlink();

