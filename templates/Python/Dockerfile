FROM python:3.10

WORKDIR /app

COPY . .

{% for package in Dockerfile.InstallCommands %}
RUN pip install {{ package }}
{% endfor %}
ENV PYTHONUNBUFFERED=1

EXPOSE {{ Port }}

CMD ["python", "{{ Filename }}"]