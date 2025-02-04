FROM python:3.11

RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    gcc \
    g++

WORKDIR /app

COPY requirements.txt ./

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080
CMD ["python", "app.py"]
