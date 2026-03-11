import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const sourceRoot = path.resolve('lib');
const esmOutDir = path.resolve('dist/lib');
const cjsOutDir = path.resolve('dist/cjs');

async function getTypeScriptFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return getTypeScriptFiles(fullPath);
      }

      return entry.isFile() && fullPath.endsWith('.ts') ? [fullPath] : [];
    }),
  );

  return files.flat();
}

async function inlineRawHtmlImports(source, filePath) {
  const matches = [...source.matchAll(/import\s+(\w+)\s+from\s+["'](.+?\.html)\?raw["'];?/g)];

  if (matches.length === 0) return source;

  let nextSource = source;

  for (const match of matches) {
    const variableName = match[1];
    const htmlRelativePath = match[2];
    const htmlPath = path.resolve(path.dirname(filePath), htmlRelativePath);
    const htmlContents = await readFile(htmlPath, 'utf8');
    const replacement = `const ${variableName} = ${JSON.stringify(htmlContents)};`;

    nextSource = nextSource.replace(match[0], replacement);
  }

  return nextSource;
}

async function emitFile(filePath, outDir, moduleKind, extension) {
  const relativePath = path.relative(sourceRoot, filePath);
  const outputPath = path.join(outDir, relativePath.replace(/\.ts$/, extension));
  const source = await readFile(filePath, 'utf8');
  const transformedSource = await inlineRawHtmlImports(source, filePath);

  const result = ts.transpileModule(transformedSource, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: moduleKind,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      verbatimModuleSyntax: true,
    },
    fileName: filePath,
  });

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, result.outputText, 'utf8');
}

await rm(esmOutDir, { recursive: true, force: true });
await rm(cjsOutDir, { recursive: true, force: true });
await mkdir(esmOutDir, { recursive: true });
await mkdir(cjsOutDir, { recursive: true });

const files = await getTypeScriptFiles(sourceRoot);

await Promise.all(
  files.flatMap((filePath) => [
    emitFile(filePath, esmOutDir, ts.ModuleKind.ESNext, '.js'),
    emitFile(filePath, cjsOutDir, ts.ModuleKind.CommonJS, '.cjs'),
  ]),
);
