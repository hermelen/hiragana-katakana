import React from "react";

type InputValueProps = {
  value?: string;
  width?: string;
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export function InputText({
  value,
  width,
  onChangeHandler,
  placeholder,
}: InputValueProps) {
  return (
    <input
      className={`h-10 
      text-center 
      rounded-lg shadow-lg 
      text-black text-xl 
      bg-amber-50 
      w-${width ? width : "full"} `}
      type="text"
      value={value}
      onChange={onChangeHandler}
      placeholder={placeholder ? placeholder : "Type something..."}
    />
  );
}
