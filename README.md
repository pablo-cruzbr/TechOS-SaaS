# Gestão Full Stack de Serviços de TI e Ativos
## Gerenciando sua Empresa de Informática de A a Z
<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" /></a>
  <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=white" /></a>
</p>
## 🚀 Sobre o Projeto

> Sistema SaaS fullstack Web + Mobile em produção em 15+ órgãos públicos municipais.

## 🚨 O Problema

Empresas de informática gerenciavam chamados em sistemas legados com navegação 
fragmentada de 5 a 6 telas por atendimento. O processo era lento, gerava retrabalho 
dos técnicos de campo e dificultava o controle dos gestores.

## ✅ A Solução

O TechOS unificou todo o fluxo em 2 telas com interface mobile-first para 
técnicos e painel web para gestores, substituindo o sistema anterior (ALVO) por 
uma experiência integrada e intuitiva.

## 📊 Impacto Real

| Métrica | Antes | Depois |
|---|---|---|
| Telas por atendimento | 5-6 telas | 2 telas |
| Etapas de preenchimento | 100% | Redução de 83% |
| Órgãos públicos atendidos | 0 | 15+ municípios |
| Tempo de desenvolvimento | — | 6 meses (jun-dez/2025) |

## 🏗️ Contexto

Desenvolvido paralelamente à atuação como técnico de helpdesk N2, o projeto 
foi validado com técnicos de campo em cada feature, apresentado à gestão com 
protótipo funcional de 3 módulos-chave e aprovado para produção — resultando 
em promoção a Desenvolvedor Fullstack.

Atualmente em implantação em prefeituras, escolas e postos de saúde.

Ele foi projetado para **facilitar a rotina operacional**, organizar atendimentos e melhorar a comunicação entre técnicos e clientes.  

<img width="1280" height="800" alt="5" src="https://github.com/user-attachments/assets/2a391f74-2da2-4bd9-94e6-3dc382919e3e" />
---

<img width="1280" height="800" alt="os web" src="https://github.com/user-attachments/assets/d77e498b-efb2-4248-af87-32ebb5050c4e" />

---

<img width="1280" height="800" alt="web" src="https://github.com/user-attachments/assets/95147eff-d224-4f8e-894d-3b751a39dfc4" />

---

<img width="1280" height="800" alt="8" src="https://github.com/user-attachments/assets/2c65e271-6da0-4d9f-8c9e-28d120429567" />
---

Principais funcionalidades:  
- Registro completo de OS e tickets internos
- Cadastrado de Novos usuários
- Cadastro de Empresas e Instituições Unidade com emdereço e cnpj
- Agenda técnica integrada (diária, semanal, mensal)  
- Aplicativo mobile para técnicos em **React Native**  
- Integração com **Google Maps** e **Waze**  
- Assinatura digital de ordens concluídas  
- Gestão de clientes, unidades e endereços  
- Cadastro e controle de máquinas cadastradas por patrimônio, Assistencia Técnica, Laudo Técnico, Máquinas em Laboratório, Maquinas Pendentes e Estabilizadores e controle de status
- Cadastrado de Técnicos 
- Painel administrativo moderno em **Next.js e Saas**  
- Backend seguro com **Node.js**, **Express**, **PostgreSQL** e **Prisma**  
- Autenticação JWT e criptografia com bilbioteca bcrypt
- Biblioteca cors para permissão de rotas  

---

## 📌 Funcionalidades

### 💻 Web App
- Dashboard de OS abertas, em andamento e concluídas  
- Agenda/Calendário Técnico  
- Gestão de clientes e unidades (privadas, públicas, escolas, empresas)  
- Cadastro de máquinas e controle de manutenção  
- Documentação técnica com assinatura digital  
- Cadastro de técnicos e controle de acessos  
- Login seguro com JWT Json Web Token  (salva o tokens nos cookies do navegador)

### 📱 Mobile App
- Visualização de ordens atribuídas ao técnico  
- Geolocalização para rotas  (Waze e Google Maps)
- Formulário de atendimento  
- Upload e envio de imagens (biblioteca expo-image-picker)  - (Armazenamento em nuvem - Cloudinary)
- Assinatura Digital (react-native-signature-canvas)
- Conclusão de Ordens de Serviço
  
---

## 🛠 Tecnologias Utilizadas

| Frontend Web | Backend | Mobile App |
|--------------|---------|------------|
| Next.js | Node.js | React Native |
| React.js | Express | Expo |
| TypeScript | PostgreSQL | Context API + AsyncStorage |
| SCSS Modular | Prisma | Axios |

**Outras Bibliotecas:** Axios, JWT, Bcrypt, componentes customizados e responsivos, gráficos no dashboard.  

---

## 💡 Motivação

Empresas de informática no Brasil enfrentam um problema silencioso: sistemas de 
gestão desatualizados que fragmentam o atendimento técnico em múltiplas telas, 
dificultam o controle de ativos e travam o fluxo de trabalho dos técnicos de campo.

O resultado é atendimento lento, retrabalho constante e gestores sem visibilidade 
real do que acontece na operação.

O AlltiControl foi construído para resolver exatamente isso: unificar a operação 
em uma interface mobile-first para técnicos e um painel web para gestores, 
eliminando o atrito do processo e devolvendo tempo para quem trabalha na ponta.

---
## Problemas Conhecidos e Soluções (Concluído e Resolvido !)
Corrigindo bugs críticos que afetam o cálculo preciso do tempo das Ordens de Serviço (OS). (Inicio, Pausa e Retomar Ordem de Serviço)
Solução: Foi feito uma Renderização Condicional para solução do problema 

## 🔜 Próximos Passos / Melhorias Futuras
- Fazer Deploy na Vercel
- Criar Funcionalidade de Transformar audio em texto para documentação técnica (biblioteca: Expo Speech)
- Notificações push no app mobile  
- Relatórios customizados e gráficos avançados
- Criar permissões de logins usando nodeJS (jsonwebtoken (JWT))
- Implementar validação com Zod ou Joi nas rotas da API (Maturidade/Segurança).



---

## 📁 Em que fase está o Projeto



⚙️ Este projeto está em constante atualização e atualmente em processo de desenvolvimento/implementação.

