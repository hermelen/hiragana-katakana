import { HttpClient } from "@/api/http";
import { SyllableServiceClient } from "@/api/syllable";
import { WordServiceClient } from "@/api/word";
import { UserServiceClient } from "@/api/user";

const ApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const Http = new HttpClient(ApiUrl);
export const SyllableService = new SyllableServiceClient(Http);
export const WordService = new WordServiceClient(Http);
export const UserService = new UserServiceClient(Http);
