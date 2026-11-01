const RULES = {
  python: [
    ["comment", /#[^\n]*/y],
    ["string", /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y],
    [
      "keyword",
      /\b(?:from|import|as|with|def|return|class|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|raise|lambda|yield|pass|break|continue)\b/y,
    ],
    ["function", /[A-Za-z_]\w*(?=\()/y],
    ["number", /\b\d+(?:\.\d+)?\b/y],
  ],
  bash: [
    ["comment", /#[^\n]*/y],
    ["string", /"(?:\\.|[^"\\])*"|'[^']*'/y],
    ["keyword", /\b(?:sudo|pip3?|npm|npx|cd|export|git|python3?|conda|brew|curl)\b/y],
    ["number", /(?<=\s)-{1,2}[\w-]+/y],
  ],
};

export function highlight(code = "", language = "") {
  const rules = RULES[language] ?? [];
  const tokens = [];
  let buffer = "";
  let index = 0;
  const flush = () => {
    if (buffer) tokens.push({ type: "plain", text: buffer });
    buffer = "";
  };
  scan: while (index < code.length) {
    for (const [type, pattern] of rules) {
      pattern.lastIndex = index;
      const match = pattern.exec(code);
      if (match && match[0].length) {
        flush();
        tokens.push({ type, text: match[0] });
        index += match[0].length;
        continue scan;
      }
    }
    buffer += code[index];
    index += 1;
  }
  flush();
  return tokens;
}
