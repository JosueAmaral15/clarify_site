# 🎯 PROTOCOLO SIMPLICIDADE 3 - PERGUNTAS OBRIGATÓRIAS

**Data**: 01/01/2026  
**Autor**: GitHub Copilot CLI  
**Contexto**: Setup inicial do projeto full-stack clarify_site

---

## 📋 STEP 3: PERGUNTAS ESSENCIAIS

Conforme o Protocolo Simplicidade 3, preciso fazer estas perguntas **ANTES** de começar a implementação:

---

### 🌐 QUESTÃO 1: LINGUAGEM DE CÓDIGO

**❓ Qual idioma deseja usar para nomes de variáveis e comentários?**

💡 **Sugestão da IA**: Inglês (projeto full-stack moderno, potencial open-source)

- **A)** 🇺🇸 Inglês - Variáveis e comentários em inglês (RECOMENDADO)

**Sua escolha:** ___A____

---

### 📧 QUESTÃO 2: MÉTODOS DE CONTATO PARA FEEDBACK

**❓ Deseja incluir métodos de contato no projeto para usuários enviarem feedback?**

💡 **Sugestão da IA**: Sim, com múltiplos canais (recomendado para projetos em produção)

**Opções:**
- **A)** ✅ Sim, incluir email para feedback (PADRÃO RECOMENDADO)
- **B)** ✅ Sim, incluir GitHub Issues (para projetos open-source)
- **C)** ✅ Sim, incluir formulário de contato na aplicação
- **D)** ✅ Sim, incluir múltiplos canais (email + issues + form)
- **E)** ❌ Não, não incluir métodos de contato

**Sua escolha:** ____A___  
**Se escolheu A, B, C ou D, qual email:** ___josueamaral15@gmail.com____
Você tem certeza de que para projetos particulares, Github issues não é uma ideia interessante? É porque por lá eu poderia verificar diretamente o que o usuário tem para fornecer de informação sobre o projeto ou sobre o aplicativo.
---

### 🎯 QUESTÃO 3: OBJETIVO E ESCOPO DO SITE

**❓ Qual é o objetivo principal deste site full-stack?**

💡 **Sugestão da IA**: Defina claramente para guiar decisões de arquitetura

**Opções (marque todas que se aplicam):**
- **A)** ✅ Portfolio/Apresentação pessoal ou empresa
- **B)** ✅ E-commerce/Loja virtual
- **C)** ✅ Blog/Sistema de conteúdo
- **D)** ✅ Dashboard/Painel administrativo
- **E)** ✅ API REST para consumo externo
- **F)** ✅ Sistema de autenticação/usuários
- **G)** ✅ Aplicação SaaS (Software as a Service)
- **H)** ⚙️ Outro: ___apresentação do aplicativo Clarify, desenvolvido com a linguagem Python e podendo estar em diversas plataformas e formatos, como .deb para linux____

**Suas escolhas:** ___H____

---

### 🛠️ QUESTÃO 4: STACK TECNOLÓGICO

**❓ Qual stack deseja usar?**

💡 **Sugestão da IA** (baseado em melhores práticas 2026):

#### **FRONTEND:**
- **A)** ✅ React + TypeScript + Vite (moderno, rápido, HMR)
- **B)** ✅ Next.js 14+ (SSR, SEO-friendly, App Router)
- **C)** ✅ Vue 3 + TypeScript (Composition API)
- **D)** ⚙️ Outro: _______

Resposta: A

#### **BACKEND:**
- **A)** ✅ Node.js + Express + TypeScript (JavaScript full-stack)
- **B)** ✅ Node.js + Fastify (alta performance)
- **C)** ✅ Python + FastAPI (tipado, moderno, async)
- **D)** ✅ Python + Django (completo, batteries included)
- **E)** ⚙️ Outro: _______

Resposta: A

#### **BANCO DE DADOS:**
- **A)** ✅ PostgreSQL (relacional robusto, ACID)
- **B)** ✅ MongoDB (NoSQL flexível, document-based)
- **C)** ✅ MySQL/MariaDB (relacional tradicional)
- **D)** ✅ SQLite (desenvolvimento/protótipo)
- **E)** ⚙️ Outro: _______

Resposta: B

**Suas escolhas:**
- **Frontend:** ___A____
- **Backend:** ____A___
- **Database:** ___B____

---

### 🔒 QUESTÃO 5: REQUISITOS DE SEGURANÇA

**❓ Quais features de segurança são necessárias?**

💡 **Sugestão da IA**: Todas as obrigatórias + JWT para autenticação

#### **Obrigatórias (conforme Protocolo Simplicidade 3 - Step 6.5):**
- ☑️ **OWASP Top 10 checklist** (OBRIGATÓRIO)
- ☑️ **Validação de input** (OBRIGATÓRIO)
- ☑️ **Proteção CSRF** (OBRIGATÓRIO)
- ☑️ **Headers de segurança** (OBRIGATÓRIO - Helmet.js ou similar)
- ☑️ **Rate limiting** (OBRIGATÓRIO)

