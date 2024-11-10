"use client"

import {syllabaryRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";
import React, {useEffect, useState} from "react";
import {SyllabaryTrapList} from "@/app/lib/syllabaryTrapsList";
import {Radio} from "@/app/components/Radio";
import {vocabularyRecord} from "@/app/lib/vocabularyRecord";

export default function SyllabaryTrainingPage() {
    const [trainingData, setTrainingData] = useState<SyllabaryRecord>({});
    const [local, setLocal] = useState<boolean>(true);
    const [basic, setBasic] = useState<boolean>(true);
    const [success, setSuccess] = useState<boolean>(false);
    const [textList, setTextList] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTextList = [...textList];
        newTextList[index] = event.target.value;
        setTextList(newTextList);
        setSuccess(computeSuccess(newTextList));
    };

    function computeSuccess(sourceList: string[]) {
        const targetList = Object.entries(trainingData).map((val => val[0]));
        for (let i = 0; i < targetList.length; i++) {
            if (sourceList[i] !== targetList[i]) {
                return false;
            }
        }
        return true;
    }

    function getTrainingData(): SyllabaryRecord {
        const trainingCharacters = getRandomVocabularyTraining();
        const sourceRecord = syllabaryRecord;
        let trainingData: SyllabaryRecord = {};
        const initialTextListState: string[] = [];
        for (let i = 0; i < trainingCharacters.length; i++) {
            if (initialTextListState.length < 10) {
                const basicData = basic && sourceRecord[trainingCharacters[i]][0].length === 1;
                const advancedData = !basic && sourceRecord[trainingCharacters[i]][0].length === 2;
                if (basicData) {
                    console.log(basicData);
                    initialTextListState.push("");
                    trainingData[trainingCharacters[i]] = sourceRecord[trainingCharacters[i]];
                }
                if (advancedData) {
                    console.log(advancedData);
                    initialTextListState.push("");
                    trainingData[trainingCharacters[i]] = sourceRecord[trainingCharacters[i]];
                }
            }
        }
        setTextList(initialTextListState);
        return trainingData;
    }

    function shuffleArray(array: string[][]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomVocabularyTraining() {
        const trainingList: string[][] = Object.entries(vocabularyRecord).map((val => [val[0], val[1]]));
        return shuffleArray(trainingList)[0];
    }

    function reloadTraining() {
        setTrainingData(getTrainingData())
    }

    useEffect(() => {
        setTrainingData(getTrainingData());
    }, [local, basic]);

    const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocal(event.target.value === 'true');
    };

    const handleBasicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBasic(event.target.value === 'true');
    };

    return (
        <div className={"md:w-4/12 size-full"}>
            <div className="pt-4 pb-4 flex gap-10">
                <Radio className={"flex-1"}
                    position="right"
                    label="hiragana"
                    name="hiragana"
                    value="true"
                    checked={local}
                    onChange={handleLocalChange}
                />
                <Radio className={"flex-1"}
                    position="left"
                    label="katakana"
                    name="katakana"
                    value="false"
                    checked={!local}
                    onChange={handleLocalChange}
                />
            </div>
            <div className="pt-4 pb-4 flex gap-10">
                <Radio className={"flex-1"}
                    position="right"
                    label="basic"
                    name="basic"
                    value="true"
                    checked={basic}
                    onChange={handleBasicChange}
                />
                <Radio className={"flex-1"}
                    position="left"
                    label="advanced"
                    name="advanced"
                    value="false"
                    checked={!basic}
                    onChange={handleBasicChange}
                />
            </div>
            <div className={"flex gap-4"}>
                <ul className="flex flex-col gap-4 justify-center size-full">
                    {Object.entries(trainingData).map((li, index) => {
                        const key = li[0];
                        const value = Object.values(li)[1];
                        const match = textList[index] === key;
                        return (
                            <li key={li[0]}
                                className={`flex items-center gap-5`}>
                                <div key={key}>
                                    <div className={
                                        `text-4xl 
                                        text-center
                                        flex
                                        items-center
                                        justify-center
                                        w-20 
                                        h-10 
                                        rounded-lg 
                                        bg-gradient-to-b 
                                        shadow-lg
                                        ${!match && "from-red-500"}
                                        ${match && "from-fuchsia-500"}`
                                    } title={key}>{local ? value[0] : value[1]}</div>
                                </div>
                                <input
                                    className={`h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl`}
                                    type="text"
                                    value={textList[index]}
                                    onChange={(event) => handleInputChange(event, index)}
                                    placeholder="Type something..."
                                />
                            </li>
                        )
                    })}
                    <li className={`flex items-center gap-5`}
                    >
                        <div className={`w-20 h-10`}></div>
                        <button className={
                            `h-10 
                            flex-1 
                            text-xl 
                            text-center
                            flex
                            items-center
                            justify-center
                            w-20 
                            h-10 
                            rounded-lg 
                            bg-gradient-to-b 
                            shadow-lg                                        
                            ${!success && "from-red-500 disabled:opacity-75"}
                            ${success && "from-fuchsia-500"}`}
                                onClick={reloadTraining}
                                disabled={!success}>
                            Other Try
                        </button>
                    </li>
                </ul>
            </div>

        </div>
    )
}