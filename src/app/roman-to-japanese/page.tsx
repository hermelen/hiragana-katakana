"use client"

import React, {useState} from "react";
import {SyllabaryRecord, syllabaryRecord} from "@/app/lib/syllabaryRecord";
import {Radio} from "@/app/components/Radio";
import {replaceWithExistingCharacter} from "@/app/lib/replaceWithExistingCharacter";
import {
    LeftRightDialogHeader
} from "next/dist/client/components/react-dev-overlay/internal/components/LeftRightDialogHeader";
import {additionalSyllabaryRecord} from "@/app/lib/additionalSyllabaryRecords";

export default function RomanToJapanesePage() {
    const [text, setText] = useState<string>('');
    const [phonetic, setPhonetic] = useState<string>('');
    const [roman, setRoman] = useState<string>('');
    const [hiragana, setHiragana] = useState<string>('');
    const [katakana, setKatakana] = useState<string>('');
    const [local, setLocal] = useState<boolean>(true);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        const textToTranslate = getPhonetic(event.target.value)
        setPhonetic(textToTranslate);
        let matchText: [string[], string[]] = [[], []];
        const [translation, _] = getJapanese(matchText, textToTranslate, 3);
        setHiragana(translation[0].join(""));
        setKatakana(translation[1].join(""));
        const resultToRoman = getRoman(translation[0]);
        setRoman(resultToRoman);
    };

    const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocal(event.target.value === 'true');
    };

    return (
        <div className={"md:w-4/12 size-full"}>
            <div className="pt-4 pb-4 flex gap-10">
                <Radio className={"flex-1"}
                    position="right"
                    label="hiragana"
                    name="syllabary"
                    value="true"
                    checked={local}
                    onChange={handleLocalChange}
                />
                <Radio className={"flex-1"}
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
            <div>
                Phonetic: {phonetic}
            </div>
            <div>
                Roman: {roman}
            </div>
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
    );
}

function getPhonetic(value: string) {
    for (const key in replaceWithExistingCharacter) {
        if (replaceWithExistingCharacter.hasOwnProperty(key)) {
            const replacement = replaceWithExistingCharacter[key];
            value = value.replace(new RegExp(key, "g"), replacement);
        }
    }
    return value;
}

function getRoman(hiraganaArray: string[]) {
    const firstJapaneseAsKey: Record<string, string> = {};

    for (const [roman, japaneseArray] of Object.entries(syllabaryRecord)) {
        const firstJapaneseChar = japaneseArray[0];
        firstJapaneseAsKey[firstJapaneseChar] = roman;
    }
    
    const romanArray: string[] = []
    for (const hiragana of hiraganaArray) {
        romanArray.push(firstJapaneseAsKey[hiragana])
    }
    
    return romanArray.join("").replace(/u/g, "ou").replace(/e/g, "é");
}

function getJapanese(matchText: [string[], string[]], inputText: string, matchLength: number) : [[string[], string[]], string] {
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
                    const length = rest.length < 4 ? rest.length : 3;
                    return getJapanese(matchText, rest, length);
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
                    const length = rest.length < 4 ? rest.length : 3;
                    return getJapanese(matchText, rest, length);
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
                    const length = rest.length < 4 ? rest.length : 3;
                    return getJapanese(matchText, rest, length);
                }
            }
        }
    }
    return [matchText, ""];
}

function tryParse(inputText: string, length: number): [string, [string, string]] {
    const partialText = inputText.slice(0, length);
    const syllabaryRecordEnriched: SyllabaryRecord = {
        ...syllabaryRecord,
        ...additionalSyllabaryRecord

    };
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