FROM node:alpine

WORKDIR /app
COPY ./package.json ./package.json
COPY . .
RUN npm install
EXPOSE {{ Port }}

CMD ["npm", "run", "{{ StartCommand }}"]
