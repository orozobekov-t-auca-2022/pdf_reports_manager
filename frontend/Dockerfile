# Используем Node.js версии 20+ для поддержки crypto.hash
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Открываем порт 5173 (Vite dev server)
EXPOSE 5173

# Запускаем приложение в development режиме
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
