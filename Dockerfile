FROM nginx:stable

COPY ./index.html /usr/share/nginx/html/index.html
COPY ./public/js/app.js /usr/share/nginx/html/public/js/app.js

EXPOSE 80
