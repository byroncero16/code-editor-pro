import React from "react";

type ExecuteButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function ExecuteButton(props: ExecuteButtonProps) {
  return (
    <button
      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      {...props}
    />
  );
}
