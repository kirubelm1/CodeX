import { LANGUAGES } from '../constants/languages';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  maxLines?: number;
}

export function SyntaxHighlighter({ code, language, maxLines }: SyntaxHighlighterProps) {
  const lines = code.split('\n');
  const displayLines = maxLines ? lines.slice(0, maxLines) : lines;
  const isOverflowing = maxLines && lines.length > maxLines;

  const getLanguageClass = (lang: string) => {
    const languageMap: Record<string, string> = {
      javascript: 'language-javascript',
      typescript: 'language-typescript',
      python: 'language-python',
      java: 'language-java',
      cpp: 'language-cpp',
      c: 'language-c',
      csharp: 'language-csharp',
      php: 'language-php',
      ruby: 'language-ruby',
      go: 'language-go',
      rust: 'language-rust',
      swift: 'language-swift',
      kotlin: 'language-kotlin',
      html: 'language-html',
      css: 'language-css',
      scss: 'language-scss',
      json: 'language-json',
      xml: 'language-xml',
      yaml: 'language-yaml',
      markdown: 'language-markdown',
      bash: 'language-bash',
      sql: 'language-sql',
    };
    return languageMap[lang] || 'language-text';
  };

  const highlightCode = (code: string, lang: string) => {
    // Basic syntax highlighting patterns
    const patterns: Record<string, RegExp[]> = {
      javascript: [
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await)\b/g,
        /\b(true|false|null|undefined)\b/g,
        /"[^"]*"/g,
        /'[^']*'/g,
        /`[^`]*`/g,
        /\/\/.*$/gm,
        /\/\*[\s\S]*?\*\//g,
      ],
      typescript: [
        /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|async|await|interface|type|enum)\b/g,
        /\b(string|number|boolean|any|void|never)\b/g,
        /\b(true|false|null|undefined)\b/g,
        /"[^"]*"/g,
        /'[^']*'/g,
        /`[^`]*`/g,
        /\/\/.*$/gm,
        /\/\*[\s\S]*?\*\//g,
      ],
      python: [
        /\b(def|class|if|elif|else|for|while|try|except|finally|import|from|as|return|yield|lambda|with|async|await)\b/g,
        /\b(True|False|None)\b/g,
        /"[^"]*"/g,
        /'[^']*'/g,
        /#.*$/gm,
      ],
      html: [
        /<\/?[^>]+>/g,
        /\s[\w-]+=/g,
        /"[^"]*"/g,
        /'[^']*'/g,
      ],
      css: [
        /[\w-]+(?=\s*:)/g,
        /:[\w-]+/g,
        /"[^"]*"/g,
        /'[^']*'/g,
        /\/\*[\s\S]*?\*\//g,
      ],
    };

    let highlightedCode = code;
    const langPatterns = patterns[lang] || [];

    langPatterns.forEach((pattern, index) => {
      const className = `syntax-${index}`;
      highlightedCode = highlightedCode.replace(pattern, (match) => {
        return `<span class="${className}">${match}</span>`;
      });
    });

    return highlightedCode;
  };

  return (
    <div className="relative">
      <pre className="text-sm overflow-x-auto p-4 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <code 
          className={getLanguageClass(language)}
          dangerouslySetInnerHTML={{
            __html: displayLines.map(line => highlightCode(line, language)).join('\n')
          }}
        />
      </pre>
      {isOverflowing && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
      )}
      <style jsx>{`
        .syntax-0 { color: #0066cc; font-weight: 600; } /* Keywords */
        .syntax-1 { color: #0066cc; } /* Types/Literals */
        .syntax-2 { color: #22863a; } /* Strings */
        .syntax-3 { color: #22863a; } /* Strings */
        .syntax-4 { color: #22863a; } /* Template strings */
        .syntax-5 { color: #6f42c1; font-style: italic; } /* Comments */
        .syntax-6 { color: #6f42c1; font-style: italic; } /* Comments */
      `}</style>
    </div>
  );
}
