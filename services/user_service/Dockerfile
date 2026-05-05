FROM python:3.12-slim
WORKDIR /app
COPY services/user_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY services/common /app/common
RUN pip install /app/common
COPY services/user_service /app
EXPOSE 8001
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8001}