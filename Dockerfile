FROM node:12.18.4

# Install entrypoint
COPY ["./docker/bin/wait-for-it", "./docker/bin/docker-entrypoint", "/usr/local/bin/"]
RUN chmod +x /usr/local/bin/wait-for-it /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]

# Create app directory
WORKDIR /app

# Install dependencies
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --no-optional

# Bundle sources
COPY . .

ARG build_environment
# If you are building your code for production
RUN if [ "${build_environment}" = "production" ] ; then yarn run build; fi

EXPOSE 3000
