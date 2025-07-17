import express from 'express';

// 게시물 관련 모든 API 엔드포인트를 관리하는 라우터
const router = express.Router();//라우터를 모듈화시키기 위해서

router.get("/", async (req, res)=>{
    try {
        res.status(200).json({message : "GET요청(전체) 성공했습니다."})
        console.log(`GET요청 성공`)
    } catch (error) {
        console.log(`GET요청 에러: ${error}`)
    }
});

router.get("/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        res.status(200).json({message : "GET요청(특정) 성공했습니다."})
        console.log(`GET요청 성공`)
    } catch (error) {
        console.log(`GET요청 에러: ${error}`)
    }
});

router.post("/", async (req, res)=>{
    try {
        const {} = req.body;
    } catch (error) {
        
    }
});

router.put("/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        const {} = req.body;
    } catch (error) {
        
    }
})

router.delete("/:id", async (req, res)=>{
    try {
        const {id} = req.params;
    } catch (error) {
        
    }
})
export default router;