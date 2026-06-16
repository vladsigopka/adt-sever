# АДТ Север — верстка

Статическая верстка (HTML / SCSS / vanilla JS) под последующее натягивание на **1С-Битрикс**.

## Стек

- **Gulp 5** — сборка
- **gulp-file-include** — сборка HTML из частей (`@@include`); на выходе чистый HTML
- **SCSS + БЭМ** — стили
- **Vanilla JS (ES6+)** — без jQuery; сторонние либы кладутся в `src/vendor/`
- **browser-sync** — локальный сервер с авто-перезагрузкой

## Команды

```bash
npm install      # установить зависимости (один раз)
npm run dev      # сборка + dev-сервер с live-reload на http://localhost:3000
npm run build    # продакшн-сборка в dist/
npm run clean    # очистить dist/
```

## Структура

```
src/
├── html/
│   ├── partials/      # head, header, footer — общие части (→ header.php / footer.php в Bitrix)
│   └── pages/         # страницы (компилируются в dist/*.html)
├── scss/
│   ├── base/          # переменные, миксины, reset, базовые стили
│   ├── blocks/        # БЭМ-блоки (1 блок ≈ 1 Bitrix-компонент)
│   └── main.scss      # точка сборки (@use)
├── js/
│   ├── components/    # модули (склеиваются в main.js)
│   └── main.js        # точка входа
├── img/               # изображения
├── fonts/             # шрифты
└── vendor/            # сторонние библиотеки (Swiper и т.п.) — копируются в dist/vendor как есть

dist/                  # результат сборки — его отдают на натягивание
```

## Принципы под Bitrix

- **header / footer вынесены в partials** — ровно ложатся на `header.php` / `footer.php`.
- **Повторяющиеся блоки** (карточки акций, документов) свёрстаны как одинаковая «рыба» — это будущие циклы `foreach` в компонентах.
- **Никаких inline-стилей и inline-скриптов.**
- **Чистые `name` / `id` у форм** (см. `login.html`) — под системные компоненты авторизации.
- **Пути к ассетам относительные** — легко заменить на `SITE_TEMPLATE_PATH`.

## Картинки — только через `<picture>`

Все растровые изображения подключаются через переиспользуемый партиал `partials/picture.html`
(webp + растровый фолбэк). Пример:

```html
@@include('partials/picture.html', {
  "webp": "img/promo-1.webp",
  "img":  "img/promo-1.jpg",
  "alt":  "Описание картинки",
  "class": "promo-card__image"
})
```

Параметры: `webp` — путь к webp, `img` — фолбэк (jpg/png), `alt` — альт-текст,
`class` — БЭМ-класс для `<img>`. На выходе — чистый `<picture>` без комментариев.
Для каждой картинки кладём в `src/img/` обе версии — `.webp` и фолбэк.


