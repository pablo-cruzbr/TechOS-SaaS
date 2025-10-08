// app/dashboard/compras/page.tsx

import { getCookieServer } from '@/lib/cookieServer';
import { api } from '@/services/api';
import { TecnicosProps, TecnicoPropsResponse } from '@/lib/getTecnicos.type';
import TecnicoList from './TecnicoList';

async function getTecnico(): Promise<TecnicoPropsResponse> {
  try {
    const token = await getCookieServer();

    const response = await api.get('/listtecnico', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📦 Dados recebidos de /listtecnico:', response.data);

    const data = response.data;

    return {
      controles: data.tecnicos ?? data.controles ?? [],
      total: data.total ?? data.count ?? 0,
    };
  } catch (err) {
    console.error('❌ Erro ao buscar técnicos:', err);
    return {
      controles: [],
      total: 0,
    };
  }
}

export default async function ComprasPage() {
  const tecnicosData = await getTecnico();
  return <TecnicoList tecnicosData={tecnicosData} />;
}
