import { Router} from "express";
import uploadConfig from './config/multer';

import {CreateUserController} from './controllers/user/CreateUserController'
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./Middleware/isAuthenticated";
import { CreateClienteController } from "./controllers/status categorias/cliente/CreateClienteController";
import { CreateSetorController } from "./controllers/status categorias/setor/CreateSetorController";
import { ListClienteController } from "./controllers/status categorias/cliente/ListClienteController";
import { RemoveClienteController } from "./controllers/status categorias/cliente/RemoveClienteController";
import { ListSetoresController } from "./controllers/status categorias/setor/ListSetoresController";
import { RemoveSetorController } from "./controllers/status categorias/setor/RemoveSetorController";
import { CreateInstituicaoUnidadeController } from "./controllers/status categorias/instituicaoUnidade/CreateInstituicaoUnidadeController";
import { ListInstituicaoUnidadeController } from "./controllers/status categorias/instituicaoUnidade/ListInstituicaoUnidadeController";
import { RemoveInstituicaoUnidadeController } from "./controllers/status categorias/instituicaoUnidade/RemoveInstituicaoUnidadeController";
import { CreateStatusOrdemdeServicoController } from "./controllers/status categorias/statusOrdemdeServico/CreateStatusOrdemdeServicoController";
import { ListStatusOrdemdeServicoController } from "./controllers/status categorias/statusOrdemdeServico/ListStatusOrdemdeServicoController";
import { RemoveStatusOrdemServicoController } from "./controllers/status categorias/statusOrdemdeServico/RemoveStatusOrdemServicoController";
import { CreatetipodeChamadoController } from "./controllers/status categorias/tipodeChamado/CreatetipodeChamadoController";
import { ListtipodeChamadoService } from "./services/status_categorias/tipodeChamado/ListtipodeChamadoService";
import { CreateTecnicoController } from "./controllers/status categorias/tecnico/CreateTecnicoController";
import { ListTecnicoController } from "./controllers/status categorias/tecnico/ListTecnicoController";
import { RemoveTecnicoController } from "./controllers/status categorias/tecnico/RemoveTecnicoController";
import { CreateEquipamentoController } from "./controllers/status categorias/equipamento/CreateEquipamentoController";
import { ListEquipamentoController } from "./controllers/status categorias/equipamento/ListEquipamentoController";
import { RemoveEquipamentoController } from "./controllers/status categorias/equipamento/RemoveEquipamentoController";
import { CreatestatusMaquinasPendentesController } from "./controllers/status categorias/statusMaquinasPendentesLab/CreatestatusMaquinasPendentesController";
import { ListMaquinasPendentesLabController } from "./controllers/status categorias/statusMaquinasPendentesLab/ListMaquinasPendentesLabController";
import { ListMaquinasPendentesOroController } from "./controllers/status categorias/statusMaquinasPendentesOro/ListstatusMaquinasPendentesOroController";
import { CreatestatusMaquinasPendentesOroController } from "./controllers/status categorias/statusMaquinasPendentesOro/CreatestatusMaquinasPendentesOroController";
import { CreatestatusControlledeLaboratorioController } from "./controllers/status categorias/statusControlledeLaboratorio/CreatestatusControlledeLaboratorioController";
import { ListstatusControlleLaboratioController } from "./controllers/status categorias/statusControlledeLaboratorio/ListstatusControlledeLaboratioController";
import { CreateStatusComprasController } from "./controllers/status categorias/statusCompras/CreateStatusComprasController";
import { ListStatusComprasController } from "./controllers/status categorias/statusCompras/ListStatusComprasController";
import { CreateStatusReparoController } from "./controllers/status categorias/statusReparo/CreateStatusReparoController";
import { ListstatusReparoController } from "./controllers/status categorias/statusReparo/LitstatusReparoController";
import { CreateControledeAssistenciaTecnicaController } from "./controllers/controles_forms/ControledeAssistenciaTecnica/CreateControledeAssistenciaTecnicaController";
import { ListControledeAssistenciaTecnicaController } from "./controllers/controles_forms/ControledeAssistenciaTecnica/ListControledeAssistenciaTecnicaController";
import { CreateOrdemServicoController } from "./controllers/controles_forms/OrdemdeServico/CreateOrdemdeServicoController";
import { CreateStatusUrgenciaController } from "./controllers/status categorias/statusUrgencia/CreateStatusUrgenciaController";
import { ListStatusUrgenciaController } from "./controllers/status categorias/statusUrgencia/ListStatusUrgenciaController";
import { DeleteControledeAssistenciaTecnicaController } from "./controllers/controles_forms/ControledeAssistenciaTecnica/DeleteControledeAssistenciaTecnicaController";
import { CreateControledeLaudoTecnicoController } from "./controllers/controles_forms/ControledeLaudoTécnico/CreateControledeLaudoTécnicoController";
import { ListControledeLaudoTecnicoController } from "./controllers/controles_forms/ControledeLaudoTécnico/ListControledeLaudoTecnicoController";
import { DeleteControledeLaudoTecnicoController } from "./controllers/controles_forms/ControledeLaudoTécnico/DeleteControledeLaudoTecnicoController";
import { CreateControledeLaboratorioController } from "./controllers/controles_forms/ControledeLaboratorio/CreateControledeLaboratorioController";
import { ListControledeLaboratorioController } from "./controllers/controles_forms/ControledeLaboratorio/ListControledeLaboratorioController";
import { DeleteControledeLaboratorioController } from "./controllers/controles_forms/ControledeLaboratorio/DeleteControledeLaboratorioController";
import { CreateControledeMaquinasPendentesLabController } from "./controllers/controles_forms/ControledeMaquinasPendentesLab/CreateControledeMaquinasPendentesLabController";
import { ListControledeMaquinasPendentesLabController } from "./controllers/controles_forms/ControledeMaquinasPendentesLab/ListControledeMaquinasPendentesLabController";
import { DeleteControledeMaquinasPendentesLabController } from "./controllers/controles_forms/ControledeMaquinasPendentesLab/DeleteControledeMaquinasPendentesLabController";
import { CreateControledeMaquinasPendentesOroController } from "./controllers/controles_forms/ControledeMaquinasPendentesOro/CreateControledeMaquinasPendentesOroController";
import { ListControledeMaquinasPendentesOroController } from "./controllers/controles_forms/ControledeMaquinasPendentesOro/ListControledeMaquinasPendentesOroController";
import { DeleteControledeMaquinasPendentesOroController } from "./controllers/controles_forms/ControledeMaquinasPendentesOro/DeleteControledeMaquinasPendentesLabController";
import { CreateDocumentacaoTecnicaController } from "./controllers/controles_forms/DocumentacaoTecnica/CreateDocumentacaoTecnicaController";
import { ListDocumentacaoTecnicaController } from "./controllers/controles_forms/DocumentacaoTecnica/ListDocumentacaoTecnicaController";
import { DeleteDocumentacaoTecnicaController } from "./controllers/controles_forms/DocumentacaoTecnica/DeleteDocumentacaoTecnicaController";
import { CreateSolicitacaodeComprasController } from "./controllers/controles_forms/SolicitacaodeCompras/CreateSolicitacaodeComprasController";
import { ListSolicitacaodeComprasController } from "./controllers/controles_forms/SolicitacaodeCompras/ListSolicitacaodeComprasController";
import { DeleteSolicitacaodeComprasController } from "./controllers/controles_forms/SolicitacaodeCompras/DeleteSolicitacaodeComprasController";

