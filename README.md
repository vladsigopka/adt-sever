# АДТ Север — верстка

Статическая верстка (HTML / SCSS / vanilla JS) под последующее натягивание на **1С-Битрикс**.

## Стек

- **Gulp 5** — сборка (`gulpfile.mjs`, ESM)
- **gulp-file-include** — сборка HTML из частей (`@@include`); на выходе чистый HTML
- **SCSS + БЭМ** — стили (dart-sass, `@use`)
- **Vanilla JS (ES6+)** — без jQuery; модули из `js/components/*` склеиваются в `main.js`
- **browser-sync** — локальный сервер с авто-перезагрузкой

## Команды

```bash
npm install      # один раз
npm run dev      # сборка + dev-сервер (http://localhost:3000), watch + live-reload
npm run build    # прод-сборка в dist/
npm run clean    # очистить dist/
```

Отдаётся на натягивание папка **`dist/`** (чистый HTML/CSS/JS, без следов Gulp).

## Структура

```
src/
├── html/
│   ├── partials/   head, header (+ бургер и мобильное меню), footer, sprite, picture, faq-item
│   └── pages/      index, akcii, akciya-detail, documents, document, faq, login
├── scss/
│   ├── base/       variables, functions, mixins, fonts, reset, base
│   ├── blocks/     БЭМ-блоки (1 файл = 1 блок)
│   └── main.scss   точка сборки (@use)
├── js/
│   ├── components/ password-toggle, mobile-menu, faq, field-label
│   └── main.js
├── icons/          исходники SVG-иконок (currentColor) — основа спрайта
├── img/            картинки (akcii-image, login-bg — по .png + .webp)
└── fonts/          RF Dewi Expanded (Regular/Semibold/Bold, woff2+woff)
```

## Готовые страницы

| Файл | Описание |
|---|---|
| `index.html` | Главная — временный список ссылок на все готовые страницы (`.startlinks`) |
| `akcii.html` | Акции — список карточек `.promo-card` (картинка/текст, чётные — `--reverse`) |
| `akciya-detail.html` | Детальная акция — hero `.promo-detail` + проза `.article`; колонка `container--content` |
| `documents.html` | Документы — сетка карточек `.doc-card` (ведут на `document.html`) |
| `document.html` | Документ (Политика) — двухколоночный `.doc-text` (заголовок слева, текст justify справа) |
| `faq.html` | Ответы на вопросы — аккордеон `.faq` (анимация раскрытия + иконка плюс↔минус) |
| `login.html` | Авторизация — отдельный layout без общих header/footer |

## Ключевые соглашения (ВАЖНО)

### 1. Без комментариев в коде
В исходниках (HTML/SCSS/JS, gulpfile) комментариев нет. Документация — только здесь, в README.

### 2. Цвет текста через opacity
Иерархия текста = **чёрный + прозрачность**, не серые цвета:
- основной текст — `opacity: 1`; описание — `opacity: 0.8`; дата/мета — `opacity: 0.5`.
- Если в строке смешаны приглушённый текст и яркие ссылки/акценты — `opacity` на родителе **обрежет детей**. В таких случаях: `color: rgba($color-black, .5)` на тексте + полный цвет на ссылке (см. `auth__agreement`, `auth__switch`).

### 3. Резиновость — модель «резиновый корень»
- На `html` стоит `clamp()` на `font-size` (14px→16px между 1024 и 1920px) — см. `base/_base.scss`.
- Поэтому **всё в `rem()`** автоматически масштабируется. Функция `rem($px)` — в `base/_functions.scss`.
- Функции `fluid()` **нет** (удалена) — не использовать, иначе двойное масштабирование.
- В `px` оставляем только то, что НЕ должно тянуться: рамочный гуттер 24px, `1px`-бордеры.

### 4. Один брейкпоинт: десктоп ≥ 1024, мобилка < 1024
- Переменная `$bp-mobile: 1024px`, миксин `@include upto($bp-mobile) { ... }` (он вычитает 0.2px, чтобы 1024 относился к десктопу).

### 5. Рамка страницы (гуттер)
- `body` (кроме `.body--auth`): `padding-inline: 24px` + `padding-bottom: 24px` (футер инсетный — отступ 24px по бокам и снизу).
- Узкие колонки: `.container--narrow` (1040px), `.container--content` (для детальных/контентных страниц).

