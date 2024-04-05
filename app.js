const ex = require('express');
const cors = require('cors');
const pg = require('pg');
const fs = require('fs')


const app = ex();
app.use(cors());
app.use(ex.json());

const pool = new pg.Pool({
    user: "postgres",
    host: "localhost", 
    database: "postgres", 
    password: "my-secret-pw", 
    port: 5437
});




// RUTAS 

const rutas = require("./rutas/articulo_ruta");

app.use("/api", rutas)

// Rutas de prueba
app.listen(7777, () =>{
    console.log('servidor desplegado');
})

app.get("/", (req,res) =>{
    res.send("Hola mundo")
})
