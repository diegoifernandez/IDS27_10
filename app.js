const express = require ('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/saludo', (request,response)=>{
    response.json({mensaje: 'hola desde mi app DF'})


})

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)

})
