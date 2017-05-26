FROM node:6.10-slim

RUN mkdir /dist
ADD ./dist /dist

COPY ./start.sh /
COPY ./resetdb.sh /
COPY ./server.js /
COPY ./package.json /
COPY ./db.json.example /
COPY ./yarn.lock /

RUN chmod 755 /start.sh
RUN chmod 755 /resetdb.sh

RUN yarn install --production
RUN bash ./resetdb.sh

EXPOSE 80
EXPOSE 3001

CMD bash start.sh