import { DetailComprasController } from "./controllers/controles_forms/SolicitacaodeCompras/DetailSolicitacaodeComprasController";
import { DetailAssistenciaTecnicaController } from "./controllers/controles_forms/ControledeAssistenciaTecnica/DetailControledeAssistenciaTecnicaController";
import { ListUserController } from "./controllers/user/ListUserController";
import { DetailLaudoTenicoController } from "./controllers/controles_forms/ControledeLaudoTécnico/DetailControledeLaudoTenicoController";
import { DetailControledeLaboratorioController } from "./controllers/controles_forms/ControledeLaboratorio/DetailControledeLaboratorioController";
import { DetailMaquinasPendentesLabController } from "./controllers/controles_forms/ControledeMaquinasPendentesLab/DetailMaquinasPendentesLabController";
import { DetailControledeMaquinasPendentesOroController } from "./controllers/controles_forms/ControledeMaquinasPendentesOro/DetailControledeMaquinasPendentesOroController";
import { DetailDocumentacaoTecnicaController } from "./controllers/controles_forms/DocumentacaoTecnica/DetailDocumentacaoTecnicaController";
import { DetailClienteController } from "./controllers/status categorias/cliente/DetailClienteController";
import { UpdateSolicitacaodeComprasController } from "./controllers/controles_forms/SolicitacaodeCompras/UpdateSolicitacaodeComprasController";
import { UpdateDocumentacaoTecnicaController } from "./controllers/controles_forms/DocumentacaoTecnica/UpdateDocumentacaoTecnicaController";
import { UpdateAssistenciaTecnicaController } from "./controllers/controles_forms/ControledeAssistenciaTecnica/UpdateControlledeAssistenciaTecnicaController";
import { UpdateControllerdeLaudoTecnicoController } from "./controllers/controles_forms/ControledeLaudoTécnico/UpdateControllerdeLaudoTecnicoController";
import { UpdateControledeLaboratorioController } from "./controllers/controles_forms/ControledeLaboratorio/UpdateControledeLaboratorioController";
import { UpdateControledeMaquinasPendentesLabController } from "./controllers/controles_forms/ControledeMaquinasPendentesLab/UpdateControledeMaquinasPendentesLabController";
import { UpdateControledeMaquinasPendentesOroController } from "./controllers/controles_forms/ControledeMaquinasPendentesOro/UpdateControledeMaquinasPendentesOroController";
import { ListOrdemdeServicoController } from "./controllers/controles_forms/OrdemdeServico/ListOrdemdeServicoController";
import { ListtipodeChamadoController } from "./controllers/status categorias/tipodeChamado/ListtipodeChamadoController";
import { UpdateOrdemdeServicoService } from "./services/controles_forms/OrdemdeServico/UpdateOrdemdeServicoService";
import { getEventsController, createEventController, updateEventController, deleteEventController } from "../src/controllers/Eventos/EventosControllers";
import multer from 'multer';

