import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { Language } from "./language-selector";

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CodeInput({ value, onChange }: CodeInputProps) {
  return (
    <CodeMirror
      value={value}
      height="200px"
      extensions={[javascript({ jsx: true }), java(), python()]}
      onChange={(value) => onChange(value)}
      minHeight="100%"
      className="w-full h-full"
    />
  );
}
