import { CharacterType } from "@/app/lib/syllabaryRecord";
import React from "react";

type CheckboxesProps = {
  checkedList: boolean[];
  onChange: (checkedList: boolean[]) => void;
};

export function Checkboxes({ checkedList, onChange }: CheckboxesProps) {
  return (
    <ul className="flex flex-col gap-4 justify-center size-full">
      {Object.values(CharacterType)
        .filter((x) => typeof x === "string")
        .map((type, index) => (
          <li
            className="flex items-center gap-5 size-full"
            key={`${type}-${index}`}
          >
            <div
              onClick={() =>
                onChange(
                  checkedList.map((item, idx) =>
                    idx === index ? !item : item,
                  ),
                )
              }
              className={`relative
                          text-3xl 
                          text-center
                          flex
                          items-center
                          justify-center
                          w-80 
                          h-10 
                          rounded-lg 
                          bg-gradient-to-b 
                          shadow-lg
                          ${checkedList[index] ? "from-yellow-500 hover:from-yellow-400" : "from-rose-500"}
                          to-stone-800`}
            >
              {type.toLocaleString()}
              <span className="absolute right-2">
                {checkedList[index] && "✓"}
              </span>
            </div>
          </li>
        ))}
    </ul>
  );
}
