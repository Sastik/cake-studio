FROM python:3.12-slim
WORKDIR /app
COPY services/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY services/__init__.py /app/services/__init__.py
COPY services/product_service /app/services/product_service
COPY services/common /app/services/common
EXPOSE 8002
CMD ["uvicorn", "services.product_service.main:app", "--host", "0.0.0.0", "--port", "8002"]
