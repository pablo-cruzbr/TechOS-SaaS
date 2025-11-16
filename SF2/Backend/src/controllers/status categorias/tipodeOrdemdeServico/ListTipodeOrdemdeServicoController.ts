import { Response, Request } from "express";
import { ListtipodeOrdemdeServicoService } from "../../../services/status_categorias/tipodeOrdemdeServico/ListtipodeOrdemdeServicoService";

class ListtipodeChamadoController{
    async handle (req: Request, res: Response){
        const listtipodeChamadoService = new ListtipodeOrdemdeServicoService();

        const status = await listtipodeChamadoService.execute();

        return res.json(status);
    }
}

export {ListtipodeChamadoController}