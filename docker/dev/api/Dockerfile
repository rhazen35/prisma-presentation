# Note: this dockerfile is currently focused on the development environment. I will add another
#       file later on that allows us to deploy containers using a command suitable for production.

FROM node:18-bullseye
WORKDIR /app

# ---------------------------------------------------------------------------------------------
#       NPM dependencies.
# ---------------------------------------------------------------------------------------------
#
#       1. COPY the key files that dictate what npm CI should generate.
#       2. Install dependencies based on these two files.
#
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------------------------
#       GraphQL code generation
# ---------------------------------------------------------------------------------------------
#
#       Generates the typescript code required to integrate with the
#       GraphQL schema tokens:
#
#       1. Copy key file schema.graphql (create target folder first)
#       2. Copy key file codegen.yml
#       3. Run generation process (create target folder first)
#
RUN  mkdir -p /app/src/graphql
COPY src/graphql/schema.graphql src/graphql

COPY codegen.yml .

RUN mkdir -p /app/generated
RUN npm run graphql:generate

# ---------------------------------------------------------------------------------------------
#       Add wait-for executable
# ---------------------------------------------------------------------------------------------
#
RUN apt-get -q update && apt-get -qy install netcat
COPY docker/dev/wait-for ./generated/wait-for
RUN chmod +x ./generated/wait-for

# ---------------------------------------------------------------------------------------------
#       Copy entire project
# ---------------------------------------------------------------------------------------------
#
#       Copies all the remaining project files (abides .dockerignore rules)
#
COPY . .

# ---------------------------------------------------------------------------------------------
#       Prisma database and client setup, nodemon runtime
# ---------------------------------------------------------------------------------------------
#
#       First sets up the database and then generates the necessary
#       Prisma client boilerplate code in typescript. This can only
#       be done in the CMD of the final container because these
#       processes require the postgres service to be running.
#       After these steps are performed the nodemon process is booted.
#
CMD ["npm", "run", "dev"]