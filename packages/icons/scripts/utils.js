import path from "path";
import fs from "fs-extra";
import { globby } from "globby";
import chalk from "chalk";

export const SVGS_PATH = "src/svg";
export const REACT_ICONS_PATH = "src/react";
export const LAZY_ICONS_PATH = "src/lazy";

export function isEligibleForValidation(fileName) {
    return fileName.endsWith(".svg");
}

export function extractColorsFromSvg(content) {
    const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)/g;
    return content.match(colorRegex) || [];
}

// Approved colors/tokens (example list, should be expanded based on project rules)
const APPROVED_COLORS = [
    "currentColor",
    "none",
    "var(--color-text-primary)",
    "var(--color-text-secondary)",
    "var(--color-text-brand)",
    "#000000",
    "#000",
    "#FFFFFF",
    "#fff"
];

export function validateColors(colors, fileName) {
    const invalidColors = colors.filter(color => !APPROVED_COLORS.includes(color));
    if (invalidColors.length > 0) {
        console.error(chalk.red(`Error in ${fileName}: Invalid colors found: ${invalidColors.join(", ")}`));
        process.exit(1);
    }
}
