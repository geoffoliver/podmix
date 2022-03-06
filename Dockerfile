FROM node:16

# RUN apt-get update || : && apt-get install python -y

WORKDIR /app

ADD . /app

RUN yarn install

RUN yarn migrate up

EXPOSE 3000

CMD ["yarn", "dev"]
