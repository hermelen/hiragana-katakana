import React from "react";

type LabelKeyProps = {
  match?: boolean;
  label?: string;
  title?: string;
  width?: number;
  textSize?: string;
};

export function Label({ match, label, title, width, textSize }: LabelKeyProps) {
  match = match === false ? match : true;
  return (
    <div
      className={` 
        ${textSize ? textSize : "text-4xl"} 
        text-center
        flex
        items-center
        justify-center
        w-${width ? width : "80"} 
        h-10 
        rounded-lg 
        bg-gradient-to-b  
        shadow-lg
        ${match ? "from-indigo-500" : "from-rose-500"}
        to-stone-800
      `}
      title={title}
    >
      {label}
    </div>
  );
}
