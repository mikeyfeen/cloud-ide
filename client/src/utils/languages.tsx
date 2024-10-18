interface ILanguages {
  [key: string]: string;
}

const findLanguage = (extension: string): string => {
  return languages[extension] || "plaintext";
};

const languages: ILanguages = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  css: "css",
  scss: "scss",
  sass: "sass",
  json: "json",
  html: "html",
  py: "python",
  php: "php",
  cs: "csharp",
  cpp: "cpp",
  cshtml: "razor",
  java: "java",
  md: "markdown",
  vb: "vb",
  coffee: "coffeescript",
  litcoffee: "coffeescript",
  bat: "batch",
  pug: "pug",
  fs: "fsharp",
  fsx: "fsharp",
  fsi: "fsharp",
  lua: "lua",
  ps1: "powershell",
  rb: "ruby",
  r: "r",
  obj: "objectivec",
  swift: "swift",
  kt: "kotlin",
  go: "go",
  rs: "rust",
  scala: "scala",
  sql: "sql",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  tsql: "sql",
};

export default findLanguage;
