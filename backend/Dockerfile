# Use an official Python runtime as a parent image
FROM python:3.13-slim
ENV PYTHONUNBUFFERED=1
# Set the working directory in the container
WORKDIR /app

# Copy only the requirements.txt first, to leverage Docker cache better
COPY requirements.txt /app/

# Install dependencies
RUN pip install -r requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# install Gunicorn:
# RUN pip install gunicorn

# Copy the rest of your application code
COPY . /app/

# Expose the port the app will run on
EXPOSE 8017

# CMD ["gunicorn", "--certfile=/app/certs/localhost+2.pem", "--keyfile=/app/certs/localhost+2-key.pem", "--bind", "0.0.0.0:8013", "backend.wsgi:application"]



# Create a script to handle migrations and server startup
RUN echo '#!/bin/bash\n\
# python manage.py migrate\n\
python manage.py runserver_plus --cert-file=./certs/localhost+2.pem --key-file=./certs/localhost+2-key.pem 0.0.0.0:8017\n\
' > /start.sh && \
chmod +x /start.sh

# Set the entrypoint to run the script
ENTRYPOINT ["/start.sh"]
