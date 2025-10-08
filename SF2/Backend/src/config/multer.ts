import crypto from 'crypto'
import multer from 'multer';

import {extname, resolve} from 'path'

export default {
    upload(folder: string) {
        return{
            storage: multer.diskStorage({
                //Destino para onde vai as fotos salvas
                //dirname é o diretório
                destination: resolve(__dirname, '..','..', folder),

                 //Nunca se repetir nomes iguais as fotos
                filename: (request, file, callback) => {
                const fileHash = crypto.randomBytes(16).toString("hex");
                const fileName = `${fileHash}-${file.originalname}`

                    return callback(null, fileName)
 
                }
            }) 
        }
    }
}