const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const app = require('./index')


console.log(process.env)

const port = 400
app.listen(port,()=>{
console.log(`listening to port ${port}`)
})
