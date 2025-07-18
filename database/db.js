import 'dotenv/config'; // dotenv.config() 안해도 됨.
import { MongoClient } from 'mongodb';

let db = null;

export const connectDB = async () => {
    try {
        if (db) {
            return db;
        }
        const MONGODB_URI = process.env.NODE_ENV === "development"? 
        process.env.MONGODB_URI_LOCAL : process.env.MONGODB_URI_ATLAS;
        const DB_NAME = process.env.DB_NAME;

        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log("🚀 MongoDB connected, MONGODB_URI: ",MONGODB_URI);
        return db = client.db(DB_NAME); //db 선택
        
    } catch (error) {
        console.log(`⚠ MongoDB Error: ${error}`);   
        process.exit(1) //강제종료     
    }
}
