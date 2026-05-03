FROM python:3.12-slim
WORKDIR /app
COPY services/api_gateway/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY services/common /app/common
RUN pip install /app/common
COPY services/api_gateway /app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]