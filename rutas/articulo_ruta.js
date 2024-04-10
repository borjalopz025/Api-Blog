const ex= require('express');
const router = ex.Router()
const articuloController = require("../controladores/articulo")
const multer = require('multer');

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './imagenes/articulos/')
    },

    filename: function(req, file, cb){
        cb(null, 'articulo'+ Date.now() + file.originalname);
    }
})

const subidas = multer({storage: almacenamiento})


//  Rutas de prueba
router.get("/ruta-prueba", articuloController.test)

// Rutas
router.post('/crear', articuloController.crear);
router.get('/ver', articuloController.ver);
router.get('/uno/:id', articuloController.unArticulo);
router.delete('/borrar/:id', articuloController.borrar)
router.put('/edit/:id', articuloController.edit)
router.post("/subir-imagen", [subidas.single('file0')] ,articuloController.subir),
router.get("/imagen/:fichero", articuloController.imagen)
router.get("/buscar/:buscador", articuloController.buscador)

module.exports = router