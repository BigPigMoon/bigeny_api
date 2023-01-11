FROM node:19 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/


RUN yarn install

COPY . .

RUN yarn build

FROM node:19

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=build /app/firebase.spec.json ./

EXPOSE 3000
CMD [ "yarn", "start:prisma:dev"]
