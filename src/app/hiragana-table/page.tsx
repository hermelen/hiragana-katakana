"use client"

import {syllabaryRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";

export default function HiraganaTablePage() {
    type Result = Record<string, string>[];
    
    function splitRecordByValueLength(syllabaryRecord: SyllabaryRecord): Result[] {
        const result: Result[] = [];
        let currentArray: Result = [];

        for (const [key, [hiragana, katakana]] of Object.entries(syllabaryRecord)) {
            const currentItem: Record<string, string> = {[key]: hiragana};

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

    const result = splitRecordByValueLength(syllabaryRecord);


    return (
        <div className={"flex"}>
            {result.map((ul, ulIndex) => (
                <ul key={ulIndex} className="flex-col">
                    {ul.map((li, liIndex) => (
                        <li key={liIndex} className={"w-40 border-solid rounded-sm border-2 border-white"}>
                            {Object.entries(li).map(([key, value]) => (
                                <div key={key}>
                                    <div className={"text-3xl"}>{value}</div>
                                    <div className={"text-xl"}>{key}</div>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            ))}
        </div>
    )
}