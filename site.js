"use strict";

const builds = {
  windows: {
    url: "https://github.com/SoloMainDeveloper/freeze-frame-site/releases/download/v1.0.0/StopKadr-Setup-1.0.0.exe",
    label: "Скачать для Windows x64",
  },
  "mac-arm": {
    url: "https://github.com/SoloMainDeveloper/freeze-frame-site/releases/download/v1.0.0/StopKadr-1.0.0-macos-arm64.dmg",
    label: "Скачать для Apple Silicon",
  },
  "mac-intel": {
    url: "https://github.com/SoloMainDeveloper/freeze-frame-site/releases/download/v1.0.0/StopKadr-1.0.0-macos-intel.dmg",
    label: "Скачать для Intel",
  },
};

for (const [id, build] of Object.entries(builds)) {
  if (!build || !build.url.startsWith("https://")) continue;
  const slot = document.querySelector(`[data-build="${id}"]`);
  const link = document.createElement("a");
  link.className = "button button--primary";
  link.href = build.url;
  link.textContent = build.label;
  slot.replaceChildren(link);
}

const shots = [
  {
    file: "game-editor.png",
    title: "Редактор ведущего",
    caption: "Ведущий заранее загружает фотографии, выбирает фрагменты и вписывает ответы.",
    alt: "Редактор со списком фотографий, рамками фрагментов и полями ответов",
  },
  {
    file: "game-themes.png",
    title: "Темы оформления",
    caption: "Выберите оформление экрана гостей под событие. Доступны «Вечер», «Праздник», «Ретро» и «Новый год».",
    alt: "Настройки очков и четыре варианта оформления экрана гостей",
  },
  {
    file: "wedding-first.png",
    title: "Первый фрагмент",
    caption: "Ведущий показывает фрагмент фотографии, а команды пробуют угадать, что осталось за кадром.",
    alt: "На экране гостей крупный фрагмент свадебного фото и два угаданных ответа",
  },
  {
    file: "wedding-reveal.png",
    title: "Раскрытие кадра",
    caption: "Гости видят фотографию целиком, ответы и начисленные за них очки.",
    alt: "Свадебная фотография целиком и четыре угаданных ответа с очками",
  },
  {
    file: "kayak-host.jpg",
    title: "Пульт ведущего",
    caption: "С телефона ведущий управляет раундом, отмечает верные ответы и начисляет очки командам.",
    alt: "Пульт в браузере телефона с этапами раунда и ответами команд",
    portrait: true,
  },
  {
    file: "game-results.png",
    title: "Итоги игры",
    caption: "После последнего раунда гости видят тройку победителей и итоговые очки всех участников.",
    alt: "Экран итогов с пьедесталом, очками участников и конфетти",
  },
  {
    file: "game-slideshow.png",
    title: "Слайд-шоу с музыкой",
    caption: "Выберите фотографии, длительность показа и музыку. После итогов ведущий запускает слайд-шоу с пульта.",
    alt: "Настройки слайд-шоу с выбором фотографий, длительности, музыки и повтора",
  },
];

const choices = [...document.querySelectorAll("[data-shot]")];
const featureImage = document.querySelector("[data-feature-image]");
const featureTitle = document.querySelector("[data-feature-title]");
const featureCaption = document.querySelector("[data-feature-caption]");
const viewer = document.querySelector("#photo-viewer");
const viewerImage = viewer.querySelector("[data-viewer-image]");
const viewerTitle = viewer.querySelector("[data-viewer-title]");
let current = 0;

function selectShot(index) {
  current = (index + shots.length) % shots.length;
  const shot = shots[current];
  const src = "./assets/" + shot.file;
  featureImage.src = src;
  featureImage.alt = shot.alt;
  featureImage.classList.toggle("is-portrait", Boolean(shot.portrait));
  featureTitle.textContent = shot.title;
  featureCaption.textContent = shot.caption;
  viewerTitle.textContent = shot.title;
  if (viewer.open) {
    viewerImage.src = src;
    viewerImage.alt = shot.alt;
  }
  for (const choice of choices) {
    choice.setAttribute("aria-pressed", String(Number(choice.dataset.shot) === current));
  }
}

for (const choice of choices) {
  choice.addEventListener("click", () => selectShot(Number(choice.dataset.shot)));
}

for (const button of document.querySelectorAll("[data-enlarge]")) {
  button.addEventListener("click", () => {
    viewer.showModal();
    selectShot(current);
  });
}

viewer.querySelector("[data-close-viewer]").addEventListener("click", () => viewer.close());
for (const button of viewer.querySelectorAll("[data-step]")) {
  button.addEventListener("click", () => selectShot(current + Number(button.dataset.step)));
}
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});
viewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    selectShot(current + (event.key === "ArrowLeft" ? -1 : 1));
  }
});
