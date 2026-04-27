FROM python:3.12-slim
WORKDIR /app
COPY services/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY services/__init__.py /app/services/__init__.py
COPY services/user_service /app/services/user_service
COPY services/common /app/services/common
EXPOSE 8001
CMD ["uvicorn", "services.user_service.main:app", "--host", "0.0.0.0", "--port", "8001"]
