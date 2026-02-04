import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { Window } from "./Window";

export interface CodeBlockProps {
  code: string;
  language?: "javascript" | "typescript" | "jsx" | "tsx" | "css" | "html";
  /** Show line numbers */
  lineNumbers?: boolean;
  /** Highlight specific lines */
  highlightLines?: number[];
  /** Typewriter effect speed (0 to disable) */
  typingSpeed?: number;
  /** Theme: dark or light */
  theme?: "dark" | "light";
  /** Window title */
  fileName?: string;
  /** Font size */
  fontSize?: number;
  style?: React.CSSProperties;
  className?: string;
}

// Simple syntax highlighting (regex-based)
const highlightCode = (code: string, theme: "dark" | "light") => {
  const colors = theme === "dark" ? {
    keyword: "#ff7b72", // pink
    string: "#a5d6ff", // light blue
    comment: "#8b949e", // gray
    function: "#d2a8ff", // purple
    number: "#79c0ff", // blue
    operator: "#ff7b72",
    class: "#f0883e", // orange
    plain: "#c9d1d9",
  } : {
    keyword: "#d73a49",
    string: "#032f62",
    comment: "#6a737d",
    function: "#6f42c1",
    number: "#005cc5",
    operator: "#d73a49",
    class: "#e36209",
    plain: "#24292e",
  };

  // Very basic tokenization
  const tokens = code.split(/(\/\/.*|\/\*[\s\S]*?\*\/|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\b(?:import|export|from|const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|async|await|class|interface|type|extends|implements|new|this|super|void|null|undefined|true|false)\b|\b\d+\b|[{}()[\].,:;]|\s+)/g);

  return tokens.map((token, i) => {
    let color = colors.plain;
    
    if (!token) return null;

    if (token.match(/^\s+$/)) {
      return <span key={i}>{token}</span>;
    }
    
    if (token.startsWith("//") || token.startsWith("/*")) {
      color = colors.comment;
    } else if (token.match(/^["'`]/)) {
      color = colors.string;
    } else if (token.match(/^(?:import|export|from|const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|async|await|class|interface|type|extends|implements|new|this|super|void|null|undefined|true|false)$/)) {
      color = colors.keyword;
    } else if (token.match(/^\d+$/)) {
      color = colors.number;
    } else if (token.match(/^[{}()[\].,:;]$/)) {
        color = colors.plain; // Punctuation
    } else if (token.match(/^[+\-*/%=&|<>!^~?]+$/)) {
        color = colors.operator;
    } else if (i > 0 && tokens[i-1] === "function") {
        color = colors.function; // Function name after keyword
    } else if (i < tokens.length - 1 && tokens[i+1] === "(") {
        color = colors.function; // Function call
    } else if (token.match(/^[A-Z][a-zA-Z0-9_]*$/)) {
        color = colors.class; // Class/Type
    }

    return <span key={i} style={{ color }}>{token}</span>;
  });
};

/**
 * Animated code block with syntax highlighting and typing effect.
 * Wrapped in a Window component.
 * 
 * @example
 * <CodeBlock 
 *   code="const hello = 'world';" 
 *   fileName="script.ts"
 *   typingSpeed={2}
 * />
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  language = "typescript",
  lineNumbers = true,
  highlightLines = [],
  typingSpeed = 0,
  theme = "dark",
  fileName,
  fontSize = 14,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  // Typing effect
  const visibleCode = useMemo(() => {
    if (typingSpeed <= 0) return code;
    
    const charsToShow = Math.floor(frame * typingSpeed);
    return code.slice(0, charsToShow);
  }, [code, frame, typingSpeed]);

  const lines = visibleCode.split("\n");
  const lineCount = code.split("\n").length; // Use total lines for consistent gutter width

  return (
    <Window 
      title={fileName} 
      dark={theme === "dark"} 
      className={className}
      style={style}
    >
      <div
        style={{
          padding: 16,
          fontSize,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
          lineHeight: 1.5,
          overflow: "hidden",
          whiteSpace: "pre",
          display: "flex",
        }}
      >
        {/* Line Numbers */}
        {lineNumbers && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingRight: 16,
              marginRight: 16,
              borderRight: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              color: theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
              userSelect: "none",
              textAlign: "right",
              minWidth: `${String(lineCount).length + 0.5}em`,
            }}
          >
            {lines.map((_, i) => (
              <div key={i} style={{ height: "1.5em" }}>{i + 1}</div>
            ))}
          </div>
        )}

        {/* Code Content */}
        <div style={{ flex: 1 }}>
          {lines.map((line, i) => {
             const isHighlighted = highlightLines.includes(i + 1);
             const lineContent = highlightCode(line, theme);
             
             return (
               <div 
                 key={i} 
                 style={{ 
                   height: "1.5em",
                   backgroundColor: isHighlighted ? (theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "transparent",
                   width: "100%", // Full width highlight
                   borderRadius: 4,
                 }}
               >
                 {lineContent}
                 {/* Cursor if typing the last line */}
                 {typingSpeed > 0 && i === lines.length - 1 && (
                    <span 
                        style={{ 
                            borderRight: `2px solid ${theme === "dark" ? "#fff" : "#000"}`, 
                            display: "inline-block", 
                            height: "1em", 
                            verticalAlign: "middle",
                            animation: "blink 1s step-end infinite" 
                        }} 
                    />
                 )}
               </div>
             );
          })}
        </div>
      </div>
    </Window>
  );
};

export default CodeBlock;
