import fs from "fs-extra";
import chalk from "chalk";
import { SVGS_PATH, isEligibleForValidation, extractColorsFromSvg, validateColors } from "./utils.js";

async function validateAllSvgsInPath(path) {
    if (!fs.existsSync(path)) {
        console.warn(chalk.yellow(`Warning: ${path} does not exist. Skipping validation.`));
        return;
    }

    const svgFiles = fs.readdirSync(path).filter(isEligibleForValidation);

    if (svgFiles.length === 0) {
        console.log(chalk.blue("No SVG files found for validation."));
        return;
    }

    svgFiles.forEach(svgFileName => {
        const svgFilePath = `${path}/${svgFileName}`;
        const content = fs.readFileSync(svgFilePath, "utf8").toString();
        const colors = extractColorsFromSvg(content);
        validateColors(colors, svgFileName);
    });

    console.log(chalk.green(`Successfully validated colors for ${svgFiles.length} icons.`));
}

validateAllSvgsInPath(SVGS_PATH).catch(err => {
    console.error(chalk.red("Error during icon validation:"), err);
    process.exit(1);
});
