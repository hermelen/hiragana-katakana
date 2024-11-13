"use client";

import { syllabaryRecord, SyllabaryRecord } from "@/app/lib/syllabaryRecord";
import React, { useEffect, useState } from "react";
import { SyllabaryTrapList } from "@/app/lib/syllabaryTrapsList";
import { Radio } from "@/app/components/Radio";
import { vocabularyRecord } from "@/app/lib/vocabularyRecord";
import {getJapanese, getPhonetic, getRoman} from "@/app/services/theme";

export default function VocabularyThemePage() {
    const [themeData, setThemeData] = useState<[string, string] | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const [hiragana, setHiragana] = useState<string>('');
    const [katakana, setKatakana] = useState<string>('');

    useEffect(() => {
        setThemeData(getRandomVocabularyTheme());
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        let matchText: [string[], string[]] = [[], []];
        const [translation, _] = getJapanese(matchText, event.target.value, 3, false);
        setHiragana(translation[0].join(""));
        setKatakana(translation[1].join(""));
    };

    function shuffleArray(array: [string, string][]): [string, string] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array[0];
    }

    function getRandomVocabularyTheme(): [string, string] {
        const themeList: [string, string][] = Object.entries(vocabularyRecord);
        return shuffleArray(themeList);
    }

    function reloadTheme() {
        setThemeData(getRandomVocabularyTheme());
        setText("");
        setHiragana("");
        setKatakana("");
        setSuccess(false);
    }

    if (!themeData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"md:w-6/12 size-full"}>
            <div className={"flex gap-4"}>
                <ul className="flex flex-col gap-4 justify-center size-full">
                    <li className={`flex items-center gap-5 size-full`}>
                        <div title={themeData[1]}
                            className={`text-4xl 
                            text-center
                            flex
                            items-center
                            justify-center
                            w-80 
                            h-10 
                            rounded-lg 
                            bg-gradient-to-b 
                            shadow-lg
                            ${hiragana !== themeData[1] && katakana !== themeData[1] ? "from-red-500" : "from-fuchsia-500"}`}>
                            {themeData[0]}
                        </div>
                        <input
                            className={`h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl`}
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
                            shadow-lg
                            bg-gradient-to-b 
                            ${hiragana === themeData[1] ? "from-fuchsia-500" : "from-red-500"}`}>
                            hiragana
                        </div>
                        <div
                            className={`h-10 flex-1 rounded-lg shadow-lg text-black text-xl bg-white flex items-center justify-center`} >
                            {hiragana}
                        </div>
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
                            shadow-lg
                            bg-gradient-to-b 
                            ${katakana === themeData[1] ? "from-fuchsia-500" : "from-red-500"}`} >
                            katakana
                        </div>
                        <div
                            className={`h-10 flex-1 rounded-lg shadow-lg text-black text-xl bg-white flex items-center justify-center`} >
                            {katakana}
                        </div>
                    </li>
                    <li className={`flex items-center gap-5 size-full`}>
                        <div className={`w-80 h-10`}></div>
                        <button
                            className={`h-10 
                            flex-1 
                            text-xl 
                            text-center
                            flex
                            items-center
                            justify-center
                            rounded-lg 
                            shadow-lg                                        
                            bg-gradient-to-b 
                            ${hiragana !== themeData[1] && katakana !== themeData[1] ? "from-red-500 disabled:opacity-75" : "from-fuchsia-500"}`}
                            onClick={reloadTheme}
                            disabled={hiragana !== themeData[1] && katakana !== themeData[1]}>
                            Other Try
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
