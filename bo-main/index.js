const express = require('express')
const { json } = require('express/lib/response')
const fs = require('fs')



const app = express()

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`))


app.get('/',(req,res)=>{
res.status(201).json({
  status: 'Success',
  datacount:tours.length,
  data:tours
})
})


const port = 400
app.listen(port,()=>{
console.log(`listening to port ${port}`)
})