#### **Opcionais:**
- **A)** ✅ Autenticação JWT
- **B)** ✅ OAuth2/Social login (Google, GitHub, etc)
- **C)** ✅ 2FA (Two-Factor Authentication)
- **D)** ✅ RBAC (Role-Based Access Control)
- **E)** ❌ Não precisa de autenticação

**Suas escolhas opcionais:** ____todas as opcionais, com exceção da E___

---

### 🚀 QUESTÃO 6: CI/CD E DEPLOYMENT

**❓ Onde e como deseja fazer deploy?**

💡 **Sugestão da IA**: GitHub Actions (gratuito) + Vercel/Railway (tier gratuito para MVP)

**⚠️ IMPORTANTE:** Step 10.6 do Protocolo torna CI/CD **OBRIGATÓRIO** para produção!

#### **PLATAFORMA DE DEPLOY:**
- **A)** ✅ Vercel (frontend) + Railway/Render (backend) - Gratuito
- **B)** ✅ Netlify (frontend) + Heroku (backend)
- **C)** ✅ AWS (EC2/S3/RDS) - Profissional, pago
- **D)** ✅ DigitalOcean/Linode - VPS, controle total
- **E)** ✅ Docker + VPS próprio
- **F)** ⚙️ Outro: _______

Resposta: A

#### **CI/CD:**
- **A)** ✅ GitHub Actions (RECOMENDADO - gratuito, 2000 min/mês)
- **B)** ✅ GitLab CI
- **C)** ✅ Jenkins (self-hosted)
- **D)** ❌ Manual (não recomendado para produção)

**Suas escolhas:**
- **Plataforma:** ___A____
- **CI/CD:** ___A____

---

### 📊 QUESTÃO 7: FEATURES PRINCIPAIS (MVP)

**❓ Quais features são MUST HAVE para a primeira versão?**

💡 **Sugestão da IA**: Comece simples, incremente depois (filosofia do protocolo: "sempre começar com as tarefas mais simples")

**Marque apenas as ESSENCIAIS (MoSCoW - Must Have):**
- **A)** ☐ Homepage/Landing page
- **B)** ☐ Sistema de usuários (registro/login/logout)
- **C)** ☐ CRUD básico de [especificar entidade]: _______
- **D)** ☐ Dashboard/Admin panel
- **E)** ☐ API REST endpoints (listagem, criação, edição, deleção)
- **F)** ☐ Busca/Filtros
- **G)** ☐ Upload de arquivos (imagens, documentos)
- **H)** ☐ Notificações (email/push)
- **I)** ☐ Outro: _______

**Suas escolhas MUST HAVE:** ___todos____

---

### ⏱️ QUESTÃO 8: PRAZOS E PRIORIDADES

**❓ Qual o prazo desejado para MVP?**

💡 **Sugestão da IA**: 2-4 semanas (realista para solo developer seguindo o protocolo)

**Opções:**
- **A)** ✅ 1-2 semanas (mínimo viável, features básicas)
- **B)** ✅ 2-4 semanas (recomendado - MVP completo testado)
- **C)** ✅ 1-2 meses (features avançadas + polimento)
- **D)** ✅ Sem prazo definido (desenvolvimento incremental)

**Sua escolha:** ____D___

---

## 📝 PRÓXIMOS PASSOS

Após receber suas respostas, vou:

1. ✅ **Criar estrutura de pastas** separadas `frontend/` e `backend/`
2. ✅ **Configurar stack tecnológico** escolhido com melhores práticas
3. ✅ **Gerar sprints realistas** conforme Protocolo Simplicidade 3
4. ✅ **Aplicar OWASP checklist** completo (Step 6.5 obrigatório)
5. ✅ **Configurar CI/CD pipeline** (Step 10.6 obrigatório)
6. ✅ **Criar plano de rollback** (Step 12.5 obrigatório)
7. ✅ **Documentar tudo** em `docs/TASKS.md`, sprints, e especificações

---

## 💡 COMO RESPONDER

Você pode responder de 2 formas:

### **Opção 1: Editar este arquivo**
```bash
nano docs/QUESTIONS_SETUP.md
# Preencha os campos "_______" e salve
```

### **Opção 2: Criar arquivo de respostas**
```bash
cat > docs/ANSWERS.txt << 'EOF'
Q1: A (Inglês)
Q2: D (múltiplos canais), email: seu@email.com
Q3: A, C, F (Portfolio, Blog, Auth)
Q4_FRONTEND: A (React + TS + Vite)
Q4_BACKEND: C (Python + FastAPI)
Q4_DATABASE: A (PostgreSQL)
Q5: A, D (JWT + RBAC)
Q6_PLATFORM: A (Vercel + Railway)
Q6_CICD: A (GitHub Actions)
Q7: A, B, E (Homepage, Auth, API REST)
Q8: B (2-4 semanas)
EOF
```

---

**Aguardo suas respostas para começar!** 🚀
