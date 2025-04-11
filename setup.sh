
#!/bin/bash
echo "🚀 Setting up project dependencies..."

# Install required dependencies
npm install

# Create TypeScript configuration that extends the base configuration
echo '{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/@types"],
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}' > tsconfig.app.json

# Run the dev server with the extended configuration
echo "✅ Setup complete! You can now run: npm run dev"