import { fotoController } from "./services/controles_forms/FotoOrdensTec/fotoController";
import { ListByStatusTicketsController } from "./controllers/controles_forms/OrdemdeServico/ListByStatusTicketsController";
import { ListByTecnicosTicketsController } from "./controllers/controles_forms/OrdemdeServico/ListByTecnicosTicketsController";
import { CreateStatusEstabilizadoresController } from "./controllers/status categorias/statusEstabilizadores/CreateStatusEstabilizadoresController";
import { ListStatusEstabilizadoresController } from "./controllers/status categorias/statusEstabilizadores/ListStatusEstabilizadoresController";
import { CreateEquipamentoEstabilizadorController } from "./controllers/status categorias/EquipamentoEstabilizador/CreateEquipamentoEstabilizadorController";
import { ListEsquipamentoEstabilizadorController } from "./controllers/status categorias/EquipamentoEstabilizador/ListEquipamentoEstabilizadorController";
import { CreateControledeEstabilizadoresController } from "./controllers/controles_forms/ControledeEstabilizadores/CreateControledeEstabilizadoresController";
import { ListControledeEstabilizadoresService } from "./services/controles_forms/ControledeEstabilizadores/ListControledeEstabilizadoresService";
import { ListControledeEstabilizadoresController } from "./controllers/controles_forms/ControledeEstabilizadores/ListControledeEstabilizadoresController";
import { UpdateControledeEstabilizadoresController } from "./controllers/controles_forms/ControledeEstabilizadores/UpdateControledeEstabilizadoresController";
import { CreatetipodeInstituicaoUnidadeController } from "./controllers/status categorias/tipodeInsituicaoUnidade/CreatetipodeInstituicaoUnidadeController";
import { ListtipoInsituicaoUnidadeController } from "./controllers/status categorias/tipodeInsituicaoUnidade/ListtipoInsituicaoUnidadeController";
import { timeOrdemDeServicoController } from "./controllers/controles_forms/OrdemdeServico/time/timeOrdemdeServicoController";
import { CreateAssinaturaController } from "./controllers/controles_forms/OrdemdeServico/assinatura/CreateAssinaturaController";
import { SaveAssinaturaController } from "./controllers/controles_forms/OrdemdeServico/assinatura/GetAssinaturaController";
import { AssinaturaController } from "./controllers/controles_forms/OrdemdeServico/assinatura/saveAssinatura";
import { CreateInformacoesSetorController } from "./controllers/status categorias/setor/informacoessetor/CreateInformacoesSetorController";
import { ListInformacaoesSetoresController } from "./controllers/status categorias/setor/informacoessetor/ListInformacoesSetorController";

const router = Router();
//get,post, update, delete

const upload = multer(uploadConfig.upload("./tmp"));

