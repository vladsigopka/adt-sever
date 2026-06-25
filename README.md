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
│   ├── components/ password-toggle, mobile-menu, faq, field-label, field-clear, field-validate, form-redirect, code-input, resend-timer, smooth-scroll, custom-scrollbar, reveal
│   ├── vendor/     lenis.min.js (UMD-сборка плавного скролла)
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
| `akciya-detail.html` | Детальная акция — hero `.promo-detail` + статья `.article` (полный набор типографики); колонка `container--content`, текст в читаемой колонке 820px |
| `documents.html` | Документы — сетка карточек `.doc-card` (ведут на `document.html`) |
| `document.html` | Документ (Политика) — двухколоночный `.doc-text` (заголовок слева, текст justify справа) |
| `faq.html` | Ответы на вопросы — аккордеон `.faq` (анимация раскрытия + иконка плюс↔минус) |
| `login.html` | Авторизация — отдельный layout без общих header/footer |
| `register.html` | Регистрация — layout `.auth`, поля + чекбокс согласия `.checkbox` |
| `verify.html` | Подтверждение почты — 6-значный код `.code` (авто-переход, paste, backspace) |
| `contacts.html` | Контакты — карточки `.contacts` (адрес/режим, маркетплейсы, соцсети) + карта (Яндекс-iframe); ховер соцсетей: чёрный фон + белая иконка |
| `recover.html` | Восстановление пароля, шаг 1 — ввод E-mail |
| `recover-code.html` | Восстановление, шаг 2 — код `.code` (авто-сабмит при заполнении) + кнопка-таймер «отправить ещё раз» |
| `recover-password.html` | Восстановление, шаг 3 — новый пароль ×2 (проверка совпадения) |

