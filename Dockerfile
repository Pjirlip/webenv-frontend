FROM  node:16-alpine as build
LABEL maintainer="Philipp Dippel <dev@pjirlip.eu>"
LABEL org.opencontainers.image.source=https://github.com/pjirlip/webnv-frontend
ENV NODE_ENV production

ARG ARG_REACT_APP_API_URL=https://api.webnv.pjirlip.eu/api
ARG ARG_REACT_APP_API_BASE=https://api.webnv.pjirlip.eu

ENV REACT_APP_API_URL=${ARG_REACT_APP_API_URL}
ENV REACT_APP_API_BASE=${ARG_REACT_APP_API_URL}

WORKDIR /app
COPY --chown=node:node package*.json /app/

RUN npm ci

COPY --chown=node:node package*.json . ./

RUN npm run build

FROM nginx:alpine

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html/

EXPOSE 80