import {query} from "../utils/db.js"

export const allPost = (req,res)=>{
    const posts = query(
        "select * from posts"
    )
}
export const createAPost = (req,res)=>{}
export const getAspecificPost = (req,res)=>{}