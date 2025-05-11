import React, { MouseEventHandler } from "react";

type BasicButtonProps = {
  label: string;
  onClickHandler: MouseEventHandler<HTMLButtonElement>;
  fromGradient?: string;
  fromHoverGradient?: string;
  toGradient?: string;
  disabled?: boolean;
  width?: number;
};

export function BasicButton({
  label,
  fromGradient,
  toGradient,
  onClickHandler,
  fromHoverGradient,
  disabled,
  width,
}: BasicButtonProps) {
  return (
    <button
      className={`
        h-10
        flex
        flex-1
        text-xl
        text-center
        w-${width ? width : "80"} 
        items-center
        justify-center
        pr-1
        pl-1
        rounded-lg
        shadow-lg
        bg-gradient-to-b
        ${fromGradient ? fromGradient : "from-indigo-500"}
        ${fromHoverGradient && fromHoverGradient}
        ${toGradient ? toGradient : "to-stone-800"}
      `}
      disabled={disabled ? disabled : false}
      onClick={onClickHandler}
    >
      {label}
    </button>
  );
}
