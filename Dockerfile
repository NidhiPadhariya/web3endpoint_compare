FROM node:16.16.0

COPY . /home/we3endpoint-compare

CMD ["node","/home/we3endpoint-compare/index.js"]