### Типографика статьи (`.article`)
Блок `.article` — стилизованный rich-text (как из CMS), колонка 820px по центру. Поддерживает: лид `p.article__lead`, заголовки `h2/h3/h4`, абзацы, списки `ul`/`ol`, цитату `blockquote` + `cite`, врезку `.article__note`, таблицу `table` (в обёртке `.article__table` — горизонтальный скролл на мобилке), изображение `figure` + `figcaption`, сноски (маркер `sup.article__ref` со ссылкой на `.article__footnotes`), разделитель `hr`, инлайн `a`/`strong`/`em`. Текст — `rgba($color-black, .7)` (чтобы ссылки не приглушались, грабли #3).

## Плавный скролл (Lenis)

Инерционный скролл всего сайта — библиотека **Lenis**, завендорена локально (`src/js/vendor/lenis.min.js`, UMD → глобальный `Lenis`), склеивается в `main.js`. Инициализация — `js/components/smooth-scroll.js`.

- CSS Lenis — `scss/base/_lenis.scss` (служебные классы `.lenis-smooth`, `.lenis-stopped` и т.п.).
- Отключается при `prefers-reduced-motion: reduce` (доступность).
- Якорные ссылки `a[href^="#"]` перехватываются и скроллятся через `lenis.scrollTo`.
- При открытии бургер-меню скролл фона ставится на паузу: `window.lenis.stop()` / `.start()` (см. `mobile-menu.js`).
- Тач-скролл не трогаем (нативный) — `syncTouch` по умолчанию выключен.
- Если на странице появится контейнер со своим скроллом (модалка, таблица) — повесить на него `data-lenis-prevent`.
- **Битрикс:** Lenis чисто клиентский, не зависит от сборки и бэкенда — после натягивания работает как есть (файл лежит локально в `dist/js/main.js`).

### Кастомный скроллбар
Тонкий кастомный скроллбар справа — `js/components/custom-scrollbar.js` + `scss/blocks/_custom-scroll.scss`. Рисует положение скролла (работает в паре с Lenis: Lenis скроллит, бар рисует). Появляется при скролле/наведении на правую кромку, прячется через 0.5с. Перетаскивание thumb двигает страницу через `lenis.scrollTo(..., { immediate: true })`.
- Нативный скроллбар скрыт классом `html.custom-scroll-ready` (его вешает JS).
- Только для мыши: при `pointer: coarse` (тач) не инициализируется и нативный остаётся.
- Прячется при открытом бургер-меню.

## Анимации появления (reveal)

Плавное появление при скролле — атрибут `data-reveal` на элементе (`js/components/reveal.js` + `scss/base/_reveal.scss`). Элемент стартует прозрачным со сдвигом вниз, при попадании в вьюпорт (IntersectionObserver) получает класс `.is-revealed`. Опционально стаггер — `data-reveal-delay="120"` (мс).
- Скрытое состояние — только под `html.js-ready`: если JS не сработал, контент виден.
- Отключается при `prefers-reduced-motion` (и в CSS, и в JS).
- Применено на странице акций (`akcii.html`): заголовок + карточки `.promo-card`.
- Ховер карточек (десктоп): зум картинки `scale(1.05)` + мягкая тень (`_promo-card.scss`).

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

## Авторизация — особенности (login.html / register.html / verify.html)

- Общий layout `.auth`: фото на весь экран (`.auth__media`, `position: absolute; inset: 0`), белая панель-карточка поверх слева (`.auth__panel`, `z-index: 1`, плавающая: `margin: 24px`, `border-radius`).
- На фото наложен градиент (`.auth__media::after`): `linear-gradient(270deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.7) 47.12%, #0a0a0a 100%)`.
- `object-position: 70% center` — чтобы машина не заходила под панель.
- `.auth` имеет `display: flow-root` — чтобы margin панели не «протекал» наружу.
- Мобилка (<1024): bottom-sheet — фото-герой сверху (`order: -1`, `34vh`), белый «лист» поднимается над ним со скруглением.

### Поток и логика (базовые редиректы)
- Регистрация: `login` → `register` → `verify` → `index`. Свитч-ссылки ведут назад (`register` → `login`, `verify` → `register`).
- Восстановление пароля: `login` (ссылка «Восстановить пароль») → `recover` → `recover-code` → `recover-password` → `login`. Свитч на всех — «Вспомнили пароль? / Войти в аккаунт».
- `recover-code`: код с `data-autosubmit` — при вводе 6-й цифры форма submit'ится автоматически (без кнопки подтверждения). Кнопка «отправить ещё раз» — `js-resend` + `data-resend-seconds`/`data-resend-label` (`resend-timer.js`): обратный отсчёт, по нулю становится активной, клик перезапускает таймер.
- Редирект формы — атрибутом `data-redirect="<page>"` на `<form>`; `js/components/form-redirect.js` перехватывает submit, прогоняет валидацию и переходит по адресу. Без бэкенда (заглушка под Битрикс).
- Валидация поля — `data-validate` на `.field`: `email` (формат) или `match` + `data-match="#id"` (совпадение, для повтора пароля). Ошибка показывается по `blur`, снимается при исправлении (`field-validate.js`).
- Код подтверждения `.code` (6 ячеек, `[data-code]`): авто-переход, Backspace на пустой → назад, стрелки, paste распределяет цифры (`code-input.js`). Заполненная ячейка — класс `is-filled`.
- Чекбокс согласия `.checkbox`: при попытке отправить без галочки — класс `is-invalid` (красная рамка), снимается по `change`. Галочка — иконка `icon-check`.

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

## Страницы-заглушки

Чтобы ссылки навигации не вели в 404, для ещё не готовых разделов сделаны заглушки (хедер/футер + заголовок + «Раздел в разработке») через партиал `partials/stub.html` (`@@include('partials/stub.html', { "title": "..." })`, стиль `.stub`): `catalog`, `about`, `reviews`, `compare`, `favorites`, `cart`. Когда раздел верстается — содержимое `<main>` заполняется вместо `@@include` заглушки.

## TODO / что дальше

- Наполнить контентом заглушки: Каталог, О компании, Контакты, Отзывы, Сравнение, Избранное, Корзина (сейчас — `partials/stub.html`).
- По желанию: авто-сборка спрайта (`gulp-svgstore`) вместо ручного `sprite.html`; авто-генерация webp в сборке; вынос поля формы в партиал `field.html`.
