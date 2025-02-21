// scripts/setup-uploads.js
const fs = require('fs');
const path = require('path');

const setupUploads = () => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Created uploads directory:', uploadsDir);
  }

  // Set proper permissions (755 = rwxr-xr-x)
  fs.chmodSync(uploadsDir, 0o755);
  console.log('✓ Set directory permissions');

  // Create a .gitkeep file to ensure directory is tracked
  const gitkeepPath = path.join(uploadsDir, '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '');
    console.log('✓ Added .gitkeep file');
  }

  // Create a .gitignore file to ignore uploaded files
  const gitignorePath = path.join(uploadsDir, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, '*\n!.gitkeep\n');
    console.log('✓ Added .gitignore file');
  }
}

setupUploads();