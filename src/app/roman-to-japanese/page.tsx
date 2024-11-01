"use client"

import React, {useState} from "react";
import {syllabaryRecord} from "@/app/lib/syllabaryRecord";
import {Radio} from "@/app/components/Radio";

export default function RomanToJapanesePage() {
    const [text, setText] = useState<string>('');
    const [phonetic, setPhonetic] = useState<string>('');
    const [hiragana, setHiragana] = useState<string>('');
    const [katakana, setKatakana] = useState<string>('');
    const [local, setLocal] = useState<boolean>(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        setPhonetic(getPhonetic(event.target.value));
        let matchText: [string[], string[]] = [[], []];
        const [translation, _] = getJapanese(matchText, event.target.value, 3);
        setHiragana(translation[0].join(""));
        setKatakana(translation[1].join(""));
    };

    const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocal(event.target.value === 'true');
    };

    return (
        <div className={"md:w-4/12 size-full"}>
            <div className="pt-4 pb-4 flex justify-around">
                <Radio
                    position="right"
                    label="hiragana"
                    name="syllabary"
                    value="true"
                    checked={local}
                    onChange={handleLocalChange}
                />
                <Radio
                    position="left"
                    label="katakana"
                    name="syllabary"
                    value="false"
                    checked={!local}
                    onChange={handleLocalChange}
                />
            </div>
            <div className={
                `flex
                items-center
                justify-center
                h-20`
            }>
                <input className={
                    `text-center
                    rounded-lg 
                    shadow-lg 
                    text-black
                    text-xl
                    `
                }
                       type="text"
                       value={text}
                       onChange={handleInputChange}
                       placeholder="Type something..."
                />
            </div>
            {/*<div>*/}
            {/*    {phonetic}*/}
            {/*</div>*/}
            <div className={
                `flex
                items-center
                justify-center
                h-20 
                rounded-lg 
                bg-gradient-to-b 
                from-fuchsia-500
                shadow-lg 
                text-4xl 
                text-center`
            }>
                {local && hiragana}
                {!local && katakana}
            </div>
        </div>
    )
        ;
}

function getPhonetic(value: string) {
    return value.replace(/au/g, "o");
}

function getJapanese(matchText: [string[], string[]], inputText: string, matchLength: number) {
    if (inputText.length === 0) {
        return [matchText, ""];
    }
    let processText = inputText.slice();
    if (matchLength === 3) {
        if (processText.length >= matchLength) {
            const [rest, translation] = tryParse(processText, 3);
            const [hiraganaSyllabary, katakanaSyllabary] = translation;
            if (hiraganaSyllabary && katakanaSyllabary) {
                matchText[0].push(hiraganaSyllabary);
                matchText[1].push(katakanaSyllabary);
                if (rest !== "") {
                    return getJapanese(matchText, rest, 3);
                } else {
                    return [matchText, rest];
                }
            }
        }
        return getJapanese(matchText, inputText, 2);
    } else if (matchLength === 2) {
        if (processText.length >= matchLength) {
            const [rest, translation] = tryParse(processText, 2);
            const [hiraganaSyllabary, katakanaSyllabary] = translation;
            if (hiraganaSyllabary && katakanaSyllabary) {
                matchText[0].push(hiraganaSyllabary);
                matchText[1].push(katakanaSyllabary);
                if (rest !== "") {
                    return getJapanese(matchText, rest, 3);
                } else {
                    return [matchText, rest];
                }
            }
        }
        return getJapanese(matchText, inputText, 1);
    } else if (matchLength === 1) {
        if (processText.length >= matchLength) {
            const [rest, translation] = tryParse(processText, 1);
            const [hiraganaSyllabary, katakanaSyllabary] = translation;
            if (hiraganaSyllabary !== "" && katakanaSyllabary !== "") {
                matchText[0].push(hiraganaSyllabary);
                matchText[1].push(katakanaSyllabary);
                if (rest !== "") {
                    return getJapanese(matchText, rest, 3);
                }
            }
        }
    }
    return [matchText, ""];
}

function tryParse(inputText: string, length: number): [string, [string, string]] {
    const partialText = inputText.slice(0, length);
    const syllabaryRecordEnriched = { ...syllabaryRecord, " ": [" ", " "] };
    const matchText = syllabaryRecordEnriched[partialText];
    if (matchText) {
        const rest = inputText.slice(length);
        return [rest, matchText];
    }
    return [inputText, ["", ""]];
}

function isNotAlphabetic(value: string): boolean {
    return !/^[A-Za-z]+$/.test(value);
}