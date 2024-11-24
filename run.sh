#!/bin/bash

echo "Building Docker Compose services..."
docker-compose build

echo "Starting Docker Compose services..."
docker-compose up
