FROM node:20.12.0

WORKDIR /var/www/html

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "dev"]