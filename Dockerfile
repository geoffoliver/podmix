FROM node:16

WORKDIR /app

ADD . /app

ADD run-dev.sh /app

RUN chmod +x /app/run-dev.sh

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

EXPOSE 3000

CMD /wait && /app/run-dev.sh
