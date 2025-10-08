import { Request, Response } from "express";
import { TimeOrdemDeServicoService } from "../../../../services/controles_forms/OrdemdeServico/time/timeOrdemdeServicoService";

export const timeOrdemDeServicoController = {
  async iniciar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID da ordem é obrigatório" });
    
      const ordem = await TimeOrdemDeServicoService.iniciarOrdem(id);
      return res.json(ordem);
    } catch (error: any) {
      console.error("Erro ao iniciar OS:", error);
      return res.status(500).json({ error: error.message || "Falha ao iniciar a OS" });
    }
  },

  async concluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID da ordem é obrigatório" });

      const ordem = await TimeOrdemDeServicoService.concluirOrdem(id);
      return res.json(ordem);
    } catch (error: any) {
      console.error("Erro ao concluir OS:", error);
      return res.status(500).json({ error: error.message || "Falha ao concluir a OS" });
    }
  },

  async atualizarTempo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { startedAt, endedAt } = req.body;

      if (!id) return res.status(400).json({ error: "ID da ordem é obrigatório" });

      const parsedStartedAt = startedAt ? new Date(startedAt) : undefined;
      const parsedEndedAt = endedAt ? new Date(endedAt) : undefined;

      const ordem = await TimeOrdemDeServicoService.atualizarTempo({
        ordemId: id,
        startedAt: parsedStartedAt,
        endedAt: parsedEndedAt,
      });

      return res.json(ordem);
    } catch (error: any) {
      console.error("Erro ao atualizar tempo da OS:", error);
      return res.status(500).json({ error: error.message || "Falha ao atualizar o tempo da OS" });
    }
  },

  async lerTempo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID da ordem é obrigatório" });

      const tempo = await TimeOrdemDeServicoService.lerTempo(id);
      return res.json(tempo);
    } catch (error: any) {
      console.error("Erro ao ler tempo da OS:", error);
      return res.status(500).json({ error: error.message || "Falha ao ler o tempo da OS" });
    }
  },
};
