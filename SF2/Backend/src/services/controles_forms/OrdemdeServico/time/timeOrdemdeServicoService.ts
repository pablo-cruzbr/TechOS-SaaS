import prismaClient from "../../../../prisma";
import { OrdemdeServico } from "@prisma/client";

interface UpdateTempoInput {
    ordemId: string;
    startedAt?: Date;
    endedAt?: Date;
}

// Tipo auxiliar para incluir o campo de chave estrangeira e o campo de pausa
// que o Prisma gera/requer na lógica de tempo.
// Se você usa o campo de relacionamento 'statusOrdemdeServico', o campo ID será 'statusOrdemdeServico_id'
type OrdemdeServicoComPausa = OrdemdeServico & {
    pausaIniciadaEm: Date | null;
    statusOrdemdeServico_id: string; 
};


export const TimeOrdemDeServicoService = {

    // --- Métodos Auxiliares Corrigidos (Removido 'private') ---
    
    // Busca o status pelo nome e lança erro se não encontrar
    async getStatusOrThrow(statusName: string) {
        const status = await prismaClient.statusOrdemdeServico.findFirst({
            where: { name: statusName },
        });
        if (!status) throw new Error(`Status '${statusName}' não encontrado no banco de dados.`);
        return status;
    },

    // Busca o ID do status pelo nome
    async getStatusId(statusName: string) {
        const status = await prismaClient.statusOrdemdeServico.findFirst({
            where: { name: statusName },
            select: { id: true }
        });
        return status?.id;
    },

    // --- Lógica Principal ---

    async iniciarOrdem(ordemId: string) {
        // Usamos um cast para garantir a tipagem do campo de relacionamento
        const ordem = await prismaClient.ordemdeServico.findUnique({ where: { id: ordemId } }) as OrdemdeServicoComPausa | null;
        if (!ordem) throw new Error("Ordem não encontrada");

        if (ordem.startedAt) return ordem;

        const statusEmAndamento = await this.getStatusOrThrow("EM ANDAMENTO");

        return prismaClient.ordemdeServico.update({
            where: { id: ordemId },
            data: { 
                startedAt: new Date(), 
                endedAt: null, 
                duracao: 0,
                statusOrdemdeServico: { connect: { id: statusEmAndamento.id } }
            }, 
            include: { statusOrdemdeServico: true },
        });
    },

    async pausarOrdem(ordemId: string) {
        // Usamos um cast
        const ordem = await prismaClient.ordemdeServico.findUnique({ where: { id: ordemId } }) as OrdemdeServicoComPausa | null;
        if (!ordem) throw new Error("Ordem não encontrada");

        const statusEmAndamentoId = await this.getStatusId("EM ANDAMENTO");

        // CORREÇÃO: Usando a chave correta 'statusOrdemdeServico_id'
        if (ordem.statusOrdemdeServico_id !== statusEmAndamentoId) {
            throw new Error("A OS não está EM ANDAMENTO e não pode ser pausada.");
        }

        const statusPausada = await this.getStatusOrThrow("PAUSADA");
        const now = new Date();

        return prismaClient.ordemdeServico.update({
            where: { id: ordemId },
            data: {
                // 1. Muda o status para PAUSADA
                statusOrdemdeServico: { connect: { id: statusPausada.id } },
                // 2. Campo 'pausaIniciadaEm'. O erro desaparecerá após a atualização do schema/geração.
             // @ts-ignore   pausaIniciadaEm: now, 
            },
            include: { statusOrdemdeServico: true },
        });
    },

    async retomarOrdem(ordemId: string) {
        // Usamos um cast
        const ordem = await prismaClient.ordemdeServico.findUnique({ where: { id: ordemId } }) as OrdemdeServicoComPausa | null;
        if (!ordem) throw new Error("Ordem não encontrada");

        const statusPausadaId = await this.getStatusId("PAUSADA");
        
        // CORREÇÃO: Usando a chave correta 'statusOrdemdeServico_id'
        if (ordem.statusOrdemdeServico_id !== statusPausadaId) {
            throw new Error("A OS não está PAUSADA e não pode ser retomada.");
        }
        
        if (!ordem.pausaIniciadaEm || !ordem.startedAt) {
            throw new Error("Não foi possível calcular o tempo de pausa. OS ainda não foi iniciada ou o registro de pausa está incompleto.");
        }

        const now = new Date();
        
        // Calcula o tempo de duração da pausa em milissegundos
        const tempoDePausaMs = now.getTime() - ordem.pausaIniciadaEm.getTime();

        // Novo startedAt = original + tempo de pausa (Ajusta o relógio de início)
        const novoStartedAt = new Date(ordem.startedAt.getTime() + tempoDePausaMs);

        const statusEmAndamento = await this.getStatusOrThrow("EM ANDAMENTO");

        return prismaClient.ordemdeServico.update({
            where: { id: ordemId },
            data: {
                // 1. Muda o status para EM ANDAMENTO
                statusOrdemdeServico: { connect: { id: statusEmAndamento.id } },
                // 2. Aplica o ajuste de tempo
                startedAt: novoStartedAt, 
                // 3. Zera o registro da pausa. O erro desaparecerá após a atualização do schema/geração.
                // @ts-ignore pausaIniciadaEm: null,
            },
            include: { statusOrdemdeServico: true },
        });
    },

    async concluirOrdem(ordemId: string) {
        // Usamos um cast
        const ordem = await prismaClient.ordemdeServico.findUnique({ where: { id: ordemId } }) as OrdemdeServicoComPausa | null;
        if (!ordem) throw new Error("Ordem não encontrada");

        if (!ordem.startedAt) throw new Error("OS ainda não foi iniciada");
        
        const now = new Date();
        const duracaoTotal = Math.floor((now.getTime() - ordem.startedAt.getTime()) / 1000);

        const statusConcluida = await this.getStatusOrThrow("CONCLUIDA");

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
        const ordem = await prismaClient.ordemdeServico.findUnique({ where: { id: ordemId } }) as OrdemdeServicoComPausa | null;
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