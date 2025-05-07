
#!/bin/bash
# Ensure node_modules/.bin is in PATH
export PATH="./node_modules/.bin:$PATH"

# Check if vite is installed locally
if [ ! -f "./node_modules/.bin/vite" ]; then
  echo "Installing vite locally..."
  npm install --save-dev vite
fi

# Run vite with any arguments passed
npx vite "$@"
