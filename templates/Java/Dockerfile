FROM openjdk:{{ JavaVersion }}

WORKDIR /app

COPY {{ JarAddress}} {{ JarAddress }}

EXPOSE {{ Port }}

CMD ["java", "-jar", "{{ JarAddress }}"]