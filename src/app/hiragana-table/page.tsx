"use client"

import {noChar, space, syllabaryRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";
import React, {useState} from "react";
import {Radio} from "@/app/components/Radio";

export default function HiraganaTablePage() {
    type Result = Record<string, [string, string]>[];
    const [local, setLocal] = useState<boolean>(true);
    const noChar = "";

    function splitRecordByValueLength(syllabaryRecord: SyllabaryRecord): Result[] {
        const result: Result[] = [];
        let currentArray: Result = [];

        for (const [key, [hiragana, katakana]] of Object.entries(syllabaryRecord)) {
            const currentItem: Record<string, [string, string]> = {[key]: [hiragana, katakana]};

            if (key.length === 1) {
                if (currentArray.length > 0) {
                    result.push(currentArray);
                    currentArray = [];
                }
                currentArray.push(currentItem);
            } else {
                currentArray.push(currentItem);
                if (key === "mi") {
                    currentArray.push({"yi": [noChar, noChar]});
                }
                if (key === "me") {
                    currentArray.push({"ye": [noChar, noChar]});
                }
                if (key === "ru") {
                    currentArray.push({"wu": [noChar, noChar]});
                }
            }
        }

        if (currentArray.length > 0) {
            result.push(currentArray);
        }

        return result;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocal(event.target.value === 'true');
    };

    const result = splitRecordByValueLength(syllabaryRecord);


    return (
        <div>
            <div className="pt-4 pb-4 flex justify-around">
                <Radio
                    position="right"
                    label="hiragana"
                    name="syllabary"
                    value="true"
                    checked={local}
                    onChange={handleChange}
                />
                <Radio
                    position="left"
                    label="katakana"
                    name="syllabary"
                    value="false"
                    checked={!local}
                    onChange={handleChange}
                />
            </div>
            <div className={"flex gap-4"}>
                {result.map((ul, ulIndex) => (
                    <ul key={ulIndex} className="flex flex-col gap-4">
                        {ul.map((li, liIndex) => {
                            const key = Object.keys(li)[0];
                            const value = Object.values(li)[0];
                            return (
                                <li key={liIndex}
                                    className={
                                        `flex
                                        items-center
                                        justify-center
                                        w-20 
                                        h-20 
                                        rounded-lg 
                                        bg-gradient-to-b 
                                        from-fuchsia-500
                                        shadow-lg 
                                        ${value[0] === noChar && "invisible"}`
                                    }
                                >
                                    <div key={key}>
                                        <div className={"text-4xl text-center"}>{local ? value[0] : value[1]}</div>
                                        <div className={"text-l text-center"}>{key}</div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                ))}
            </div>
        </div>
    )
}