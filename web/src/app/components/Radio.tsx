import React from "react";

type RadioProps = {
  label: string;
  name: string;
  className: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  position?: "right" | "left";
};

export function Radio({
  label,
  name,
  value,
  checked,
  onChange,
  position = "right",
  className = "",
}: RadioProps) {
  return (
    <label
      className={`${className}
      h-8 flex items-center
            ${position === "right" && "justify-end"}
            ${position === "left" && "justify-start"}
            flex items-center`}
    >
      {position === "right" && <span className="mr-2">{label}</span>}
      <div
        className={`h-8 
            w-8 
            bg-indigo-500
            flex
            justify-center
            items-center
            shadow-lg
            ${position === "right" && "rounded-l-[50%]"}
            ${position === "left" && "rounded-r-[50%]"}
            `}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="w-6 h-6 text-indigo accent-indigo-500 border-indigo-500 outline-0"
        />
      </div>
      {position === "left" && <span className="ml-2">{label}</span>}
    </label>
  );
}
