"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { SiGoogledocs } from "react-icons/si";
import { FaUserPlus } from "react-icons/fa6";
import { BsImages } from "react-icons/bs";
import { FaSignature } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useGlobalModal } from "@/provider/GlobalModalProvider";
import { OrdemdeServicoProps } from "@/lib/getOrdemdeServico.type";
import EditCardOrdemdeServico from "./EditCardOrdemdeServico";
import ViewCardFoto from "./ViewCardFoto";
import DetailTecnico from "./DetailTecnico";
import Assinatura from "./Assinatura";

interface ModalOrdemdeServicoProps {
  data: OrdemdeServicoProps[];
}

export function ModalOrdemdeServico({ data }: ModalOrdemdeServicoProps) {
  const { closeModal, modalData, modalType, isOpen } = useGlobalModal();
  const OrdemdeServico: OrdemdeServicoProps | undefined = modalData?.[0] || modalData;
  const [isEditing, setIsEditing] = useState(false);
  const [isFotos, setIsFotos] = useState(false);
  const [isDetailTecnico, setDetailTecnico] = useState(false);
  const [isAssinatura, setAssinatura] = useState(false)

  const router = useRouter();

  function handleRefresh() {
    router.refresh();
    closeModal();
  }

  useEffect(() => {
    if (modalType === "OrdemdeServico" && !OrdemdeServico) {
      closeModal();
    }
  }, [OrdemdeServico, modalType, closeModal]);

  if (modalType !== "OrdemdeServico" || !isOpen || !OrdemdeServico) return null;

  return (
    <div className={styles.dialogContainer} open>
      <section className={styles.dialogContent}>
        <button onClick={closeModal} className={styles.dialogBack}>
          <IoIosCloseCircleOutline size={36} color="#526D82" />
        </button>

        <h2>Detalhes da Ordem de Serviço</h2>

        {/* Se estiver em modo Fotos */}
        {isFotos && (
          <ViewCardFoto
            ordemdeServico={OrdemdeServico}
            onClose={() => setIsFotos(false)}
          />
        )}

        {isAssinatura && (
          <Assinatura
            ordemdeServico={OrdemdeServico}
            onClose={() => setAssinatura(false)}
          />
        )}

        {/* Se estiver em modo Edição */}
        {isEditing && (
          <EditCardOrdemdeServico
            ordemdeServico={OrdemdeServico}
            onClose={() => setIsEditing(false)}
          />
        )}

        {/* Se estiver em modo Detalhe Técnico */}
        {isDetailTecnico && (
          <DetailTecnico
            ordemdeServico={OrdemdeServico}
            onClose={() => setDetailTecnico(false)}
          />
        )}

        {/* Conteúdo padrão */}
        {!isFotos && !isEditing && !isDetailTecnico && !isAssinatura && (
          <>
            {/* DADOS DO USUÁRIO */}
            <p className={styles.sectionTitle}>Dados do Usuário</p>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Numero da OS:</label>
                <span>{OrdemdeServico.numeroOS}</span>
              </div>

              <div className={styles.infoItem}>
                <label>Quem abriu a OS:</label>
                <span>{OrdemdeServico.user.name}</span>
              </div>

              {OrdemdeServico.user?.setor?.name && (
                <div className={styles.infoItem}>
                  <label>Setor/Departamento:</label>
                  <span>{OrdemdeServico.user.setor.name}</span>
                </div>
              )}

              {OrdemdeServico.user?.instituicaoUnidade?.name && (
                <div className={styles.infoItem}>
                  <label>Instituição:</label>
                  <span>{OrdemdeServico.user.instituicaoUnidade.name}</span>
                </div>
              )}

              {OrdemdeServico.user?.instituicaoUnidade?.endereco && (
                <div className={styles.infoItem}>
                  <label>Endereço da Instituição:</label>
                  <span>{OrdemdeServico.user.instituicaoUnidade.endereco}</span>
                </div>
              )}

              {OrdemdeServico.user?.cliente?.name && (
                <div className={styles.infoItem}>
                  <label>Empresa:</label>
                  <span>{OrdemdeServico.user.cliente.name}</span>
                </div>
              )}

              {OrdemdeServico.user?.cliente?.endereco && (
                <div className={styles.infoItem}>
                  <label>Endereço:</label>
                  <span>{OrdemdeServico.user.cliente.endereco}</span>
                </div>
              )}
            </div>

            {/* DADOS DA SOLICITAÇÃO */}
            <p className={styles.sectionTitle}>Dados da Solicitação</p>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Tipo de Serviço:</label>
                <span>{OrdemdeServico.tipodeChamado.name}</span>
              </div>

              <div className={styles.infoItem}>
                <label>Problema/Solicitação:</label>
                <span>{OrdemdeServico.descricaodoProblemaouSolicitacao}</span>
              </div>

              <div className={styles.infoItem}>
                <label>Pessoa a ser procurada no local:</label>
                <span>{OrdemdeServico.nomedoContatoaserProcuradonoLocal}</span>
              </div>

              <div className={styles.infoItem}>
                <label>Status da OS:</label>
                <span>{OrdemdeServico.statusOrdemdeServico?.name ?? "-"}</span>
              </div>

              <div className={styles.infoItem}>
                <label>Técnico Responsável:</label>
                <span>{OrdemdeServico.tecnico?.name ?? "Não informado"}</span>
              </div>

          
              <div className={styles.infoItem}>
                <label>Data de Criação:</label>
                <span>
                  {OrdemdeServico.created_at
                    ? new Date(OrdemdeServico.created_at).toLocaleDateString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : "-"}
                </span>
              </div>
            </div>

            {/* BOTÕES */}
            <div className={styles.areaButton}>


              <button className={styles.buttonBuy} onClick={() => setAssinatura(true)}>
                <FaSignature size={20} />
              </button>
              
               <button className={styles.buttonBuy} onClick={() => setIsFotos(true)}>
                <BsImages size={18} />
                Ver Fotos
              </button>
              
              <button className={styles.buttonBuy} onClick={() => setDetailTecnico(true)}>
                <SiGoogledocs  size={18}/>
               
              </button>

              <button className={styles.buttonBuy} onClick={() => setIsEditing(true)}>
                <FaUserPlus size={18} />
                Atribuir OS a um Técnico ou Alterar Status
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
