FROM node:16

RUN apt-get update || : && apt-get install python -y

WORKDIR /app

ADD . /app

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]
