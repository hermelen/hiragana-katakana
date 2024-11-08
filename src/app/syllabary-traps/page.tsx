"use client"

import {syllabaryRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";
import React, {useEffect, useState} from "react";
import {SyllabaryTrapList, HiraganaTraps, KatakanaTraps} from "@/app/lib/syllabaryTraps";
import {Radio} from "@/app/components/Radio";

export default function SyllabaryTrapsPage() {
    const [trapData, setTrapData] = useState<SyllabaryRecord>({});
    const [local, setLocal] = useState<boolean>(true);
    const [textList, setTextList] = useState<string[]>([]);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTextList = [...textList];
        newTextList[index] = event.target.value;
        setTextList(newTextList);
    };

    function getTrapData(): SyllabaryRecord {
        const trapCharacters = local ? getRandomHiraganaTrap() : getRandomKatakanaTrap();
        const sourceRecord = syllabaryRecord;
        let trapData: SyllabaryRecord = {};
        const initialTextListState: string[] = [];
        for (let i = 0; i < trapCharacters.length; i++) {
            initialTextListState.push("");
            trapData[trapCharacters[i]] = sourceRecord[trapCharacters[i]];
        }
        setTextList(initialTextListState);
        return trapData;
    }

    function getRandomHiraganaTrap() {
        const trapList: SyllabaryTrapList = HiraganaTraps;
        return trapList[Math.floor(Math.random() * trapList.length)];
    }

    function getRandomKatakanaTrap() {
        const trapList: SyllabaryTrapList = KatakanaTraps;
        return trapList[Math.floor(Math.random() * trapList.length)];
    }

    useEffect(() => {
        setTrapData(getTrapData());
    }, [local]);

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
            <div className={"flex gap-4"}>
                    <ul className="flex flex-col gap-4">
                        {Object.entries(trapData).map((li, index) => {
                            const key = li[0];
                            const value = Object.values(li)[1];
                            return (
                                <li key={li[0]}
                                    className={
                                        `flex
                                        items-center`}
                                >
                                    <div key={key}>
                                        <div className={
                                            `text-4xl 
                                            text-center
                                            flex
                                            items-center
                                            justify-center
                                            w-20 
                                            h-20 
                                            rounded-lg 
                                            bg-gradient-to-b 
                                            ${textList[index] !== key && "from-red-500"}
                                            ${textList[index] === key && "from-fuchsia-500"}
                                            shadow-lg}`
                                        } title={key}>{local ? value[0] : value[1]}</div>
                                    </div>
                                    <input
                                        className={`h-7 text-center rounded-lg shadow-lg text-black text-xl`}
                                        type="text"
                                        value={textList[index]}
                                        onChange={(event) => handleInputChange(event, index)}
                                        placeholder="Type something..."
                                    />
                                </li>
                            )
                        })}
                    </ul>
            </div>
        </div>
    )
}