//1  - ROTAS DE LOGIN DE USUÁRIO --
// 1.1 - Criar/Cadastrar um usuário
router.post('/users', new CreateUserController().handle)

//1.2 - Logar um usuário
router.post('/session', new AuthUserController().handle)

//1.4 - Listar Usuários Cadastrados no software
//router.get('/listusers', isAuthenticated, new AuthUserController().handle)
router.get('/listusers', new ListUserController().handle)
router.get('/users/detail', isAuthenticated, new DetailUserController().handle)

//---> CATEGORIAS <---

//2 - CRIAR,LISTAR E DELETAR CATEGORIAS
// 1 - Cliente
router.post('/categorycliente', new CreateClienteController().handle)
router.get('/listcliente', new ListClienteController().handle)
router.delete('/deletecliente', isAuthenticated, new RemoveClienteController().handle)
router.get('/cliente/detail', isAuthenticated, new DetailClienteController().handle)

// 2 - Setor
router.post('/categorysetor', isAuthenticated, new CreateSetorController().handle)
router.get('/listsetores', new ListSetoresController().handle)
router.delete('/deletesetor', isAuthenticated, new RemoveSetorController().handle)

// - Informações Setor
router.post('/informacoessetor', isAuthenticated, new CreateInformacoesSetorController().handle)
router.get('/listinformacoessetor', isAuthenticated, new ListInformacaoesSetoresController().handle)

//3 - Instuituicao/Unidade
router.post('/categoryintituicao', new CreateInstituicaoUnidadeController().handle)
router.get('/listinstuicao', new ListInstituicaoUnidadeController().handle)
router.delete('/deleteinstituicao', isAuthenticated, new RemoveInstituicaoUnidadeController().handle)

// tipodeInstituicaoUnidade
router.post ('/tipodeinstituicaounidade', isAuthenticated, new CreatetipodeInstituicaoUnidadeController().handle)
router.get ('/listtipodeinstituicaounidade', isAuthenticated, new ListtipoInsituicaoUnidadeController().handle)

//4 - Tipo de Solicitação (Solicitação, Chamado Tecnico)
router.post('/tipodechamado', isAuthenticated, new CreatetipodeChamadoController().handle)
router.get('/listtipodechamado', new ListtipodeChamadoController().handle)

// 5 - Tecnico
router.post('/tecnico', isAuthenticated, new CreateTecnicoController().handle)
router.get('/listtecnico', isAuthenticated, new ListTecnicoController().handle)
router.delete('/removertecnico/:id', isAuthenticated, new RemoveTecnicoController().handle)

// 6 -  Equipamento
router.post('/equipamento', isAuthenticated, new CreateEquipamentoController().handle)
router.get('/listequipamento', isAuthenticated, new ListEquipamentoController().handle)
router.delete('/deleteequipamento/:id', isAuthenticated, new RemoveEquipamentoController().handle)


// 7 - StatusOrdemdeServicoService
router.post('/statusordemdeservico', isAuthenticated, new CreateStatusOrdemdeServicoController().handle)
export {router}
router.get('/liststatusordemdeservico', isAuthenticated, new ListStatusOrdemdeServicoController().handle)
router.delete('/removestatusordemdeservico', isAuthenticated, new RemoveStatusOrdemServicoController().handle)

// 8 - StatusMaquinasPendentesLab (Pendentes ORO, Substituta)
router.post('/statusMaquinasPendentesLab', isAuthenticated, new CreatestatusMaquinasPendentesController().handle)

router.get('/liststatusMaquinasPendentesLab', isAuthenticated, new ListMaquinasPendentesLabController().handle)

// 9 - StatusMaquinasPendentesOro (DISPONIVEL, INSTALADA, AGUARDANDO RETIRADA, EM MANUTENÇÃO, RESERVADA, DESCARTADA)
router.post('/statusMaquinasPendentesOro', isAuthenticated, new CreatestatusMaquinasPendentesOroController().handle)
router.get('/liststatusMaquinasPendentesOro', isAuthenticated, new ListMaquinasPendentesOroController().handle);

// 10 - StatusControllerdeMaquinasLaboratorio (AGUARDANDO CONSERTO, AGUARDANDO O.S DE LABORATORIO, AGUARDANDO DEVOLUÇÃO, CONCLUIDO)
router.post('/statuscontrolledeLaboratorio', isAuthenticated, new CreatestatusControlledeLaboratorioController().hadle)
router.get('/listcontrolledeLaboratorio', isAuthenticated, new ListstatusControlleLaboratioController().handle)

