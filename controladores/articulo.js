const pool = require('../basedatos/db')
const fs = require('fs')
const path = require('path')


const test = (req,res) =>{
    return res.send('soy una accion de prueba')
}


const crear = async (req, res) => {
    try {
      // Verificar que req.body no sea undefined y que tenga las propiedades esperadas
      if (!req.body || !req.body.titulo || !req.body.contenido || !req.body.fecha_publicacion || !req.body.imagen_url) {
        return res.status(400).json({ error: true, mensaje: 'Faltan campos obligatorios en la solicitud' });
      }
  
      let arti = "INSERT INTO articulo (titulo, contenido, fecha_publicacion, imagen_url) VALUES ($1, $2, $3, $4)";
      let values = [req.body.titulo, req.body.contenido, req.body.fecha_publicacion, req.body.imagen_url];
  
      try {
        let result = await pool.query(arti, values);
        console.log(result);
        res.status(500).json({ error: false, mensaje: 'Datos insertados correctamente' });
      
      } catch(err) {
        console.log(err);
        res.status(500).json({ error: true, mensaje: 'Error al insertar en la base de datos' });
      }
    } catch(err) {
      console.log(err);
      res.status(500).json({ error: true, mensaje: 'Error interno del servidor' });
    }
};
  

const ver = async(req,res) =>{
    try {
        // Consulta SQL para seleccionar todos los artículos
        let sql = 'SELECT * FROM articulo';

        // Ejecutar la consulta utilizando pool.query
        let result = await pool.query(sql);

        // Verificar si hay resultados
        if (result.rows.length === 0) {
            res.status(404).json({ error: true, codigo: 404, mensaje: 'No se encontraron artículos' });
        } else {
            res.status(200).json({ error: false, codigo: 200, mensaje: 'Artículos encontrados', data: result.rows });
        } 
    }catch (e) {
        res.send({mensaje: 'Hay un error'+ e, error: true})
    }
}

const unArticulo = async (req, res) => {
    try {
        const id = parseInt(req.query.id);


        let sql = 'SELECT * FROM articulo WHERE id = $1';

        console.log(id);

        const result = await pool.query(sql, [id]); 

        if (result.rows.length === 0) {
            return res.status(404).json({ mensaje: "No se encontró ningún artículo con el ID proporcionado", error: true });
        }

        res.status(200).json({ mensaje: result.rows[0], error: false }); // Seleccionar el primer resultado

    } catch (e) {
        return res.status(404).json({ mensaje: "Hay un error " + e, error: true });
    }
}

const borrar = async (req, res) => {
    try {
        const id = req.params.id;
        let sql = "DELETE FROM articulo WHERE id = $1";

        console.log(id);

        let{ result } = await pool.query(sql, [id]);

        res.status(200).json({ mensaje: 'Se ha borrado sin ningún problema'+ result, error: false });
    } catch (e) {
        res.status(400).json({ mensaje: 'Hay un error ' + e, error: true });
    }
};

const edit = async (req, res) =>{
    try {
        if (!req.body || !req.body.id || !req.body.titulo || !req.body.contenido || !req.body.fecha_publicacion || !req.body.imagen_url) {
            return res.status(400).json({ error: true, mensaje: 'Faltan campos obligatorios en la solicitud' });
        }

        // Construir la consulta SQL para actualizar el artículo
        let sql = `UPDATE articulo 
                   SET titulo = $1, contenido = $2, fecha_publicacion = $3, imagen_url = $4 
                   WHERE id = $5`;
        let values = [req.body.titulo, req.body.contenido, req.body.fecha_publicacion, req.body.imagen_url, req.body.id];

        // Ejecutar la consulta SQL
        await pool.query(sql, values);

        res.status(200).json({ error: false, mensaje: 'Artículo actualizado correctamente' });
    
    } catch (e) {
        res.status(400).json({mensaje:'Hay un error '+ e, error: true})
    }
}

const subir = async (req,res) =>{

    if(!req.file && !req.file){
        return res.status(404).json({
            status: 'error',
            mensaje: 'Petición invalida'
        })
    }

    let nombreArchivo = req.file.originalname;

    let archivo_split = nombreArchivo.split("\.");
    let extension = archivo_split[1]

    if( extension |= 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif'){
        fs.unlink(req.file.path, (e) =>{
            return res.status(400).json({
                status: 'error',
                mensaje: 'Imagen invalida'
            })
        })
    }else {

        let sql = `UPDATE articulo 
        SET  imagen_url = $1
        WHERE id = $2`;

        let values = [ req.file.filename , req.body.id];

        // Ejecutar la consulta SQL
        await pool.query(sql, values);

         return res.status(200).json({
            error: false, 
            sql: sql,
            articulo: values,
            file: req.file
         });

    }

}

const imagen =  (req,res) =>{

    let fichero = req.params.fichero;

    const rutaImagen = './imagenes/articulos/'

    let ruta_fisica = rutaImagen + fichero;

    fs.stat(ruta_fisica, (err) => {
        if (!err) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                error: true,
                mensaje: 'Imagen no existe ' + err
            });
        }
    });
}


const buscador = async (req,res) => {

    let buscador = req.params.buscador
    console.log(buscador)

    try {
        const query = {
            text: `SELECT * FROM articulo WHERE titulo ILIKE $1 OR contenido ILIKE $1`,
            values: [`%${buscador}%`]
        };
    
        const result = await pool.query(query);
    

        return res.status(200).json({
            mensaje: "Se ha encontrado con exito",
            articulos: result.rows,
            values: query.values,
            error: false
            
        })
    } catch (error) {
        console.error('Error al buscar artículos:', error);
        throw error; // Puedes manejar el error según tu necesidad
    }
  };



module.exports = {
    test,
    crear,
    ver, 
    unArticulo,
    borrar,
    edit,
    subir,
    imagen,
    buscador
}