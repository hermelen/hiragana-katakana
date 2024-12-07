"use client";

import React, { useEffect, useState } from "react";
import { Radio } from "@/app/components/Radio";
import { Syllable } from "@/api/syllable";
import { SyllableService } from "@/api";

export default function SyllabaryTablePage() {
  type TableData = Record<string, [string, string]>[];
  const [local, setLocal] = useState<boolean>(true);
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const [syllabaryRecordList, setSyllabaryRecordList] = useState<TableData[]>(
    [],
  );
  const noChar = "";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      const response = await SyllableService.list(apiUrl);
      setSyllableList(response);
    };
    fetchData();
  }, [apiUrl]);

  useEffect(() => {
    const formatSyllabaryRecordList = () => {
      const tableData: TableData[] = [];
      let currentArray: TableData = [];
      if (syllableList.length === 0) {
        return;
      }
      for (const syllable of syllableList) {
        const currentItem: Record<string, [string, string]> = {
          [syllable.roman]: [syllable.hiragana, syllable.katakana],
        };
        if (syllable.roman.length === 1) {
          if (currentArray.length > 0) {
            tableData.push(currentArray);
            currentArray = [];
          }
          currentArray.push(currentItem);
        } else {
          currentArray.push(currentItem);
          if (syllable.roman === "mi") {
            currentArray.push({ yi: [noChar, noChar] });
          }
          if (syllable.roman === "me") {
            currentArray.push({ ye: [noChar, noChar] });
          }
          if (syllable.roman === "ru") {
            currentArray.push({ wu: [noChar, noChar] });
          }
        }
      }

      if (currentArray.length > 0) {
        tableData.push(currentArray);
      }

      setSyllabaryRecordList(tableData);
    };
    formatSyllabaryRecordList();
  }, [syllableList]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(event.target.value === "true");
  };

  return (
    <div>
      <div className="pt-4 pb-4 flex">
        <Radio
          className="flex-1"
          position="right"
          label="hiragana"
          name="syllabary"
          value="true"
          checked={local}
          onChange={handleChange}
        />
        <Radio
          className="flex-1"
          position="left"
          label="katakana"
          name="syllabary"
          value="false"
          checked={!local}
          onChange={handleChange}
        />
      </div>
      <div className="flex gap-4">
        {syllabaryRecordList.map((ul, ulIndex) => (
          <ul key={ulIndex} className="flex flex-col gap-4">
            {ul.map((li, liIndex) => {
              const key = Object.keys(li)[0];
              const value = Object.values(li)[0];
              return (
                <li
                  key={liIndex}
                  className={`flex
                                        items-center
                                        justify-center
                                        w-20 
                                        h-20 
                                        rounded-lg 
                                        bg-gradient-to-b 
                                        from-indigo-500
                                        shadow-lg 
                                        ${value[0] === noChar && "invisible"}`}
                >
                  <div key={key}>
                    <div className="text-4xl text-center">
                      {local ? value[0] : value[1]}
                    </div>
                    <div className="text-l text-center">{key}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}
