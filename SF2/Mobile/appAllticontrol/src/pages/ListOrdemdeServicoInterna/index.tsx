import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalDetailTicketInterno } from "../../components/modalDetailOrderTicketsInterno";
import { ModalFormTecnicoTickets } from "../../components/modalFormTecnicoTickets";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";

export type OrdensDeServico = {
  id: string;
  name: string;
  descricaodoProblemaouSolicitacao: string;
  nomedoContatoaserProcuradonoLocal: string;
  created_at: string;
  nameTecnico: string | null;
  diagnostico: string | null;
  solucao: string | null;
  bannerassinatura: string | null;
  numeroOS: number;
  startedAt?: string | null;
  endedAt?: string | null;
  duracao?: number;
  informacoesSetor?: {
  id: string;
  usuario: string;
  ramal: string;
  andar: string;
  setor: {
    id: string;
    name: string;
  };
} | null;
  user: {
    id: string;
    name: string;
    instituicaoUnidade: { name: string; endereco: string } | null;
    cliente: { name: string; endereco: string } | null;
    setor: { name: string } | null;
  };
  tipodeChamado: { id: string; name: string };
  cliente: { id: string; name: string; endereco: string | null } | null;
  tecnico: { id: string; name: string } | null;
  instituicaoUnidade: { id: string; name: string; endereco: string } | null;
  statusOrdemdeServico: { id: string; name: string } | null;
};

export default function ListOrdemdeServicoInterna() {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);

  const [ordensDeServico, setOrdensDeServico] = useState<OrdensDeServico[]>([]);
  const [filteredOrdens, setFilteredOrdens] = useState<OrdensDeServico[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // estados de modais
  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [modalFormTicketInternoVisible, setModalFormTicketInternoVisible] = useState(false);

  const [selectedOrdem, setSelectedOrdem] = useState<OrdensDeServico | null>(null);
  const [loading, setLoading] = useState(false);

  // Lista fixa de status
  const statusList = [
    { id: "all", name: "TODOS" },
    { id: "80e14fbe-c7fd-45bc-b3cd-cfa51ede44e0", name: "ABERTA" },
    { id: "ce3a8414-704c-4562-bb3d-b400fe9f3b6b", name: "EM ANDAMENTO" },
    { id: "fa69ed32-20b2-4d3a-9a6d-e61c5b45efea", name: "CONCLUIDA" },
  ];

  // Função para carregar ordens
  const loadOrdens = async () => {
    setLoading(true);
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) return;

      const { token } = JSON.parse(storageToken);
      if (!token) return;

      const response = await api.get("/listordemdeservico", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordens = response.data.result.controles || [];
      setOrdensDeServico(ordens);
      setFilteredOrdens(ordens);
    } catch (error) {
      console.error("Erro ao carregar ordens de serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtro
  useEffect(() => {
    let result = [...ordensDeServico];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (os) =>
          os.numeroOS?.toString().includes(lower) ||
          os.instituicaoUnidade?.name?.toLowerCase().includes(lower) ||
          os.user?.cliente?.name?.toLowerCase().includes(lower)
      );
    }

    if (statusFilter && statusFilter !== "TODOS") {
      result = result.filter(
        (os) => os.statusOrdemdeServico?.name === statusFilter
      );
    }

    setFilteredOrdens(result);
  }, [search, statusFilter, ordensDeServico]);

  useEffect(() => {
    loadOrdens();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/logoperfil.png")}
          style={styles.profileImage}
        />
        <Text style={styles.title}>Tickets Internos</Text>
        <View style={styles.headerIcons}>
          <Feather name="user" size={24} color="#fff" style={styles.icon} />
          {loading ? (
            <ActivityIndicator size="small" color="#fff" style={styles.icon} />
          ) : (
            <Ionicons
              name="refresh"
              size={22}
              color="#fff"
              style={styles.icon}
              onPress={loadOrdens}
            />
          )}
        </View>
      </View>

      {/* Input de pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar por número da OS, Instituição ou Empresa"
        value={search}
        onChangeText={setSearch}
      />

      {/* Botões de filtro */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 10,
          marginTop: 10,
          flexWrap: "wrap",
        }}
      >
        {statusList.map((status) => {
          const active =
            statusFilter === status.name ||
            (status.id === "all" && statusFilter === "");
          return (
            <TouchableOpacity
              key={status.id}
              style={[styles.statusButton, active && styles.statusButtonActive]}
              onPress={() =>
                setStatusFilter(status.id === "all" ? "" : status.name)
              }
            >
              <Text
                style={[styles.statusText, active && styles.statusTextActive]}
              >
                {status.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Dashboard" as never)}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="arrow-alt-circle-left" size={30} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.formtec}
        onPress={() => setModalFormTicketInternoVisible(true)}
        activeOpacity={0.7}
      >
        <AntDesign name="form" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={filteredOrdens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedOrdem(item);
              setModalDetailVisible(true);
            }}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                Número da OS: {item.numeroOS || "Não Disponível"}
              </Text>
              <Text style={styles.cardStatus}>
                Status da OS: {item.statusOrdemdeServico?.name || "N/A"}
              </Text>

              {item.user.cliente && (
                <>
                  <Text style={styles.cardSubtitle}>
                    Empresa: {item.user.cliente.name}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Endereço: {item.user.cliente.endereco}
                  </Text>
                </>
              )}

              {item.instituicaoUnidade && (
                <>
                  <Text style={styles.cardSubtitle}>
                    Diagnóstico - MOBILE: {item.diagnostico}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Endereço: {item.instituicaoUnidade.endereco}
                  </Text>
                </>
              )}

              <Text style={styles.cardItem}>
                Setor: {item.informacoesSetor?.setor.name}
              </Text>
              <Text style={styles.cardItem}>
                Quem Solicitou o chamado: {item.informacoesSetor?.usuario}
              </Text>
              <Text style={styles.cardItem}>
                Andar: {item.informacoesSetor?.andar}
              </Text>
            </View>
            <Ionicons name="ellipsis-vertical" size={20} color="#333" />
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          paddingBottom: 90,
          paddingTop: 10,
        }}
      />

      {/* Modal detalhe da OS */}
      {modalDetailVisible && selectedOrdem && (
        <ModalDetailTicketInterno
          ordem={selectedOrdem}
          visible={modalDetailVisible} 
          handleCloseModal={() => setModalDetailVisible(false)}
        />
      )}

      {/* Modal Form Técnico Ticket */}
      {modalFormTicketInternoVisible && (
        <ModalFormTecnicoTickets
          visible={modalFormTicketInternoVisible}
          handleCloseModal={() => setModalFormTicketInternoVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
    backgroundColor: "#3859F3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 20,
  },
  profileImage: { width: 35, height: 35, borderRadius: 50 },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  icon: { marginLeft: 15 },
  input: {
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  statusButton: {
    width: 100,
    height: 30,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 7,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statusButtonActive: { backgroundColor: "#3859F3" },
  statusText: { fontSize: 11, color: "#333", fontWeight: "600" },
  statusTextActive: { color: "#fff" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 9,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontWeight: "bold", fontSize: 14 },
  cardStatus: { fontWeight: "bold", fontSize: 14, marginTop: 4 },
  cardSubtitle: { fontSize: 12, color: "#666" },
  cardItem: { fontSize: 12, color: "#333" },
  formtec: {
    position: "absolute",
    bottom: 70,
    right: 20,
    backgroundColor: "#3859F3",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    zIndex: 99,
  },
  fab: {
    position: "absolute",
    bottom: 140,
    right: 20,
    backgroundColor: "#3859F3",
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    zIndex: 99,
  },
});
