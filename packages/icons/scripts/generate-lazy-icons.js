import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { REACT_ICONS_PATH, LAZY_ICONS_PATH } from "./utils.js";

async function generateLazyIcons() {
    if (!fs.existsSync(LAZY_ICONS_PATH)) {
        fs.mkdirSync(LAZY_ICONS_PATH, { recursive: true });
    }

    const iconFiles = fs.readdirSync(REACT_ICONS_PATH).filter(file => file.endsWith(".tsx") && file !== "index.ts");

    iconFiles.forEach(file => {
        const fileNameWithoutExtension = path.basename(file, ".tsx");
        const lazyComponentCode = `import React, { lazy, Suspense } from "react";

const ${fileNameWithoutExtension}Icon = lazy(() => import("../react/${fileNameWithoutExtension}"));

const ${fileNameWithoutExtension} = (props: any) => (
  <Suspense fallback={null}>
    <${fileNameWithoutExtension}Icon {...props} />
  </Suspense>
);

export default ${fileNameWithoutExtension};
`;
        fs.writeFileSync(path.join(LAZY_ICONS_PATH, `${fileNameWithoutExtension}.tsx`), lazyComponentCode);
    });

    const indexContent = iconFiles
        .map(file => {
            const fileNameWithoutExtension = path.basename(file, ".tsx");
            return `export { default as ${fileNameWithoutExtension} } from "./${fileNameWithoutExtension}";`;
        })
        .join("\n");

    fs.writeFileSync(path.join(LAZY_ICONS_PATH, "index.ts"), indexContent);
    console.log(chalk.green(`Successfully generated lazy components for ${iconFiles.length} icons.`));
}

generateLazyIcons().catch(err => {
    console.error(chalk.red("Error generating lazy icons:"), err);
    process.exit(1);
});
