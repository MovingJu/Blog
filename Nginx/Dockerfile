FROM nginx:latest

COPY ./movingju.conf /etc/nginx/conf.d/movingju.conf
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]