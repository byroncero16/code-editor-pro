export type Language = "javascript" | "java" | "python";

type LanguageSelectorProps = {
  value: Language;
  onChange: (value: Language) => void;
};

export default function LanguageSelector({
  value,
  onChange,
}: LanguageSelectorProps) {
  return (
    <select
      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
    >
      <option value="javascript">JavaScript</option>
      <option value="java">Java</option>
      <option value="python">Python</option>
    </select>
  );
}
