
#!/bin/bash

echo "Installing necessary dependencies..."
npm install -g vite
npm install --save-dev @types/react @types/react-dom @types/node date-fns
npm install recharts sonner @radix-ui/react-checkbox lucide-react react-router-dom

echo "Creating TypeScript configuration..."

cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

cat > tsconfig.node.json << EOL
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOL

# Create a simple npx wrapper script
cat > run-vite.sh << EOL
#!/bin/bash
npx vite "\$@"
EOL

chmod +x run-vite.sh

# Create a dev start script
cat > start-dev.sh << EOL
#!/bin/bash
npx vite
EOL

chmod +x start-dev.sh

echo "Setup complete! You can now run ./start-dev.sh to start the development server."
