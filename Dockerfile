# FROM node:20-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN chmod +x node_modules/.bin/react-scripts
# RUN npm run build

# # 2단계: Nginx 정적 파일 서비스용
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x node_modules/.bin/react-scripts
RUN npm run build

# 2단계: Nginx로 정적 파일 서비스
FROM nginx:alpine

# 🔥 custom nginx.conf 설정 복사
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# React 빌드 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