//12 - StatusCompras (AGUARDANDO, AGUARDANDO ENTREGA, COMPRA FINALIZADA)
router.post('/statuscompras', isAuthenticated, new CreateStatusComprasController().handle)
router.get('/liststatuscompras', isAuthenticated, new ListStatusComprasController().handle)

//13 - StatusReparo (AGUARDANDO REPARO, REPARO FINALIZADO)

router.post('/statusreparo', isAuthenticated, new CreateStatusReparoController().handle)
router.get('/liststatusreparo', isAuthenticated, new ListstatusReparoController().handle)

//14 - Urgência
router.post('/statusurgencia', isAuthenticated, new CreateStatusUrgenciaController().handle)
router.get('/liststatusurgencia', isAuthenticated, new ListStatusUrgenciaController().handle)

//---> FORMULARIOS <---

//CONTROLE DE ASSISTENCIA TÉCNICA
router.post('/controledeassistenciatecnica', isAuthenticated, new CreateControledeAssistenciaTecnicaController().handle)
router.get('/listcontroledeassistenciatecnica', isAuthenticated, new ListControledeAssistenciaTecnicaController().handle);
router.delete('/controledeassistenciatecnica/:id',isAuthenticated, new DeleteControledeAssistenciaTecnicaController().handle);
router.get('/controledeassistenciatecnica/detail', isAuthenticated, new DetailAssistenciaTecnicaController().handle)
router.patch('/assistenciatecnica/update/:id', isAuthenticated, new UpdateAssistenciaTecnicaController().handle)
// CRIAR UPDATE - PACTH

//CONTROLE DE LAUDO TÉCNICO
router.post('/controledelaudotecnico', isAuthenticated, new CreateControledeLaudoTecnicoController().handle)
router.get('/listcontroledelaudotecnico', isAuthenticated, new ListControledeLaudoTecnicoController().handle)
router.delete('/deletecontroledelaudotecnico/:id',isAuthenticated, new DeleteControledeLaudoTecnicoController().handle);
router.get('/controledelaudotecnico/detail', isAuthenticated, new DetailLaudoTenicoController().handle)
router.patch('/laudotecnico/update/:id', isAuthenticated, new UpdateControllerdeLaudoTecnicoController().handle)
//CRIAR UPDATE - PATCH

//CONTROLE DE LABORATORIO
router.post('/controledelaboratorio', isAuthenticated, new CreateControledeLaboratorioController().handle)
router.get('/listcontroledelaboratorio', isAuthenticated, new ListControledeLaboratorioController().handle)
router.delete('/deletecontroledelaboratorio/:id', isAuthenticated, new DeleteControledeLaboratorioController().handle)
router.get('/controledelaboratorio/detail', isAuthenticated, new DetailControledeLaboratorioController().handle)
router.patch('/controledelaboratorio/update/:id', isAuthenticated, new UpdateControledeLaboratorioController().handle)
//CRIAR UPDATE - PATCH

//CONTROLE DE MAQUINAS PENDENTES LAB
router.post('/controledemaquinaspendenteslab', isAuthenticated, new CreateControledeMaquinasPendentesLabController().handle)
router.get('/listcontroledemaquinaspendenteslab', isAuthenticated, new ListControledeMaquinasPendentesLabController().handle)
router.delete('/deletecontroledemaquinaspendenteslab/:id', isAuthenticated, new DeleteControledeMaquinasPendentesLabController().handle)
router.get('/controledemaquinaspendenteslab/detail', isAuthenticated, new DetailMaquinasPendentesLabController().handle)
router.patch('/controledemaquinaspendenteslab/update/:id', isAuthenticated, new UpdateControledeMaquinasPendentesLabController().handle)
//CRIAR UPDATE - PACTH

// CONTROLE DE MAQUINAS PENDENTES ORO
router.post('/controledemaquinaspendentesoro', isAuthenticated, new CreateControledeMaquinasPendentesOroController().handle)
router.get('/listcontroledemaquinaspendentesoro', isAuthenticated, new ListControledeMaquinasPendentesOroController().handle)
router.delete('/deletecontroledemaquinaspendentesoro/:id', isAuthenticated, new DeleteControledeMaquinasPendentesOroController().handle)
router.get('/controledemaquinaspendentesoro/detail', isAuthenticated, new DetailControledeMaquinasPendentesOroController().handle)
router.patch('/controledemaquinaspendentesoro/update/:id', isAuthenticated, new UpdateControledeMaquinasPendentesOroController().handle)
// CRIAR UPDATE - PACTH

