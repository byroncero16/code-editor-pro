"use client";

import { useState } from "react";
import CodeInput from "./code-input";
import LanguageSelector, { Language } from "./language-selector";
import Loader from "./loader";
import ExecuteButton from "./execute-button";
import Output from "./output";

const helloWorldMap = {
  javascript: "console.log('Hello World!');",
  java: `
public class HelloWorld {
  public static void main(String args[]) {
    System.out.println("Hello World!");
  }
}
  `,
  python: "print('Hello World!');",
};

export default function CodeEditor() {
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(helloWorldMap[language]);
  const [output, setOutput] = useState("");
  const [compileError, setCompileError] = useState("");
  const [runtimeError, setRuntimeError] = useState("");

  async function handleExecute() {
    setOutput("");
    setCompileError("");
    setRuntimeError("");
    setLoading(true);
    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        language,
        code,
      }),
    });
    const { output, compileStatus, stderr } = await response.json();
    setOutput(output || "");
    setCompileError(compileStatus || "");
    setRuntimeError(stderr || "");
    setLoading(false);
  }

  function handleLanguageChange(language: Language) {
    setCode(helloWorldMap[language]);
    setLanguage(language);
  }

  return (
    <div className="flex min-h-screen flex p-6 gap-6">
      {loading && <Loader />}
      <div className="flex-1 border border-gray-200 flex flex-col">
        <div className="flex items-center gap-4 py-4 px-8">
          <LanguageSelector value={language} onChange={handleLanguageChange} />
          <ExecuteButton onClick={() => handleExecute()}>
            Ejectuar
          </ExecuteButton>
        </div>
        <div className="flex-1">
          <CodeInput value={code} onChange={setCode} />
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1 border border-gray-200 p-2">
        <Output title="Output">{output}</Output>
        <Output title="Compile Error">{compileError}</Output>
        <Output title="Runtime Error">{runtimeError}</Output>
      </div>
    </div>
  );
}
