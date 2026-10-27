# CinemaHub frontend

Невеликий frontend без фреймворків для демонстрації CORS-запиту до Django REST
API CinemaHub. Сторінка отримує список фільмів і жанрів, відображає назву,
жанр, рейтинг і тривалість, а також показує стан завантаження, порожній список
та помилки API. Поле пошуку виконує запит до API
http://localhost:8000/api/movies/?search= після 300 мс без введення.

## Адреси

- frontend: http://localhost:5173
- backend: http://localhost:8000
- API фільмів: http://localhost:8000/api/movies/

У бекенді дозволено CORS-origin http://localhost:5173.

## Запуск

Спочатку запустіть backend:

    cd C:CinemaHub
    ..venvScriptspython.exe manage.py runserver

В іншому PowerShell-вікні запустіть статичний frontend:

    cd C:CinemaHub-frontend
    py -3.12 -m http.server 5173

Відкрийте http://localhost:5173 у браузері.

## Структура

- index.html — розмітка сторінки;
- styles.css — адаптивні стилі;
- app.js — запити до API та відображення даних.

Проєкт не містить авторизації, бронювання або сторонніх JavaScript-фреймворків.
