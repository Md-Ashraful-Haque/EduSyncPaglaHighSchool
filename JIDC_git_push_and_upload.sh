#!/bin/bash

# Function to set production URL[](https://jidc.edu.bd/ims/api) as active
set_prod() {
  cat > frontend/.env << EOF
# VITE_API_URL=https://localhost:8017/api
VITE_API_URL=https://jidc.edu.bd/ims/api
VITE_INSTITUTE_CODE=JIDC
EOF
  echo "Switched to production: VITE_API_URL=https://jidc.edu.bd/ims/api"
  # cat frontend/.env
}

# Function to set local URL[](https://localhost:8017/api) as active
set_local() {
  cat > frontend/.env << EOF
VITE_API_URL=https://localhost:8017/api
# VITE_API_URL=https://jidc.edu.bd/ims/api
VITE_INSTITUTE_CODE=JIDC
EOF
  echo "Switched to local: VITE_API_URL=https://localhost:8017/api"
  # cat frontend/.env
}

# Check if frontend/.env exists
if [ ! -f frontend/.env ]; then
  echo "Error: frontend/.env file not found!"
  exit 1
fi

# Step 1: Switch to production URL 
set_prod

# Step 2: Build the app in Docker
echo "/////////////////// Build Start ///////////////////////////"
# Check if container is running
if ! docker ps | grep -q edusyncpaglahighschoolnew-frontend_with_web-1; then
  echo "Error: Container edusyncpaglahighschoolnew-frontend_with_web-1 is not running!"
  exit 1
fi

# Run npm run build in the container
if ! docker exec -it edusyncpaglahighschoolnew-frontend_with_web-1 sh -c "npm run build > /dev/null 2>&1"; then
  echo "Error: Build failed!"
  exit 1
fi
echo "/////////////// Build Successfully Completed ///////////////"

# Step 3: Commit and push to GitHub
echo "Trying to push to GitHub..."
git add .
git commit -m "Pushed using deploy.sh script" || {
  echo "Nothing to commit, proceeding to push..."
}
if ! git push origin main; then
  echo "Error: Git push failed! Try running 'git pull origin main' to resolve conflicts."
  exit 1
fi
echo "/////////////////// Pushing Complete ///////////////////////////"

echo "/////////////////// Deployment Complete ///////////////////////////"

# Step 5: Switch back to local URL
echo "Switching back to local environment..."
set_local