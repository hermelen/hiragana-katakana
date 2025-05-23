import React from "react";

type DisplayValueProps = {
  label: string;
  width?: number;
  textSize?: string;
};

export function DisplayValue({ label, textSize, width }: DisplayValueProps) {
  textSize = textSize ?? "text-2xl";
  return (
    <div
      className={`${textSize} h-10 w-${width ? width : "80"} flex flex-1 rounded-lg shadow-lg text-black bg-white items-center justify-center`}
    >
      {label}
    </div>
  );
}
