import React from "react";

type InputValueProps = {
  value?: string;
  classValue?: string;
  onChangeHandler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export function InputText({
  value,
  classValue,
  onChangeHandler,
  placeholder,
}: InputValueProps) {
  return (
    <input
      className={`h-10 text-center rounded-lg shadow-lg text-black text-xl bg-amber-50 ${classValue}`}
      type="text"
      value={value}
      onChange={onChangeHandler}
      placeholder={placeholder ? placeholder : "Type something..."}
    />
  );
}
