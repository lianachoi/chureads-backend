import express from 'express';
import { connectDB } from '../database/db.js';
import { ObjectId } from 'mongodb';
import { createTagPrompt, generateTags } from '../services/tagService.js';
import { broadcastToClients } from '../sse/sseManager.js';

// 게시물 관련 모든 API 엔드포인트를 관리하는 라우터
const router = express.Router();//라우터를 모듈화시키기 위해서

let collection;

export const init = (db) =>{
    collection = db.collection("posts");
}

router.get("/", async (req, res)=>{
    try {
        const posts = await collection.find().toArray(); //document 가져오기 - toArray 지정해야 한번에 다 가져옴
        res.status(200).json(posts);
        console.log(`GET요청 성공`)
    } catch (error) {
        console.log(`GET요청 에러: ${error}`)
    }
});

router.get("/:id", async (req, res)=>{
    try {
        const id = req.params;
        const post = await collection.findOne(
            {
                _id: new ObjectId(id)
            }, 
        );
        res.status(200).json(post);
        console.log(`GET요청 성공`)
    } catch (error) {
        console.log(`GET요청 에러: ${error}`)
    }
});

router.post("/", async (req, res)=>{
    try {
        const post = req.body;
        const tagArr = await generateTags(post.content);
        const result = await collection.insertOne({
            ...post,
            tags: tagArr,
            likeCount: 0,
            likedUsers: [], //좋아요 한 UserID목록
            createdAt: new Date(),
        });    
        //새 게시물 알림을 모든 클라이언트에게 전송
        broadcastToClients("newPost", {
            postId: result.insertedId,
            userName: post.userName,
            content: post.content.substring(0,20)+(post.content.length > 20? "...":""),
            createdAt: post.createdAt,
            message: `${post.userName}이 새 글을 작성했습니다!`
        })    
        console.log("🚀 ~ router.post ~ post:", post)
        res.status(200).json({...result, tagArr });
    } catch (error) {
        res.status(500).json(error);       
        console.log("🚀 ~ failed")
    }
});

router.put("/:id", async (req, res)=>{
    try {
        const id = req.params;
        const {content, likeCount, likedUsers, createdAt} = req.body;
        
        const result = await collection.updateOne({
            _id: new ObjectId(id)
        }, {$set: {content: content,updatedAt: new Date()}});
        
        if(result.matchedCount == 0) {
            res.status(404).json({
                "message": "There is no matched post."
            })
        }
        res.status(201).json(result);
    } catch (error) {
        console.log(`⚠ update Error: ${error}`);
        res.status(500).json({
            message: "Error update post",
            error: error.message
        });        
    }
})

router.delete("/:id", async (req, res)=>{
    try {
        const {id} = req.params;
        const result = await collection.deleteOne({
            _id: new ObjectId(id)
        });

        if(result.deletedCount){
            res.status(200).json({
                message:`${result.deletedCount} row(s) has been deleted`,
                id
            });
            return;
        }
        res.status(404).json({
            message:"No post has been deleted"
        });
    } catch (error) {
        res.status(500).json({
            message:"Error delete post",
            error: error.message
        });
    }
})
export default router;