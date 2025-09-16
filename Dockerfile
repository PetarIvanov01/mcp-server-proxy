FROM node:20-slim
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY proxy.js ./
COPY telerik-license.txt ./

EXPOSE 8080
ENV PORT=8080

CMD ["node", "proxy.js"]


