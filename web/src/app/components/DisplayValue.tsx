import React from "react";

type LabelKeyProps = {
  label: string;
};

export function DisplayValue({ label }: LabelKeyProps) {
  return (
    <div className="text-2xl h-10 flex flex-1 rounded-lg shadow-lg text-black bg-white items-center justify-center">
      {label}
    </div>
  );
}
