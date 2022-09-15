FROM timothyjmiller/prisma-studio:latest

RUN apt-get -q update && apt-get -qy install netcat
COPY docker/dev/wait-for ./generated/wait-for
RUN chmod +x ./generated/wait-for

ENTRYPOINT ["./generated/wait-for", "api:4000", "--", "/bin/sh", "prisma-introspect.sh"]