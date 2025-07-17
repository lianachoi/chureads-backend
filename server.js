import express from "express";
import dotenv from "dotenv";
import { testTagGenerate } from "./services/tagService.js";

//환경변수 로드
dotenv.config(); // 전역으로 로드-> 모든 js모듈 내에서 접근 가능

const app = express();
const PORT = process.env.PORT;
const OPENAI_API_KEY=process.env.OPENAI_API_KEY;

app.listen(PORT,()=>{
    console.log("Server running at...", PORT);
    console.log("🚀 ~ OPENAI_API_KEY:", OPENAI_API_KEY)
    testTagGenerate();
})