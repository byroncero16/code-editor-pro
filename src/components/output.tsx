import React from "react";

type OutputProps = {
  title: string;
  children: React.ReactNode;
};

export default function Output({ title, children }: OutputProps) {
  return (
    <div className="flex-1 border border-gray-200 p-2">
      <p className="font-bold">{title}</p>
      <div>{children}</div>
    </div>
  );
}
