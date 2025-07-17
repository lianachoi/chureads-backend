import express from "express";
import dotenv from "dotenv";
import { testTagGenerate } from "./services/tagService.js";
import postsRouter from "./routes/posts.js";


//환경변수 로드
dotenv.config(); // 전역으로 로드-> 모든 js모듈 내에서 접근 가능

const app = express();
const PORT = process.env.PORT;
const OPENAI_API_KEY=process.env.OPENAI_API_KEY;

//json 파싱 설정
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//router middleware 등록 - express에서 라우터 등록
// /posts , /posts/:id 등
app.use("/posts", postsRouter);

app.listen(PORT,()=>{
    console.log("Server running at...", PORT);
    console.log("🚀 ~ OPENAI_API_KEY:", OPENAI_API_KEY)
    //testTagGenerate();
})