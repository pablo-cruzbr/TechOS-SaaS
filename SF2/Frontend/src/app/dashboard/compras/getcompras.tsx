import { api } from "@/services/api";
import { ComprasProps } from "@/lib/getCompras.type";
import { getCookieServer } from "@/lib/cookieServer";
import {ModalBuy} from "../../components/modalCardCompras/index"
export async function getServerSideProps() {
  try {
    const token = await getCookieServer();

    const response = await api.get("/listsolicitacaodecompras", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const compras = response.data || [];

    console.log("Compras Buscadas no banco de dados:", compras); 
    return {
      props: { compras },
    };
  } catch (err) {
    console.error("Erro ao buscar compras:", err);
    return {
      props: { compras: [] },
    };
  }
}

export default function ComprasPage({ compras }: { compras: ComprasProps[] }) {
  return (
    <div>
      <h1>Lista de Compras</h1>
      <pre>{JSON.stringify(compras, null, 2)}</pre>
   
    <ModalBuy/>
    </div>
);
  
}
