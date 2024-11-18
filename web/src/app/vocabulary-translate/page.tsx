"use client";

import React, { useEffect, useState } from "react";
import {formatWordList, vocabularyRecord, Word} from "@/app/lib/vocabularyRecord";
import {getVocabularyList} from "@/api/http";
import {getSyllableListToRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";

export default function VocabularyTranslatePage() {
    const [translateData, setTranslateData] = useState<[string, string] | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [text, setText] = useState<string>("");
    const backendName = "rust";
    const [vocabularyList, setVocabularyList] = useState<Word[]>([]);
    const [vocabularyRecordList, setVocabularyRecordList] = useState<Record<string, string>>({});
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    useEffect(() => {
        const fetchData = async () => {
            const response = await getVocabularyList(apiUrl, backendName);
            setVocabularyList(response);
        };
        fetchData();
    }, [backendName, apiUrl]);

    useEffect(() => {
        setTranslateData(getRandomVocabularyTranslate());
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        if (translateData) {
            setSuccess(event.target.value === translateData[0]);
        }
    };

    function shuffleArray(array: [string, string][]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        const getTrainingData = () => {
            if (vocabularyList.length === 0) {
                return <div>Loading...</div>;
            }
            const trainingList: [string, string][] = formatWordList(vocabularyList);
            const trainingCharacters = shuffleArray(trainingList);
            let trainingData: SyllabaryRecord = {};
            const initialTextListState: string[] = [];
            for (let i = 0; i < trainingCharacters.length; i++) {
                if (initialTextListState.length < 10) {
                    const basicData = trainingCharacters[i][1][0].length === 1;
                    const advancedData = trainingCharacters[i][1][0].length === 2;
                    if (basicData) {
                        initialTextListState.push("");
                        trainingData[trainingCharacters[i][0]] = trainingCharacters[i][1];
                    }
                    if (advancedData) {
                        initialTextListState.push("");
                        trainingData[trainingCharacters[i][0]] = trainingCharacters[i][1];
                    }
                }
            }
            setTextList(initialTextListState);
            setTrainingData(trainingData);
        };
        getTrainingData();
    }, [vocabularyList]);

    function getRandomVocabularyTranslate(): [string, string] {
        const translateList: [string, string][] = Object.entries(vocabularyRecord);
        return shuffleArray(translateList);
    }

    function reloadTranslate() {
        setTranslateData(getRandomVocabularyTranslate());
        setText("");
        setSuccess(false);
    }

    if (!translateData) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"lg:w-6/12 size-full"}>
            <div className={"flex gap-4"}>
                <ul className="flex flex-col gap-4 justify-center size-full">
                    <li className={`flex items-center gap-5 size-full`}>
                        <div
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
                            ${text !== translateData[0] ? "from-red-500" : "from-fuchsia-500"}`}
                            title={translateData[0]}>
                            {translateData[1]}
                        </div>
                        <input
                            className={`h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl size-full`}
                            type="text"
                            value={text}
                            onChange={handleInputChange}
                            placeholder="Type something..."/>
                    </li>
                    <li className={`flex items-center gap-5 size-full`}>
                        <div className={`w-80 h-10`}></div>
                        <button
                            className={`h-10 
                            size-full
                            flex-1 
                            text-xl 
                            text-center
                            flex
                            items-center
                            justify-center
                            rounded-lg 
                            bg-gradient-to-b 
                            shadow-lg                                        
                            ${!success ? "from-red-500 disabled:opacity-75" : "from-fuchsia-500"}`}
                            onClick={reloadTranslate}
                            disabled={!success}>
                            Other Try
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
