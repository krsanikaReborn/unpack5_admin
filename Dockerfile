FROM --platform=linux/amd64 nginx:latest

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY . /admin

EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"]