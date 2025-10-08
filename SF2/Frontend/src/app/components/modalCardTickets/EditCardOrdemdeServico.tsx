"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import styles from "../modalCardCompras/editForm.module.scss";
import { OrdemdeServicoProps } from "@/lib/getOrdemdeServico.type";
import { getCookieClient } from "@/lib/cookieClient";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaRegSave } from "react-icons/fa";

type Status = { id: string; name: string };
type Tecnicos = { id: string; name: string };
type Instituicoes = { id: string; name: string; endereco?: string };
type Cliente = { id: string; name: string; endereco?: string; cnpj?: string };

type FormState = {
  tecnico_id: string;
  statusOrdemdeServico_id: string;
  instituicaoUnidade_id: string;
  cliente_id: string;
};

type Props = {
  ordemdeServico?: OrdemdeServicoProps;
  onClose: () => void;
};

export default function EditCardOrdemdeServico({ ordemdeServico, onClose }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    tecnico_id: "",
    statusOrdemdeServico_id: "",
    instituicaoUnidade_id: "",
    cliente_id: "",
  });
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [tecnicoList, setTecnicoList] = useState<Tecnicos[]>([]);
  const [instituicaoList, setInstituicaoList] = useState<Instituicoes[]>([]);
  const [clienteList, setClienteList] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ordemdeServico) return;

    const clienteId =
      (ordemdeServico as any)?.cliente?.id ??
      (ordemdeServico as any)?.user?.cliente?.id ??
      (ordemdeServico as any)?.informacoesSetor?.cliente?.id ??
      "";

    const instituicaoId =
      (ordemdeServico as any)?.instituicaoUnidade?.id ??
      (ordemdeServico as any)?.instituicaoUnidadeId ??
      "";

    setForm({
      tecnico_id: (ordemdeServico as any)?.tecnico?.id ?? "",
      statusOrdemdeServico_id: (ordemdeServico as any)?.statusOrdemdeServico?.id ?? "",
      instituicaoUnidade_id: instituicaoId?.toString() ?? "",
      cliente_id: clienteId?.toString() ?? "",
    });
  }, [ordemdeServico]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = await getCookieClient();
        if (!token) return;

        const [tecnicosRes, statusRes, clienteRes, instituicoesRes] = await Promise.all([
          api.get("/listtecnico", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/liststatusordemdeservico", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/listcliente", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/listinstuicao", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setTecnicoList(tecnicosRes.data.controles ?? []);
        setStatusList(statusRes.data ?? []);
        setClienteList(clienteRes.data.controles ?? []);
        setInstituicaoList(instituicoesRes.data.instituicoes ?? []);
      } catch (error) {
        console.error("Erro ao buscar listas:", error);
      }
    };

    fetchLists();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async () => {
  try {
    setLoading(true);
    const token = await getCookieClient();
    if (!token) throw new Error("Token não encontrado");

    const payload: any = {
      tecnico_id: form.tecnico_id || undefined,
      statusOrdemdeServico_id: form.statusOrdemdeServico_id || undefined,
      cliente_id: form.cliente_id || null, // envia null se não selecionar
      instituicaoUnidade_id: form.instituicaoUnidade_id || null, // envia null se não selecionar
    };

    console.log("Payload enviado:", payload);

    if (ordemdeServico) {
      const res = await api.patch(`/ordemdeservico/update/${ordemdeServico.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Resposta backend:", res.data);
      alert("Ordem de serviço atualizada com sucesso!");
    } else {
      const res = await api.post("/ordemdeservico", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Resposta backend:", res.data);
      alert("Ordem de serviço criada com sucesso!");
    }

    onClose();
    router.refresh();
  } catch (err: any) {
    console.error("Erro ao enviar dados:", err);
    console.error("Detalhe do response:", err?.response?.data);
    alert("Erro ao enviar os dados da OS. Veja o console para detalhes.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className={styles.editForm}>
      <h3>
        <HiOutlinePencilSquare className={styles.icon} />
        {ordemdeServico ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
      </h3>

      <label>
        <p>Técnico</p>
        <select name="tecnico_id" value={form.tecnico_id} onChange={handleChange} className={styles.input}>
          <option value="">Selecione o Técnico</option>
          {tecnicoList.map((tecnico) => (
            <option key={tecnico.id} value={tecnico.id}>
              {tecnico.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <p>Status da OS</p>
        <select name="statusOrdemdeServico_id" value={form.statusOrdemdeServico_id} onChange={handleChange} className={styles.input}>
          <option value="">Selecione o Status</option>
          {statusList.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <p>Instituição / Unidade</p>
        <select name="instituicaoUnidade_id" value={form.instituicaoUnidade_id} onChange={handleChange} className={styles.input}>
          <option value="">Selecione a Instituição (opcional)</option>
          {instituicaoList.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <p>Cliente</p>
        <select name="cliente_id" value={form.cliente_id} onChange={handleChange} className={styles.input}>
          <option value="">Selecione o Cliente (opcional)</option>
          {clienteList.map((cli) => (
            <option key={cli.id} value={cli.id}>
              {cli.name}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.buttonArea}>
        <button type="button" onClick={handleSubmit} disabled={loading}>
          <FaRegSave className={styles.iconButton} />
          {ordemdeServico ? "Salvar" : "Criar"}
        </button>
        <button type="button" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
