import {japaneseRecord} from './JapaneseRecord';

import React, { useState } from 'react';

function getJapanese(inputText: string) {
    let hiraganaArray: string[] = [];
    let katakanaArray: string[] = [];
    let partialText = ""
    for (let i = 0; i < inputText.length; i++) {
        partialText += inputText[i].toLowerCase();
        if (isNotAlphabetic(partialText)) {
            hiraganaArray.push(partialText);
            katakanaArray.push(partialText);
            partialText = "";
        }
        if (japaneseRecord[partialText]) {
            hiraganaArray.push(japaneseRecord[partialText][0]);
            katakanaArray.push(japaneseRecord[partialText][1]);
            partialText = "";
        }
    }
    return [hiraganaArray.join(""), katakanaArray.join("")];
}

function HiraganaPage() {
    const [text, setText] = useState<string>('');
    const [hiragana, setHiragana] = useState<string>('');
    const [katakana, setKatakana] = useState<string>('');
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        const [hiraganaTranslation, katakanaTranslation] = getJapanese(event.target.value);
        setHiragana(hiraganaTranslation);
        setKatakana(katakanaTranslation);
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={handleChange} // Listen to input changes
                placeholder="Type something..."
            />
            <p>{hiragana}</p>
            <p>{katakana}</p>
        </div>
    );
}

function isNotAlphabetic(value: string): boolean {
    // The regex /^[A-Za-z]+$/ matches a string that contains only alphabetic characters
    return !/^[A-Za-z]+$/.test(value);
}

export default HiraganaPage;