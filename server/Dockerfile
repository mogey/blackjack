FROM node:15.14.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . .

EXPOSE 5000

ENV MYSQL_USER_PASSWORD=blackjack123!
ENV MYSQL_USER_ACCOUNT=root
ENV MYSQL_DATABASE=blackjack
ENV MYSQL_HOST=0.0.0.0

CMD ["npm", "start"]