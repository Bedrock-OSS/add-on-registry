import fs from "fs";
import path from "path";

const registryDir = path.resolve("registry");
const allFiles = fs.readdirSync(registryDir);

const nonJsonFiles = allFiles.filter((file) => !file.endsWith(".json"));
if (nonJsonFiles.length > 0) {
    console.error("Validation failed: Found files in registry that don't end with .json:");
    nonJsonFiles.forEach((file) => console.error(`  - ${file}`));
    console.error("All files in the registry folder must end with .json");
    process.exit(1);
}

// Validate JSON syntax
let validationErrors = [];
for (const file of allFiles) {
    const filePath = path.join(registryDir, file);
    try {
        const content = fs.readFileSync(filePath, "utf8");
        JSON.parse(content);
    } catch (error) {
        validationErrors.push(`${file}: ${error.message}`);
    }
}

if (validationErrors.length > 0) {
    console.error("Validation failed: JSON syntax errors found:");
    validationErrors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
}

console.log(`All ${allFiles.length} files in registry are valid JSON files!`);
