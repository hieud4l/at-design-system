import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { REACT_ICONS_PATH } from "./utils.js";

async function generateSvgIndex() {
    const iconFiles = fs.readdirSync(REACT_ICONS_PATH)
        .filter(file => file.endsWith(".tsx") && file !== "index.ts")
        .map(file => path.basename(file, ".tsx"));

    const indexContent = iconFiles
        .map(name => `export { default as ${name} } from "./${name}";`)
        .join("\n");

    fs.writeFileSync(path.join(REACT_ICONS_PATH, "index.ts"), indexContent);
    console.log(chalk.green(`Successfully generated index.ts in ${REACT_ICONS_PATH} for ${iconFiles.length} icons.`));
}

generateSvgIndex().catch(err => {
    console.error(chalk.red("Error generating SVG index:"), err);
    process.exit(1);
});
