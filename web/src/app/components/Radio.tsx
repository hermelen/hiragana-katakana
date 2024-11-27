import React, { useCallback, useEffect, useState } from "react";

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
  const [cursorClass, setCursorClass] = useState<string>("");

  useEffect(() => {
    setCursorClass(() => getCursorGlass());
  }, [checked, position]);

  const getCursorGlass = useCallback(() => {
    return checked
      ? position === "left"
        ? "right-2"
        : "left-2"
      : position === "left"
        ? "right-10"
        : "left-10";
  }, [checked, position]);

  return (
    <label
      className={`${className}
      flex items-center
            ${position === "right" && "justify-end"}
            ${position === "left" && "justify-start"}
            flex items-center`}
    >
      {position === "right" && <span className="mr-2">{label}</span>}
      <div
        className={`relative h-8 
            w-8 
            bg-rose-500
            flex
            items-center
            shadow-lg
            ${position === "right" && "rounded-l-[50%] justify-end"}
            ${position === "left" && "rounded-r-[50%] justify-start"}
            `}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <div
          className={`
            h-6 w-7          
            bg-white
            opacity-50
          ${position === "right" && "rounded-l-[10rem]"}
           ${position === "left" && "rounded-r-[10rem]"}`}
        ></div>
        <div
          className={`absolute h-4 w-4 rounded-[50%] bg-rose-800 transition-all transition-100 ${cursorClass}`}
        ></div>
      </div>
      {position === "left" && <span className="ml-2">{label}</span>}
    </label>
  );
}
