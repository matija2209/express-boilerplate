# pull official base image
FROM node:19
# set work directory
WORKDIR /usr/src/app/
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8443

CMD ["node","build/index.js"]
cd