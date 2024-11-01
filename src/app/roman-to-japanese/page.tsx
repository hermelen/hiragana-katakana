"use client"

import React, {useState} from "react";
import {syllabaryRecord} from "@/app/lib/syllabaryRecord";

export default function RomanToJapanesePage() {
    const [text, setText] = useState<string>('');
    const [hiragana, setHiragana] = useState<string>('');
    const [katakana, setKatakana] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        let matchText: [string[], string[]] = [[], []];
        const [translation, _] = getJapanese(matchText, event.target.value, 3);
        setHiragana(translation[0].join(""));
        setKatakana(translation[1].join(""));
    };

    return (
        <div className="container">
            <input
                className={"text-black"}
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Type something..."
            />
            <p>hiragana: {hiragana}</p>
            <p>katakana: {katakana}</p>
        </div>
    );
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
    return [matchText, ""];  // Final return
}

function tryParse(inputText: string, length: number): [string, [string, string]] {
    let partialText = inputText.slice(0, length);
    const matchText = syllabaryRecord[partialText];
    if (matchText) {
        const rest = inputText.slice(length);
        return [rest, matchText];
    }
    return [inputText, ["", ""]];
}

function isNotAlphabetic(value: string): boolean {
    return !/^[A-Za-z]+$/.test(value);
}