//DOCUMENTAÇÃO TÉCNICA
router.post('/documentacaotecnica', isAuthenticated, new CreateDocumentacaoTecnicaController().handle)
router.get('/listdocumentacaotecnica',isAuthenticated, new ListDocumentacaoTecnicaController().handle)
router.delete('/deletedocumentacaotecnica/:id', isAuthenticated, new DeleteDocumentacaoTecnicaController().handle)
router.get('/controlededocumentacaotecnica/detail', isAuthenticated, new DetailDocumentacaoTecnicaController().handle)
router.patch('/documentacaotecnica/update/:id', isAuthenticated, new UpdateDocumentacaoTecnicaController().handle)

//SOLICITACAO DE COMPRAS
router.post('/solicitacaodecompras', isAuthenticated, new CreateSolicitacaodeComprasController().handle)
router.get('/listsolicitacaodecompras', isAuthenticated, new ListSolicitacaodeComprasController().handle)
router.delete('/deletedesolicitacaodecompras/:id', isAuthenticated, new DeleteSolicitacaodeComprasController().handle)
router.get('/compra/detail', isAuthenticated, new DetailComprasController().handle)
router.patch('/compra/update/:id', isAuthenticated, new UpdateSolicitacaodeComprasController().handle)
//FORMULARIO TECNICO


// - CONTINUAR DEPOIS
//ORDEM DE SERVIÇO
router.post('/ordemdeservico', isAuthenticated, new CreateOrdemServicoController().handle)
router.get('/listordemdeservico', isAuthenticated, new ListOrdemdeServicoController().handle)

router.patch(
  '/ordemdeservico/update/:id',
  isAuthenticated, upload.array('files'),
  new UpdateOrdemdeServicoService().handle.bind(new UpdateOrdemdeServicoService())
);
const fotoControllerInstance = new fotoController();
router.get('/foto/:id', fotoControllerInstance.listByOrdem);
router.post('/foto', new fotoController().handle)
router.delete('/foto/:id', new fotoController().delete);

//STATUS ESTABILIZADORES
router.post("/status/estabilizadores", isAuthenticated, new CreateStatusEstabilizadoresController().handle
);

router.get("/liststatus/estabilizadores", isAuthenticated, new ListStatusEstabilizadoresController().handle)

//ESTABILIZADORES
router.post("/equipamento/esbilizadores", isAuthenticated, new CreateEquipamentoEstabilizadorController().handle)
router.get("/list/estabilizador", isAuthenticated, new ListEsquipamentoEstabilizadorController().handle)

//CONTROLE DE ESTABILIZADORES
router.post("/controledeestabilizadores", isAuthenticated, new CreateControledeEstabilizadoresController().handle)
router.get("/listcontroledeestabilizadores", isAuthenticated, new ListControledeEstabilizadoresController().handle)
router.patch("/update/controledeestabilizadores/:id", isAuthenticated, new UpdateControledeEstabilizadoresController().handle)

//ORDEM DE SERVIÇO POR STATUS
router.get('/statusordemdeServico/ordens', isAuthenticated, new ListByStatusTicketsController().handle)
router.get('/tecnicosordemdeServico/ordens', isAuthenticated, new ListByTecnicosTicketsController().handle)

//EVENTOS
router.get("/events", isAuthenticated , getEventsController);
router.post("/events", isAuthenticated , createEventController);
router.put("/events", isAuthenticated , updateEventController);
router.delete("/events/:id", isAuthenticated , deleteEventController);

// TIMES - ORDEM DE SERVICO
router.patch("/ordemdeservico/iniciar/:id", isAuthenticated, timeOrdemDeServicoController.iniciar);
router.patch("/ordemdeservico/concluir/:id", isAuthenticated, timeOrdemDeServicoController.concluir);
router.patch("/ordemdeservico/atualizar-tempo/:id", isAuthenticated, timeOrdemDeServicoController.atualizarTempo);
router.get("/ordemdeservico/tempo/:id", isAuthenticated, timeOrdemDeServicoController.lerTempo);


router.patch("/assinatura/:id", isAuthenticated, AssinaturaController.atualizar);

// GET → buscar assinatura
router.get("/assinatura/:ordemId", isAuthenticated, AssinaturaController.buscar);
