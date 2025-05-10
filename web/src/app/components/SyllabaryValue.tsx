import React from "react";

type SyllabaryValueProps = {
  match: boolean;
  displayValue?: string;
  title?: string;
  width: number;
};

export function SyllabaryValue({
  match,
  displayValue,
  title,
  width,
}: SyllabaryValueProps) {
  return (
    <div
      className={`text-4xl 
                                        text-center
                                        flex
                                        items-center
                                        justify-center
                                        w-${width} 
                                        h-10 
                                        rounded-lg 
                                        bg-gradient-to-b  
                                        shadow-lg
                                        ${!match && "from-rose-500"}
                                        ${match && "from-indigo-500"}
                                        to-stone-800`}
      title={title}
    >
      {displayValue}
    </div>
  );
}
