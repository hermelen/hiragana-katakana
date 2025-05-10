import React from "react";

type InputDataProps = {
  value?: string;
  classValue?: string;
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export function InputData({
  value,
  classValue,
  onChangeHandler,
  placeholder,
}: InputDataProps) {
  placeholder = placeholder || "Type something...";
  return (
    <input
      className={`h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl ${classValue}`}
      type="text"
      value={value}
      onChange={onChangeHandler}
      placeholder={placeholder}
    />
  );
}
