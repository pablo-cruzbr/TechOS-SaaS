import { Request, Response } from "express";
import { ListOrdemdeServicoService } from "../../../services/controles_forms/OrdemdeServico/ListOrdemdeServicoService";
class ListOrdemdeServicoController{
    async handle(req: Request, res: Response){
        const service = new ListOrdemdeServicoService();
        const {controles, total, totalAberta, totalConcluida, totalEmAndamento, totalPausada} = await service.execute()
        const result = await service.execute();

        return res.json({
            result,
            controles,
            total,
            totalAberta,
            totalEmAndamento,
            totalConcluida,
            totalPausada
    });
    }
}

export {ListOrdemdeServicoController}