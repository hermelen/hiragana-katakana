"use client";

import { syllabaryRecord, SyllabaryRecord } from "@/app/lib/syllabaryRecord";
import React, { useEffect, useState } from "react";
import { SyllabaryTrapList } from "@/app/lib/syllabaryTrapsList";
import { Radio } from "@/app/components/Radio";
import { vocabularyRecord } from "@/app/lib/vocabularyRecord";

export default function VocabularyDictionaryPage() {
    const [translateData, setTranslateData] = useState<[string, string][] | null>(getRandomVocabularyTranslate());
    const [success, setSuccess] = useState<boolean>(false);
    const [text, setText] = useState<string>("");

    useEffect(() => {
        setTranslateData(getRandomVocabularyTranslate());
    }, []);

    function getRandomVocabularyTranslate(): [string, string][] {
        const translateList: [string, string][] = Object.entries(vocabularyRecord);
        return translateList.sort((a, b) => a[0].localeCompare(b[0]));
    }

    if (!translateData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"lg:w-6/12 size-full"}>
            <div className={"flex gap-4"}>
                <ul className="flex flex-col gap-4 justify-center size-full">
                    {translateData.map(val => {
                        const key = val[0];
                        const value = val[1];
                        return (
                            <li className={`flex items-center gap-5 size-full`} key={key}>
                                <div className={`text-4xl 
                                    text-center
                                    flex
                                    items-center
                                    justify-center
                                    w-80 
                                    h-10 
                                    rounded-lg 
                                    bg-gradient-to-b 
                                    shadow-lg
                                    from-fuchsia-500`}>
                                    {key}
                                </div>
                                <div
                                    className={`h-10 flex-1 rounded-lg shadow-lg text-black text-xl bg-white flex items-center justify-center`} >
                                    {value}
                                </div>
                            </li>                        
                        )
                    })}
                </ul>
            </div>
        </div>
    );
}
