# Add-On Registry
A registry for Minecraft Bedrock Add-Ons and their basic meta-data. This is intended to be used by features such as WAILA-Add-Ons to display accurate information about packs.

If you are an Add-On creator, you are welcome to add your pack to the registry so that it can be displayed accurately in other Add-Ons that display information about content from various Add-Ons.


## Contribution
To add your project(s), create a new JSON file or edit one inside the `/registry` folder with the required details, and submit it via pull-request.
Your pull-request will automatically merge all JSON files together into 1 `registry.js`.

### Steps
1. Create a new JSON file or edit one inside the `/registry` folder.  
   - If you're a "new" creator, the filename should be your creator/studio name (e.g. `ascent.json`, `spark.json`).
2. Follow the structure used in the other files. Example:
   ```json
    {
        "ascent_paint": {
            "name": "Paint",
            "creator": "ASCENT"
        }
    }
   ```
3. Commit your JSON file, then open a pull request.

### Notes
- The **key** should be the ID/namespace of your Add-On (the same namespace you use for blocks, entities, etc.).
- `name`: Display name of your Add-On.
- `creator`: Name of the creator or studio.
- Duplicate keys are not allowed. The build will fail if a namespace is already taken.
- Please use 4 spaces for indentation in your JSON file for consistency across all creator files.

## Including it in your pack
To use the registry in your project, install it via NPM from this repository:
```
npm i https://github.com/Bedrock-OSS/add-on-registry
```

You can now use it in your project like this:
```javascript
import { Registry } from "bedrock-add-on-registry"

function getAddOnName(identifier) {
    const namespace = identifier.split(":")[0];
    const entry = Registry[namespace];
    // Use the namespace itself as fallback
    return entry ? entry.name : namespace;
}
```