### 6. Иконки — инлайн-спрайт
- Все иконки в `partials/sprite.html` как `<symbol id="...">` с `currentColor`.
- Использование: `<svg><use href="#icon-name"></use></svg>`. Цвет — из CSS (`color`).
- Исходники — в `src/icons/`. Спрайт подключается один раз после `<body>` на каждой странице.
- Есть: `logo`, `icon-comparison`, `icon-heart`, `icon-bag`, `icon-user`, `icon-minus`, `icon-document`, `icon-chevron`, `icon-eye`.

### 7. Картинки — только через `<picture>`
Партиал `partials/picture.html` (webp + растровый фолбэк). Пример:
```html
@@include('partials/picture.html', { "webp": "img/x.webp", "img": "img/x.png", "alt": "...", "class": "block__image" })
```
Для каждой картинки в `src/img/` — обе версии (`.webp` и фолбэк).

### 8. Шрифт
**RF Dewi Expanded** (широкое начертание), вес 400/600/700. `@font-face` — в `base/_fonts.scss`, `$font-base` — в переменных. Веса 500 в шрифте нет → для акцента ставить 600.

### 9. Кнопки
`.btn` — базовая высота 54px (через `height`), размеры `--sm`/`--lg`, цвета `--primary`/`--outline`, ширина `--block`. Анимация: hover — лёгкий подъём + мягкая тень; active — «вдавливание».

### 10. Поля формы (важный паттерн)
Кастомный плейсхолдер (нативный не может быть двухцветным — серый текст + чёрная «*»):
```html
<input class="field__input" placeholder=" " aria-label="Введите логин" required />
<span class="field__label">Введите логин<span class="field__star">*</span></span>
```
- `placeholder=" "` (пробел) + `aria-label` (доступность).
- Скрытие лейбла при вводе — через JS-класс `.field--filled` (`field-label.js` слушает `input/change/load`). **Не использовать `:placeholder-shown`** (см. грабли).
- Автозаполнение: лейбл скрывается по `:-webkit-autofill`, голубой фон убран box-shadow-хаком.

## Авторизация — особенности (login.html)

- Отдельный layout: фото на весь экран (`.auth__media`, `position: absolute; inset: 0`), белая панель-карточка поверх слева (`.auth__panel`, `z-index: 1`, плавающая: `margin: 24px`, `border-radius`).
- На фото наложен градиент (`.auth__media::after`): `linear-gradient(270deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.7) 47.12%, #0a0a0a 100%)`.
- `object-position: 70% center` — чтобы машина не заходила под панель.
- `.auth` имеет `display: flow-root` — чтобы margin панели не «протекал» наружу.
- Мобилка (<1024): bottom-sheet — фото-герой сверху (`order: -1`, `34vh`), белый «лист» поднимается над ним со скруглением.

## Грабли (на которые уже наступали)

1. **Не писать литерал `@@include(...)` в HTML-комментариях** — gulp-file-include принимает за директиву.
2. **Автопрефиксер ломает `:placeholder-shown`** — добавляет `:not(:-moz-placeholder)` в ту же группу, Chrome её не знает → всё правило мёртвое. Поэтому скрытие лейбла поля — через JS-класс, а не `:placeholder-shown`.
3. **`opacity` на родителе обрезает детей** — для смешанного текста со ссылками использовать `rgba()` на цвете.
4. Предупреждение `legacy-js-api` от gulp-sass при сборке — безобидное.

## Деплой (Vercel)

- `vercel.json` уже настроен: `buildCommand: npm run build`, `outputDirectory: dist`.
- Репозиторий git инициализирован. Путь А: создать репо на GitHub → `git remote add origin ...` → `git push -u origin main` → импорт на [vercel.com/new](https://vercel.com/new). Framework — Other (сборка/папка подхватятся из `vercel.json`).
- Путь Б (без GitHub): `npm i -g vercel` → `vercel` → `vercel --prod`.

## Превью для разработки

`.claude/launch.json` содержит конфиги `dev` (npm run dev, порт 3000) и `preview` (лёгкий статический сервер на свободном порту для скриншотов).

## TODO / что дальше

- Страницы: Каталог, О компании, Контакты, Отзывы (есть в навигации, ещё не свёрстаны).
- По желанию: авто-сборка спрайта (`gulp-svgstore`) вместо ручного `sprite.html`; авто-генерация webp в сборке; вынос поля формы в партиал `field.html`.
