"use client"

import {syllabaryRecord, SyllabaryRecord} from "@/app/lib/syllabaryRecord";
import React, {useState} from "react";
import {HiraganaTrapList, HiraganaTraps} from "@/app/lib/hiraganaTraps";

export default function SyllabaryTrapsPage() {

    function getTrapData() {
        const trapCharacters = getRandomTrap();
        const sourceRecord = syllabaryRecord;
        let trapData: SyllabaryRecord = {};
        for (let i = 0; i < trapCharacters.length; i++) {
            trapData[trapCharacters[i]] = sourceRecord[trapCharacters[i]];
        }
        return trapData;
    }

    function getRandomTrap() {
        const trapList: HiraganaTrapList = HiraganaTraps;
        return trapList[Math.floor(Math.random() * trapList.length)];
    }

    const trapData = getTrapData();
    console.log(trapData);
    
    return (
        <div className={"flex gap-4"}>
        </div>
    )
}