import { PropDetails } from '../types';

export interface KendoComponentInfo {
  componentName: string;
  imports: string[];
  examples: ComponentExample[];
  props: Record<string, PropDetails>;
}

export interface ComponentExample {
  title: string;
  code: string;
  description?: string;
}

export function extractKendoComponentInfo(
  componentName: string,
  rawOutput: string
): KendoComponentInfo {
  return {
    componentName,
    imports: extractImports(rawOutput),
    examples: extractExamples(rawOutput),
    props: extractProps(rawOutput)
  };
}

function extractImports(rawOutput: string): string[] {
  const imports: string[] = [];

  // More comprehensive import regex that captures full import statements
  const fullImportRegex =
    /import\s+(?:\*\s+as\s+\w+|\{[^}]*\}|\w+)\s+from\s+['"`][^'"`]+['"`];?/g;

  let match;
  while ((match = fullImportRegex.exec(rawOutput)) !== null) {
    const fullImportStatement = match[0];
    // Clean up the import statement and ensure it has a semicolon
    const cleanImport = fullImportStatement.endsWith(';')
      ? fullImportStatement
      : fullImportStatement + ';';

    // Only include Kendo React imports
    if (
      !imports.includes(cleanImport) &&
      cleanImport.includes('@progress/kendo-react')
    ) {
      imports.push(cleanImport);
    }
  }

  // Also look for component references to generate basic imports
  const packageRegex = /@progress\/kendo-react-[a-z-]+/g;
  const foundPackages = new Set<string>();

  let packageMatch;
  while ((packageMatch = packageRegex.exec(rawOutput)) !== null) {
    foundPackages.add(packageMatch[0]);
  }

  // Extract component names from examples sections and create proper imports
  foundPackages.forEach((pkg) => {
    // Look for component usage in examples
    const componentNameRegex = new RegExp(
      `import\\s+\\{([^}]+)\\}\\s+from\\s+['"\`]${pkg.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )}['"\`]`,
      'g'
    );
    let componentMatch;

    while ((componentMatch = componentNameRegex.exec(rawOutput)) !== null) {
      const components = componentMatch[1].split(',').map((c) => c.trim());
      components.forEach((comp) => {
        const importStatement = `import { ${comp} } from '${pkg}';`;
        if (!imports.includes(importStatement)) {
          imports.push(importStatement);
        }
      });
    }
  });

  return imports.filter((imp) => imp.trim().length > 0);
}

function extractExamples(rawOutput: string): ComponentExample[] {
  const examples: ComponentExample[] = [];

  // First try to find the Examples section
  const examplesSectionRegex = /## Examples\s*\n([\s\S]*?)(?=##|$)/i;
  const examplesMatch = rawOutput.match(examplesSectionRegex);

  if (examplesMatch) {
    const examplesSection = examplesMatch[1];

    // Extract individual examples with titles
    const individualExampleRegex =
      /### Example (\d+)\s*\n```[^\n]*\n([\s\S]*?)\n```/g;
    let exampleMatch;

    while (
      (exampleMatch = individualExampleRegex.exec(examplesSection)) !== null
    ) {
      const exampleNumber = exampleMatch[1];
      const code = exampleMatch[2].trim();

      if (code) {
        examples.push({
          title: `Example ${exampleNumber}`,
          code: code,
          description: `Implementation example ${exampleNumber} for the component`
        });
      }
    }
  }

  // If no examples found in Examples section, look for any code blocks
  if (examples.length === 0) {
    const codeBlockRegex =
      /```(?:jsx?|tsx?|javascript|typescript)?\n([\s\S]*?)```/g;
    let codeMatch;
    let exampleIndex = 1;

    while ((codeMatch = codeBlockRegex.exec(rawOutput)) !== null) {
      const code = codeMatch[1].trim();

      // Only include code blocks that look like React components
      if (
        code &&
        code.includes('import') &&
        (code.includes('React') ||
          code.includes('function') ||
          code.includes('const'))
      ) {
        examples.push({
          title: `Example ${exampleIndex}`,
          code: code,
          description: `React component implementation example`
        });
        exampleIndex++;
      }
    }
  }

  return examples;
}

function extractProps(rawOutput: string): Record<string, PropDetails> {
  const props: Record<string, PropDetails> = {};

  // Split by ### to get prop sections
  const sections = rawOutput.split('###');

  sections.forEach((section) => {
    const lines = section
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

    if (lines.length === 0) return;

    // Look for prop definition patterns
    const firstLine = lines[0];

    // Check if this section contains prop information
    if (firstLine.includes('Props.') || firstLine.includes('(children)')) {
      const propDetail: PropDetails = {
        name: '',
        fullName: '',
        summary: '',
        syntax: {
          return: {
            type: ''
          }
        }
      };

      lines.forEach((line, index) => {
        if (line.startsWith('name:')) {
          propDetail.name = line.replace('name:', '').trim();
        } else if (line.startsWith('summary:')) {
          // Summary might span multiple lines, collect until next field
          let summary = line.replace('summary:', '').trim();
          let nextLineIndex = index + 1;

          while (
            nextLineIndex < lines.length &&
            !lines[nextLineIndex].includes(':') &&
            !lines[nextLineIndex].startsWith('---')
          ) {
            summary += ' ' + lines[nextLineIndex].trim();
            nextLineIndex++;
          }

          propDetail.summary = summary;
          console.log(propDetail.summary);
        } else if (line.startsWith('type:')) {
          propDetail.syntax.return.type = line.replace('type:', '').trim();
        }
      });

      // Add to props if we have a valid name
      if (propDetail.name) {
        props[propDetail.name] = propDetail;
      }
    }
  });

  return props;
}
