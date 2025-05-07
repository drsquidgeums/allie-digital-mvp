
#!/bin/bash
# Ensure node_modules/.bin is in PATH
export PATH="./node_modules/.bin:$PATH"

# Check if vite is installed locally
if [ ! -f "./node_modules/.bin/vite" ]; then
  echo "Vite not found locally. Installing vite..."
  npm install --save-dev vite@latest
fi

# Run vite
echo "Starting Vite development server..."
npx vite
