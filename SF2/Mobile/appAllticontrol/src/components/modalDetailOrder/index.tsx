import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking,
  Image,
  Alert,
} from "react-native";
import { OrdensDeServico } from "../../pages/Dashboard";
import { MaterialIcons } from "@expo/vector-icons";
import { ModalDetailOrderFormTecnico } from "../modalDetailOrderFormTecnico";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";
import * as ImagePicker from "expo-image-picker";

interface ModalDetailOsProps {
  ordem: OrdensDeServico | null;
  handleCloseModal: () => void;
}

interface Setor {
  id: string;
  usuario: string;
  ramal: string;
  andar: string;
  setor: {
    id: string;
    name: string;
  };
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const IMAGE_SIZE = (WIDTH - 90) / 3;

export function ModalDetailOrder({ ordem, handleCloseModal }: ModalDetailOsProps) {
  const [modalTecnicoOpen, setModalTecnicoOpen] = useState(false);
  const [ordemAtual, setOrdemAtual] = useState<OrdensDeServico | null>(ordem);
  const [selectedImages, setSelectedImages] = useState<{ uri: string; base64: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [time, setTime] = useState(0);
  const [assinatura, setAssinatura] = useState<string | null>(null);

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

useEffect(() => {
  let interval: NodeJS.Timeout | null = null;

  if (isRunning && !isPaused) {
    setLastUpdate(new Date());
    interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  } else {
    if (interval) clearInterval(interval);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isRunning, isPaused]);

useEffect(() => {
  if (ordemAtual?.startedAt) setHasStarted(true);
}, [ordemAtual]);


  if (!ordemAtual) return null;

  const endereco = ordemAtual.user?.cliente?.endereco ?? ordemAtual.instituicaoUnidade?.endereco ?? "";

  const abrirWaze = (endereco: string) => {
    const url = `https://waze.com/ul?q=${encodeURIComponent(endereco)}`;
    Linking.canOpenURL(url).then(supported => supported ? Linking.openURL(url) : Alert.alert("Erro", "Não foi possível abrir o Waze."));
  };

  const abrirGoogleMaps = (endereco: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    Linking.openURL(url);
  };

  const atualizarOrdem = () => setOrdemAtual({ ...ordemAtual });

  const fetchAssinatura = async (ordemId: string) => {
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) return;
      const { token } = JSON.parse(storageToken);

      const response = await api.get(`/assinatura/${ordemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssinatura(response.data?.assinatura ?? null);
    } catch (err) {
      console.error("Erro ao buscar assinatura:", err);
    }
  };

 const fetchTempo = async (ordemId: string) => {
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;

    const { token } = JSON.parse(storageToken);

    const response = await api.get(`/ordemdeservico/tempo/${ordemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { duracao, startedAt, endedAt } = response.data;

    if (startedAt) {
      // Converte o horário UTC para horário de Brasília (UTC-3)
      const offsetMs = -3 * 60 * 60 * 1000;
      const startedAtDate = new Date(new Date(startedAt).getTime() + offsetMs);
      const endedAtDate = endedAt ? new Date(new Date(endedAt).getTime() + offsetMs) : null;

      // Calcula duração
      let diff = 0;
      if (endedAtDate) {
        diff = Math.floor((endedAtDate.getTime() - startedAtDate.getTime()) / 1000);
      } else {
        diff = Math.floor((Date.now() + offsetMs - startedAtDate.getTime()) / 1000);
      }

      setTime(diff > 0 ? diff : 0);
      setIsRunning(!endedAtDate);

      // Atualiza ordemAtual com os horários corrigidos para exibição
      setOrdemAtual((prev) =>
        prev
          ? {
              ...prev,
              startedAt: startedAtDate.toISOString(),
              endedAt: endedAtDate ? endedAtDate.toISOString() : null,
            }
          : prev
      );
    }
  } catch (error) {
    console.error("Erro ao buscar tempo da OS:", error);
  }
};



    useEffect(() => {
    if (ordemAtual?.id) {
      fetchAssinatura(ordemAtual.id);
      fetchTempo(ordemAtual.id); // chama a requisição GET do tempo
    }
  }, [ordemAtual]);

  const enviarAssinatura = async (base64: string) => {
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) return;
      const { token } = JSON.parse(storageToken);

      await api.patch(`/assinatura/${ordemAtual!.id}`, { assinatura: base64 }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Assinatura salva!");
      setAssinatura(base64);
    } catch (err) {
      console.error("Erro ao salvar assinatura:", err);
      Alert.alert("Erro", "Não foi possível salvar a assinatura.");
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permissão negada", "Habilite o acesso às fotos.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imagesWithBase64 = result.assets.map(asset => ({
        uri: asset.uri,
        base64: `data:${asset.type};base64,${asset.base64}`,
      }));
      setSelectedImages([...selectedImages, ...imagesWithBase64]);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permissão negada", "Habilite o acesso à câmera.");

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imagesWithBase64 = result.assets.map(asset => ({
        uri: asset.uri,
        base64: `data:${asset.type};base64,${asset.base64}`,
      }));
      setSelectedImages([...selectedImages, ...imagesWithBase64]);
    }
  };

  const removeImage = (index: number) => setSelectedImages(selectedImages.filter((_, i) => i !== index));

  const uploadImages = async () => {
    if (selectedImages.length === 0) return Alert.alert("Atenção", "Selecione pelo menos uma imagem.");

    const formData = new FormData();
    formData.append("ordemdeServico_id", ordemAtual.id);

    selectedImages.forEach((img, index) => {
      formData.append("file", {
        uri: img.uri,
        name: `ordem_${ordemAtual.id}_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    try {
      await api.post(`/foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
      Alert.alert("Sucesso", "Imagens enviadas com sucesso!");
      setSelectedImages([]);
    } catch (err: unknown) {
      const error = err as any;
      console.error("Erro no upload de imagens:", error.response?.data || error.message);
      Alert.alert("Erro", "Falha ao enviar imagens.");
    }
  };

const refreshOrdemAtual = async () => {
  if (!ordemAtual?.id) return; 
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    const { data } = await api.get(`/ordemdeservico/tempo/${ordemAtual.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("🔥 Dados recebidos no refreshOrdemAtual:", data);

    setOrdemAtual(prev => prev ? { ...prev, ...data } : data);

    // 🚫 Não mexemos em isRunning / isPaused aqui
  } catch (error) {
    console.error("Erro ao buscar OS atualizada:", error);
  }
};




const handleStart = async () => {
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    await api.patch(
      `/ordemdeservico/iniciar/${ordemAtual.id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔁 Atualiza a ordem para pegar o novo status
    await refreshOrdemAtual();

    // Agora o status estará “EM ANDAMENTO”
    setIsRunning(true);
    setIsPaused(false);
     setHasStarted(true);

  } catch (error) {
    console.error("Erro ao iniciar OS:", error);
  }
};



useEffect(() => {
  console.log("DEBUG: useEffect iniciado.");

  if (!ordem) {
    console.log("DEBUG: Variável 'ordem' é nula ou indefinida. Saindo.");
    return;
  }
  
  // ✅ PONTO DE DEBUG CRÍTICO: Verificar o ID
  console.log("DEBUG: ID da Ordem de Serviço (ordem.id):", ordem.id);
  
  // Garante que o ID é válido antes de prosseguir
  if (!ordem.id) {
    console.log("DEBUG: 'ordem.id' é nulo ou inválido. Saindo.");
    return;
  }

  let isMounted = true; 

  const fetchOrdemAtualizada = async () => {
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) {
        console.log("DEBUG: Token não encontrado no AsyncStorage. Saindo.");
        return;
      }
      const { token } = JSON.parse(storageToken);
      
      // ✅ PONTO DE DEBUG CRÍTICO: Verificar a URL completa e o Token
      const urlCompleta = `/ordemdeservico/${ordem.id}`;
      console.log("DEBUG: URL da Requisição:", urlCompleta);
      console.log("DEBUG: Token (primeiros 10 caracteres):", token ? token.substring(0, 10) + '...' : 'Token Vazio');


      const response = await api.get(urlCompleta, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (isMounted) {
        setOrdemAtual(response.data);
        fetchAssinatura(ordem.id);
        fetchTempo(ordem.id);
        console.log("DEBUG: Requisição bem-sucedida! Status:", response.status);
      }
    } catch (err) {
      if (isMounted) {
    const error = err as any; // Simplifica a vida para fins de depuração
    const axiosErrorStatus = error.response ? error.response.status : 'Sem Status';
    const axiosErrorMessage = error.response ? error.response.data : 'Sem Dados de Erro';

    console.error("ERRO COMPLETO (Catch):", error);
    console.error("ERRO AO BUSCAR OS ATUALIZADA - Status HTTP:", axiosErrorStatus);
    console.error("ERRO AO BUSCAR OS ATUALIZADA - Resposta do Servidor:", axiosErrorMessage);
  }
    }
  };

  fetchOrdemAtualizada();

  return () => {
    isMounted = false;
    console.log("DEBUG: Cleanup function (componente desmontado) executada.");
  };
}, [ordem]); 

const handlePause = async () => {
  if (!ordemAtual?.id) return;

  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    const payload = { endedAt: new Date().toISOString() };

    const response = await api.patch(
      `/ordemdeservico/pausar/${ordemAtual.id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🔹 Primeiro, atualiza os estados locais para exibir o botão imediatamente
    setIsRunning(false);
    setIsPaused(true);

    // 🔹 Depois atualiza os dados da OS, mas sem sobrescrever o estado local
    await refreshOrdemAtual();

    console.log("⏸️ Ordem pausada com sucesso:", response.data);
  } catch (error: any) {
    console.error("Erro detalhado ao pausar OS:", JSON.stringify(error, null, 2));
    Alert.alert("Erro", "Não foi possível pausar a OS.");
  }
};


const handleResume = async () => {
  if (!ordemAtual?.id) return;

  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    const response = await api.patch(
      `/ordemdeservico/retomar/${ordemAtual.id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ OS retomada com sucesso:", response.data);

    // 🟢 Atualiza estados visuais imediatamente
    setIsPaused(false);
    setIsRunning(true);

    Alert.alert("Ordem retomada", "A contagem de tempo foi retomada com sucesso.");

    // Aguarda um pequeno delay para estabilidade da renderização
    setTimeout(async () => {
      await refreshOrdemAtual();
    }, 500);
  } catch (error: any) {
    console.error("❌ Erro ao retomar OS:", error.response?.data || error.message);
    Alert.alert("Erro", "Não foi possível retomar a OS.");
  }
};





  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

 const handleCloseAndComplete = async () => {
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    await api.patch(`/ordemdeservico/concluir/${ordemAtual.id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await refreshOrdemAtual();
    handleCloseModal();
  } catch (error) {
    console.error("Erro ao concluir OS:", error);
  }
};

  return (
    <>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={handleCloseModal}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator>
            
            <View style={styles.header}>
              <Text style={styles.title}>Detalhes da Ordem</Text>
              <TouchableOpacity onPress={atualizarOrdem} style={styles.refreshIcon}>
                <MaterialIcons name="refresh" size={24} color="#0F1431" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeIcon}>
                <MaterialIcons name="close" size={24} color="#0F1431" />
              </TouchableOpacity>
            </View>

            
          {/* Informações adicionais do setor */}
           {ordemAtual.informacoesSetor && (
          <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Local do Chamado: </Text>
          
            {ordemAtual?.informacoesSetor?.instituicaoUnidade?.name ? (
              <Text>{ordemAtual.informacoesSetor.instituicaoUnidade.name}</Text>
              ) : ordemAtual?.informacoesSetor?.cliente?.name ? (
              <Text>{ordemAtual.informacoesSetor.cliente.name}</Text>
              ) : (
              <Text>Não informado</Text>
             )}
          
               <Text style={styles.label}>
              Informações do usuário que solicitou o chamado
             </Text>
                            
               <Text>Setor: {ordemAtual.informacoesSetor.setor.name}</Text>
               <Text>Usuário: {ordemAtual.informacoesSetor.usuario}</Text>
               <Text>Ramal: {ordemAtual.informacoesSetor.ramal}</Text>
              <Text>Andar: {ordemAtual.informacoesSetor.andar}</Text>
                </View>
               )}

            <Text style={styles.label}>Número: {ordemAtual.numeroOS ?? "Não Disponível"}</Text>
            <Text style={styles.label}>Status:</Text>
            <Text>{ordemAtual.statusOrdemdeServico?.name ?? "-"}</Text>
            <Text style={styles.label}>Quem abriu a OS:</Text>
            <Text>{ordemAtual.name}</Text>

            {ordemAtual.user?.cliente ? (
              <>
                <Text style={styles.label}>Empresa:</Text>
                <Text>{ordemAtual.user.cliente.name}</Text>
                <Text style={styles.label}>Endereço:</Text>
                <Text>{ordemAtual.user.cliente.endereco}</Text>
              </>
            ) : ordemAtual.instituicaoUnidade ? (
              <>
                <Text style={styles.label}>Instituição:</Text>
                <Text>{ordemAtual.instituicaoUnidade.name}</Text>
                <Text style={styles.label}>Endereço:</Text>
                <Text>{ordemAtual.instituicaoUnidade.endereco}</Text>
              </>
            ) : (
              <>
                <Text style={styles.label}>Endereço:</Text>
                <Text>-</Text>
              </>
            )}

            {endereco && (
              <>
                <TouchableOpacity style={[styles.buttonClose, styles.buttonNavigation]} onPress={() => abrirWaze(endereco)}>
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="navigation" size={20} color="#FFF" />
                    <Text style={styles.textButtonClose}>ABRIR NO WAZE</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttonClose, styles.buttonNavigation]} onPress={() => abrirGoogleMaps(endereco)}>
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="map" size={20} color="#FFF" />
                    <Text style={styles.textButtonClose}>ABRIR NO GOOGLE MAPS</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            
              <View style={styles.timerContainer}>
  <Text style={styles.timerText}>Tempo decorrido: {formatTime(time)}</Text>

  <View style={styles.timerButtons}>
  {!isRunning && !isPaused && !hasStarted && (
    <TouchableOpacity
      style={[styles.buttonClose, styles.timerBtn]}
      onPress={handleStart}
    >
      <Text style={styles.textButtonClose}>Iniciar</Text>
    </TouchableOpacity>
  )}

  {isRunning && (
    <TouchableOpacity
      style={[styles.buttonClose, styles.timerBtnPause]}
      onPress={handlePause}
    >
      <Text style={styles.textButtonClose}>Pausar</Text>
    </TouchableOpacity>
  )}

  {!isRunning && isPaused && (
    <TouchableOpacity
      style={[styles.buttonClose, styles.timerBtnReset]}
      onPress={async () => {
        await handleResume();

        setTimeout(() => {
          setIsRunning(true);
          setIsPaused(false);
        }, 300);
      }}
    >
      <Text style={styles.textButtonClose}>Retomar</Text>
    </TouchableOpacity>
  )}
</View>


</View>




            <Text style={styles.label}>Tipo de Chamado:</Text>
            <Text>{ordemAtual.tipodeChamado?.name ?? "-"}</Text>
            <Text style={styles.label}>Problema:</Text>
            <Text>{ordemAtual.descricaodoProblemaouSolicitacao}</Text>
            <Text style={styles.label}>Contato no Local:</Text>
            <Text>{ordemAtual.nomedoContatoaserProcuradonoLocal}</Text>
            <Text style={styles.label}>Técnico:</Text>
            <Text>{ordemAtual.nameTecnico ?? "-"}</Text>
            <Text style={styles.label}>Diagnóstico:</Text>
            <Text>{ordemAtual.diagnostico ?? "-"}</Text>
            <Text style={styles.label}>Solução:</Text>
            <Text>{ordemAtual.solucao ?? "-"}</Text>
            
           <Text style={styles.label}>Início da OS:</Text>
              <Text>
                {ordemAtual?.startedAt
                  ? new Date(ordemAtual.startedAt).toLocaleTimeString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </Text>

              <Text style={styles.label}>Término da OS:</Text>
              <Text>
                {ordemAtual?.endedAt
                  ? new Date(ordemAtual.endedAt).toLocaleTimeString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : isRunning
                  ? "Em andamento..."
                  : "-"}
              </Text>


            <Text style={styles.label}>Duração:</Text>
              <Text>{formatTime(time)}</Text>

            <Text style={styles.label}>Assinatura:</Text>
             <Text>Pessoa que Assinou: {ordemAtual.assinante ?? "-"}</Text>

            {/* === ASSINATURA === */}
            {assinatura ? (
              <Image source={{ uri: assinatura }} style={{ width: 300, height: 230, marginTop: 5, borderWidth: 1, borderColor: "#000" }} />
            ) : (
              <TouchableOpacity style={styles.buttonClose} onPress={() => Alert.alert("Assinatura", "Implementar captura de assinatura aqui")}>
                <Text style={styles.textButtonClose}>ADICIONAR ASSINATURA</Text>
              </TouchableOpacity>
            )}

            {/* === IMAGENS === */}
            <TouchableOpacity style={styles.buttonClose} onPress={pickImages}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="photo-library" size={20} color="#FFF" />
                <Text style={styles.textButtonClose}>SELECIONAR IMAGENS</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonClose} onPress={openCamera}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="photo-camera" size={20} color="#FFF" />
                <Text style={styles.textButtonClose}>TIRAR FOTO</Text>
              </View>
            </TouchableOpacity>

            {selectedImages.length > 0 && (
              <>
                <View style={styles.gridImages}>
                  {selectedImages.map((img, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image source={{ uri: img.uri }} style={styles.imageItem} />
                      <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                        <MaterialIcons name="close" size={16} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.buttonClose} onPress={uploadImages}>
                  <View style={styles.buttonContent}>
                    <MaterialIcons name="cloud-upload" size={20} color="#FFF" />
                    <Text style={styles.textButtonClose}>ENVIAR TODAS</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity style={styles.buttonClose} onPress={() => setModalTecnicoOpen(true)}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="description" size={20} color="#FFF" />
                <Text style={styles.textButtonClose}>ADICIONAR DESCRIÇÃO TÉCNICA</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.buttonClose, styles.buttonComplete]} onPress={handleCloseAndComplete}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="check-circle" size={20} color="#FFF" />
                <Text style={styles.textButtonClose}>CONCLUIR E FECHAR</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>

      {modalTecnicoOpen && (
        <ModalDetailOrderFormTecnico ordemId={ordemAtual.id} handleCloseModal={() => setModalTecnicoOpen(false)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: WIDTH - 15,
    maxHeight: HEIGHT - 100,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  refreshIcon: {
    left: 40,
  },

  closeIcon: {
    right: 4,
  },

  label: {
    marginTop: 10,
    fontWeight: "bold",
  },

  buttonClose: {
    marginTop: 20,
    backgroundColor: "#3859F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  textButtonClose: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },

  buttonNavigation: {
    backgroundColor: "#3859F3",
  },

  timerContainer: {
    marginVertical: 15,
    alignItems: "center",
  },

  timerText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  timerButtons: {
    flexDirection: "row",
    marginTop: 10,
  },

  timerBtn: {
    marginRight: 10,
    backgroundColor: "#3859F3",
  },

  timerBtnPause: {
    marginRight: 10,
    backgroundColor: "#888",
  },

  timerBtnReset: {
    backgroundColor: "#555",
  },

  gridImages: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 10,
    marginBottom: 10,
    position: "relative",
  },

  imageItem: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 2,
    zIndex: 10,
  },

  buttonComplete: {
    backgroundColor: "green",
  },
});
