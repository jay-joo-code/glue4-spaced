import fs from 'fs';
import path from 'path';

const componentsDir = './components';
const iconsDir = './icons';
const outputFile = './index.ts';

const componentFiles = fs
  .readdirSync(componentsDir)
  .filter((file) => path.extname(file) === '.svelte');
const iconFiles = fs.readdirSync(iconsDir).filter((file) => path.extname(file) === '.svelte');

const componentExportStatements = componentFiles.map((component) => {
  const componentName = path.basename(component, '.svelte');
  return `export { default as ${componentName} } from '${componentsDir}/${component}';`;
});

const iconExportStatements = iconFiles.map((icon) => {
  const iconName = path.basename(icon, '.svelte');
  return `export { default as ${iconName} } from '${iconsDir}/${icon}';`;
});
const exportStatements = [...componentExportStatements, ...iconExportStatements];

fs.writeFileSync(outputFile, exportStatements.join('\n'));

console.log('Svelte components exported successfully!');
