import express from 'express'
import env from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import allPost from './routes/allpost.route.js'
env.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(helmet())
const PORT = process.env.PORT
// routes
app.use('/api/v1',allPost)

app.listen(PORT,()=>{
    console.log(`Server is listening on the port ${PORT}`)
})