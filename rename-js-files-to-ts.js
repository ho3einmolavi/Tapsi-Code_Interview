const fs = require("fs");
const path = require("path");

function convertExtensions(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      convertExtensions(fullPath);
    } else {
      if (file.endsWith(".jsx")) {
        fs.renameSync(fullPath, fullPath.replace(/\.jsx$/, ".tsx"));
      } else if (file.endsWith(".js")) {
        const content = fs.readFileSync(fullPath, "utf8");
        const isJSX = /<\w+/.test(content);
        fs.renameSync(fullPath, fullPath.replace(/\.js$/, isJSX ? ".tsx" : ".ts"));
      }
    }
  });
}

// Read path from CLI args
const inputPath = process.argv[2];
if (!inputPath) {
  console.error("❌ Please provide the project path. Example: node rename-js-to-ts.js ./my-app");
  process.exit(1);
}

const absPath = path.resolve(inputPath);
convertExtensions(absPath);
console.log(`✅ Conversion complete for: ${absPath}`);
