import {Syllable} from "@/app/syllabary-table/page";
import {SyllabaryRecord} from "@/app/lib/syllabaryRecord";
import {UUID} from "node:crypto";

export const vocabularyRecord: Record<string, string> = {
    "cheerful": "あかるい",
    "sir": "さん",
    "miss": "さん",
    "person": "ひと",
    "cool": "かっこいい",
    "funny": "おもしろい",
    "bus stop": "バスてい",
    "here": "ここ",
    "where": "どこ",
    "this": "これ",
    "department store": "デパート",
    "naomi": "なおみ",
    "america": "アメリカ",
    "big": "おおきい",
    "canada": "カナダ",
    "brazil": "ブラジル",
    "england": "イギリス",
    "curry": "カレー",
    "that": "それ",
    "tasty": "おいしい",
    "hello": "こんにちは",
    "good evening": "こんばんは",
    "bye": "じゃあね",
    "see you tomorrow": "またあした",
    "doctor": "いしゃ",
    "teacher": "せんせい",
    "lawyer": "べんごし",
    "nice": "やさしい",
    "sushi": "すし",
    "please": "ください",
    "green tea": "おちゃ",
    "riz": "ごはん",
    "and": "と",
    "water": "みず",
    "hana": "はな",
    "nice to meet you": "どうぞよろしく",
    "ken": "けん",
    "my": "わたしの",
    "hat": "ぼうし",
    "umbrella": "かさ",
    "red": "あかい",
    "shoe": "くつ",
    "coat": "コート",
    "tanaka": "たなか",
    "nakayama": "なかやま",
    "these": "これら",
    "yamaguchi": "やまぐち",
    "excuse me": "すみません",
    "it is": "です",
    "it is not": "じゃないです",
    "one": "いち",
    "two": "に",
    "three": "さん",
    "four": "よん",
    "cute": "やさい",
    "yes": "はい",
    "no": "いいえ",
}

export interface Word {
    id: UUID;
    roman: string;
    hiragana?: string;
    katakana?: string;
    kanji?: string;
}

export function formatWordList(wordList: Word[]) : [string, string][] {
    const arr: [string, string][] = [];
    for (const word of wordList) {
        const translation = word.hiragana ?? word.katakana ?? word.kanji;
        if (translation) {
            arr.push([word.roman, translation]);            
        }
    }
    return arr;
}
