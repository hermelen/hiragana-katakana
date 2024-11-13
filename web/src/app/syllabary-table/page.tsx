"use client";

import { syllabaryRecord, SyllabaryRecord } from "@/app/lib/syllabaryRecord";

import React, { useEffect, useState } from "react";
import { Radio } from "@/app/components/Radio";
import { UUID } from "node:crypto";

interface Syllable {
  id: UUID;
  hiragana: string;
  katakana: string;
  kanji?: string;
}

export default function SyllabaryTablePage() {
  type TableData = Record<string, [string, string]>[];
  const [local, setLocal] = useState<boolean>(true);
  const [syllableList, setSyllableList] = useState<Syllable[]>([]);
  const noChar = "";
  const backendName = "rust";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      fetch(`${apiUrl}/api/${backendName}/syllable`)
        .then((response) => response.json())
        .then((response) => {
          setSyllableList(response);
          console.log(response);
        })
        .catch((err) => {
          console.error("Error getting data:", err);
        });
    };

    fetchData();
  }, [backendName, apiUrl]);

  function splitRecordByValueLength(
    syllabaryRecord: SyllabaryRecord,
  ): TableData[] {
    const tableData: TableData[] = [];
    let currentArray: TableData = [];

    for (const [key, [hiragana, katakana]] of Object.entries(syllabaryRecord)) {
      const currentItem: Record<string, [string, string]> = {
        [key]: [hiragana, katakana],
      };

      if (key.length === 1) {
        if (currentArray.length > 0) {
          tableData.push(currentArray);
          currentArray = [];
        }
        currentArray.push(currentItem);
      } else {
        currentArray.push(currentItem);
        if (key === "mi") {
          currentArray.push({ yi: [noChar, noChar] });
        }
        if (key === "me") {
          currentArray.push({ ye: [noChar, noChar] });
        }
        if (key === "ru") {
          currentArray.push({ wu: [noChar, noChar] });
        }
      }
    }

    if (currentArray.length > 0) {
      tableData.push(currentArray);
    }

    return tableData;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(event.target.value === "true");
  };

  const tableData = splitRecordByValueLength(syllabaryRecord);

  return (
    <div>
      <div className="pt-4 pb-4 flex gap-10">
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
        {tableData.map((ul, ulIndex) => (
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
                                        from-fuchsia-500
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
