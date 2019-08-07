# base image
FROM node:lts

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY yarn.lock /app/yarn.lock
COPY quasar.conf.js /app/quasar.conf.js
COPY quasar.extensions.json /app/quasar.extensions.json
COPY tsconfig.json /app/tsconfig.json
COPY tslint.json /app/tslint.json

#RUN npm install -g typescript typings
#RUN typings install dt~node --global

RUN npm install
#COPY . .
# start app
#EXPOSE 8080
CMD ["npm", "run", "dev"]
