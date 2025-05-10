import React from "react";

type InputValueProps = {
  value?: string;
  classValue?: string;
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export function InputValue({
  value,
  classValue,
  onChangeHandler,
  placeholder,
}: InputValueProps) {
  return (
    <input
      className={`h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl ${classValue}`}
      type="text"
      value={value}
      onChange={onChangeHandler}
      placeholder={placeholder ? placeholder : "Type something..."}
    />
  );
}
