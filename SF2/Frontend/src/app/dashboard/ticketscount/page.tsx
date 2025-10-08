import { getCookieServer } from "@/lib/cookieServer";
import { api } from "@/services/api";
import TicketsList from "./TicketsList";
import { OrdemdeServicoProps, OrdemdeServicoResponseData } from "@/lib/getOrdemdeServico.type";

async function getTickets(): Promise<OrdemdeServicoResponseData> {
  try {
    const token = await getCookieServer();
    console.log("Token pego no client:", token);
    const response = await api.get('/listordemdeservico', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    return response.data || { controles: [], total: 0, totalAberta: 0, totalConcluida: 0, totalEmAndamento: 0 };

  } catch (err) {
    console.error(err);
    return {controles: [], total: 0, totalAberta: 0, totalConcluida: 0, totalEmAndamento: 0 }; 
  }
}

export default async function TicketsPage() {
  const ticketsData = await getTickets();

  return (
    <TicketsList ticketsData={ticketsData} />
  );
}
