import fs from "fs";
import path from "path";

const registryDir = path.resolve("registry");
const outputFile = path.resolve("Registry.js");

let merged = {};
let seenKeys = new Set();
let hasDuplicate = false;

// Collect all JSON files
for (const file of fs.readdirSync(registryDir)) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(registryDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Duplication check
    for (const key of Object.keys(data)) {
        if (seenKeys.has(key)) {
            console.error(`Duplicate namespace detected: "${key}" in file ${file}. First come first serve! /shrug`);
            hasDuplicate = true;
        } else {
            seenKeys.add(key);
            merged[key] = data[key];
        }
    }
}

// Format objects
function formatValues(value, indent = 1) {
    const padding = "    ".repeat(indent);
    // Just wrap strings into quotes dont really care
    if (typeof value === "string") {
        return `"${value}"`;
    }
    if (typeof value === "object" && value !== null) {
        const entries = Object.entries(value).map(([propName, propValue]) => `${padding}    ${propName}: ${formatValues(propValue, indent + 1)},`).join("\n");
        return `{\n${entries}\n${padding}}`;
    }
    return (value);
}

// Build final registry
function createRegister(object, indent = 0) {
    const padding = "    ".repeat(indent);
    const entries = Object.entries(object).map(([namespace, entry]) => `${padding}    ${namespace}: ${formatValues(entry, indent + 1)},`).join("\n");
    return `{\n${entries}\n${padding}}`;
}

if (hasDuplicate) {
    console.error("Build failed: duplicate namespaces detected. Please resolve and try again.");
    // Just fail the whole thing, no worth in trying to fix ourselves with indexing to just make this build work but then WAILA not doing anything with it
    process.exit(1);
}

const output = `/**
 * AUTO-GENERATED FILE! DO NOT EDIT!
 * Run \`npm run build\` to regenerate this file from /registry/*.json
 *
 * @type {import("./types").RegistryMap}
 */
export const Registry = ${createRegister(merged)};
`;

fs.writeFileSync(outputFile, output);