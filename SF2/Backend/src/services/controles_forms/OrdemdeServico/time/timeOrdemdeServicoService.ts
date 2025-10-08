import prismaClient from "../../../../prisma";

interface UpdateTempoInput {
  ordemId: string;
  startedAt?: Date;
  endedAt?: Date;
}

export const TimeOrdemDeServicoService = {
  async iniciarOrdem(ordemId: string) {
    const ordem = await prismaClient.ordemdeServico.findUnique({ where: { id: ordemId } });   
    if (!ordem) throw new Error("Ordem não encontrada");

    if (ordem.startedAt) return ordem;

    const statusEmAndamento = await prismaClient.statusOrdemdeServico.findFirst({
      where: { name: "EM ANDAMENTO" },
    });

    return prismaClient.ordemdeServico.update({
      where: { id: ordemId },
      data: { 
        startedAt: new Date(), 
        endedAt: null, 
        duracao: 0,
        ...(statusEmAndamento
          ? { statusOrdemdeServico: { connect: { id: statusEmAndamento.id } } }
          : {}),
      }, 
      include: { statusOrdemdeServico: true },
    });
  },

  async concluirOrdem(ordemId: string) {
    const ordem = await prismaClient.ordemdeServico.findUnique({ where: { id: ordemId } });
    if (!ordem) throw new Error("Ordem não encontrada");

    if (!ordem.startedAt) throw new Error("OS ainda não foi iniciada");

    const now = new Date();
    const duracaoTotal = Math.floor((now.getTime() - ordem.startedAt.getTime()) / 1000);

    const statusConcluida = await prismaClient.statusOrdemdeServico.findFirst({
      where: { name: "CONCLUIDA" },
    });

    if (!statusConcluida) throw new Error("Status 'CONCLUIDA' não encontrado");

    return prismaClient.ordemdeServico.update({
      where: { id: ordemId },
      data: { 
        endedAt: now, 
        duracao: duracaoTotal,
        statusOrdemdeServico: { connect: { id: statusConcluida.id } },
      },
      include: { statusOrdemdeServico: true }, 
    });
  },

  async atualizarTempo({ ordemId, startedAt, endedAt }: UpdateTempoInput) {
    const ordem = await prismaClient.ordemdeServico.findUnique({ where: { id: ordemId } });
    if (!ordem) throw new Error("Ordem não encontrada");

    let duracaoTotal = 0;
    const start = startedAt ?? ordem.startedAt;
    const end = endedAt ?? ordem.endedAt ?? new Date();

    if (start) {
      duracaoTotal = Math.floor((end.getTime() - start.getTime()) / 1000);
    }

    return prismaClient.ordemdeServico.update({
      where: { id: ordemId },
      data: {
        startedAt: start,
        endedAt: endedAt ?? ordem.endedAt,
        duracao: duracaoTotal,
      },
    });
  },

  async lerTempo(ordemId: string) {
    const ordem = await prismaClient.ordemdeServico.findUnique({
      where: { id: ordemId },
      select: { startedAt: true, endedAt: true, duracao: true },
    });

    if (!ordem) throw new Error("Ordem não encontrada");
    return ordem;
  },
};
