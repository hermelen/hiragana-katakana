"use client"

import {syllabaryRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";
import React, {useState} from "react";

export default function HiraganaTablePage() {
    type Result = Record<string, [string, string]>[];
    const [local, setLocal] = useState<boolean>(true);
    
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
            }
        }

        if (currentArray.length > 0) {
            result.push(currentArray);
        }

        return result;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === 'true') {
            setLocal(true);
        }
        if (event.target.value === 'false') {
            setLocal(false);
        }
    };

    const result = splitRecordByValueLength(syllabaryRecord);


    return (
        <div>
            <div className={"pt-4 pb-4 flex justify-around"}>
                <label>
                    <span className={"mr-2"}>hiragana</span>
                    <input type="radio" name="myRadio" value="true" checked={local} onChange={handleChange}/>
                </label>
                <label>
                    <input type="radio" name="myRadio" value="false" onChange={handleChange}/>
                    <span className={"ml-2"}>katakana</span>
                </label>
            </div>
            <div className={"flex gap-4"}>
                {result.map((ul, ulIndex) => (
                    <ul key={ulIndex} className="flex flex-col gap-4">
                        {ul.map((li, liIndex) => (
                            <li key={liIndex} 
                                className={
                                    `
                                    flex
                                    items-center
                                    justify-center
                                    w-20 
                                    h-20 
                                    rounded-lg 
                                    bg-gradient-to-b 
                                    from-fuchsia-500
                                    shadow-lg 
                                    `
                                }
                            >
                                {Object.entries(li).map(([key, value]) => (
                                    <div key={key}>
                                        <div className={"text-4xl text-center"}>{local ? value[0] : value[1]}</div>
                                        <div className={"text-l text-center"}>{key}</div>
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    )
}