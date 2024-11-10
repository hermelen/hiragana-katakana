"use client";

import { syllabaryRecord, SyllabaryRecord } from "@/app/lib/syllabaryRecord";
import React, { useEffect, useState } from "react";
import { SyllabaryTrapList } from "@/app/lib/syllabaryTrapsList";
import { Radio } from "@/app/components/Radio";
import { vocabularyRecord } from "@/app/lib/vocabularyRecord";

export default function VocabularyTrainingPage() {
    const [trainingData, setTrainingData] = useState<[string, string] | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [text, setText] = useState<string>("");

    useEffect(() => {
        // Initialize trainingData on client-side only
        setTrainingData(getRandomVocabularyTraining());
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        if (trainingData) {
            setSuccess(event.target.value === trainingData[0]);
        }
    };

    function shuffleArray(array: [string, string][]): [string, string] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array[0];
    }

    function getRandomVocabularyTraining(): [string, string] {
        const trainingList: [string, string][] = Object.entries(vocabularyRecord);
        return shuffleArray(trainingList);
    }

    function reloadTraining() {
        setTrainingData(getRandomVocabularyTraining());
        setText("");
        setSuccess(false);
    }

    if (!trainingData) {
        // Render a loading state while trainingData is being set on the client
        return <div>Loading...</div>;
    }

    return (
        <div className={"md:w-6/12 size-full"}>
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
                            ${text !== trainingData[0] ? "from-red-500" : "from-fuchsia-500"}`}
                            title={trainingData[0]}
                        >
                            {trainingData[1]}
                        </div>
                        <input
                            className={`h-10 flex-1 text-center rounded-lg shadow-lg text-black text-xl`}
                            type="text"
                            value={text}
                            onChange={handleInputChange}
                            placeholder="Type something..."
                        />
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
                            bg-gradient-to-b 
                            shadow-lg                                        
                            ${!success ? "from-red-500 disabled:opacity-75" : "from-fuchsia-500"}`}
                            onClick={reloadTraining}
                            disabled={!success}
                        >
                            Other Try
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
