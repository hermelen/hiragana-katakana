import React from "react";

type DisplayValueProps = {
  label: string;
  width?: string;
  textSize?: string;
};

export function DisplayValue({ label, textSize, width }: DisplayValueProps) {
  textSize = textSize ?? "text-2xl";
  return (
    <div
      className={`${textSize} h-10 w-${width ? width : "full"} flex rounded-lg shadow-lg text-black bg-white items-center justify-center`}
    >
      {label}
    </div>
  );
}
