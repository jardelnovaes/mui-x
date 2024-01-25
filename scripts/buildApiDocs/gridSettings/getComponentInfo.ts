import path from 'path';
import kebabCase from 'lodash/kebabCase';
import {
  ComponentInfo,
  extractPackageFile,
  getMuiName,
  parseFile,
  toGitHubPath,
} from '@mui-internal/api-docs-builder/buildApiUtils';

export function getComponentInfo(filename: string): ComponentInfo {
  const { name } = extractPackageFile(filename);
  let srcInfo: null | ReturnType<ComponentInfo['readFile']> = null;
  if (!name) {
    throw new Error(`Could not find the component name from: ${filename}`);
  }
  return {
    filename,
    name,
    slotInterfaceName: `${name.replace('DataGrid', 'Grid')}SlotsComponent`,
    muiName: getMuiName(name),
    apiPathname: `/x/api/data-grid/${kebabCase(name)}`,
    apiPagesDirectory: path.join(process.cwd(), `docs/pages/x/api/data-grid`),
    readFile: () => {
      srcInfo = parseFile(filename);

      const shouldSkip =
        filename.indexOf('internal') !== -1 ||
        !!srcInfo.src.match(/@ignore - internal component\./) ||
        !!srcInfo.src.match(/@ignore - internal hook\./);
      return { ...srcInfo, shouldSkip };
    },
    getInheritance: () => null, // TODO: Support inheritance
    getDemos: () => [
      { demoPathname: '/x/react-data-grid/#mit-version', demoPageTitle: 'DataGrid' },
      { demoPathname: '/x/react-data-grid/#commercial-version', demoPageTitle: 'DataGridPro' },
      { demoPathname: '/x/react-data-grid/#premium-version', demoPageTitle: 'DataGridPremium' },
    ],
  };
}

/**
 * Helper to get the import options
 * @param name The name of the component
 * @param filename The filename where its defined (to infer the package)
 * @returns an array of import command
 */
export function getComponentImports(name: string, filename: string) {
  const githubPath = toGitHubPath(filename);

  const rootImportPath = githubPath.replace(
    /\/packages\/(grid\/|)(.+?)?\/src\/.*/,
    (match, dash, pkg) => `@mui/${pkg}`,
  );

  const subdirectoryImportPath = githubPath.replace(
    /\/packages\/(grid\/|)(.+?)?\/src\/([^\\/]+)\/.*/,
    (match, dash, pkg, directory) => `@mui/${pkg}/${directory}`,
  );

  const reExportPackage = [rootImportPath];

  if (rootImportPath === '@mui/x-data-grid') {
    reExportPackage.push('@mui/x-data-grid-pro');
    reExportPackage.push('@mui/x-data-grid-premium');
  }
  if (rootImportPath === '@mui/x-data-grid-pro') {
    reExportPackage.push('@mui/x-data-grid-premium');
  }

  return [
    `import { ${name} } from '${subdirectoryImportPath}';`,
    ...reExportPackage.map((importPath) => `import { ${name} } from '${importPath}';`),
  ];
}
