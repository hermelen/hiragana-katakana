"use client"

import React, {useEffect, useState} from "react";
import {Radio} from "@/app/components/Radio";
import {getJapanese, getPhonetic, getRoman} from "@/app/services/theme";
import {getSyllableList} from "@/api/http";
import {Syllable} from "@/app/syllabary-table/page";
import {getSyllableListToRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";

export default function RomanToJapanesePage() {
    const [text, setText] = useState<string>('');
    const [roman, setRoman] = useState<string>('');
    const [hiragana, setHiragana] = useState<string>('');
    const [katakana, setKatakana] = useState<string>('');
    const [local, setLocal] = useState<boolean>(true);
    const [syllableList, setSyllableList] = useState<Syllable[]>([]);
    const [syllabaryRecord, setSyllabaryRecord] = useState<SyllabaryRecord>({});
    const backendName = "rust";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    useEffect(() => {
        const fetchData = async () => {
            const response = await getSyllableList(apiUrl, backendName);
            setSyllableList(response);
        };
        fetchData();
    }, [backendName, apiUrl]);

    useEffect(() => {
        const syllableListToRecord = () => {
            setSyllabaryRecord(getSyllableListToRecord(syllableList));
        };
        syllableListToRecord();
    }, [syllableList]);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        const textToTranslate = getPhonetic(event.target.value)
        let matchText: [string[], string[]] = [[], []];
        const [translation, _] = getJapanese(syllabaryRecord, matchText, textToTranslate, 3, true);
        setHiragana(translation[0].join(""));
        setKatakana(translation[1].join(""));
        const resultToRoman = getRoman(syllabaryRecord, translation[0]);
        setRoman(resultToRoman);
    };

    const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocal(event.target.value === 'true');
    };

    return (
        <div className={"md:w-6/12 size-full"}>
            <div className="pt-4 pb-4 flex gap-10">
                <Radio className={"flex-1"}
                       position="right"
                       label="hiragana"
                       name="syllabary"
                       value="true"
                       checked={local}
                       onChange={handleLocalChange}/>
                <Radio className={"flex-1"}
                       position="left"
                       label="katakana"
                       name="syllabary"
                       value="false"
                       checked={!local}
                       onChange={handleLocalChange}/>
            </div>
            <div className={"flex gap-4"}>
                <ul className="flex flex-col gap-4 justify-center size-full">
                    <li className={`flex items-center gap-5 size-full`}>
                        <div className={`w-80 h-10`}></div>
                        <input className={`h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl`}
                               type="text"
                               value={text}
                               onChange={handleInputChange}
                               placeholder="Type something..."/>
                    </li>
                    <li className={`flex items-center gap-5 size-full`}>
                        <div
                            className={`text-xl 
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
                            {roman}
                        </div>
                        <div
                            className={`h-10 flex-1 rounded-lg shadow-lg text-black text-xl bg-white flex items-center justify-center`}>
                            {local && hiragana}
                            {!local && katakana}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}