# 🚀 Clarify Site - Sprint 3 Setup Guide

## Sprint 3 - Admin Dashboard & Analytics

Este guia mostra como configurar e testar o dashboard administrativo criado no Sprint 3.

---

## 📋 Pré-requisitos

- Node.js v18+ instalado
- MongoDB rodando (local ou Atlas)
- Git instalado

---

## 🛠️ Setup Inicial

### 1. Clone e Instale Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure as Variáveis de Ambiente

**Backend** (`backend/.env`):
```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/clarify_site

# JWT Secret (gere uma chave segura)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173

# Admin Credentials (para seed)
ADMIN_EMAIL=admin@clarify.com
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Admin Clarify

# Email (opcional para Sprint 3)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server
PORT=5000
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

---

## 👤 Criar Usuário Admin

Execute o script de seed para criar o primeiro usuário admin:

```bash
cd backend
npm run seed:admin
```

Você verá:
```
✅ Conectado ao MongoDB
✅ Usuário admin criado com sucesso!
📧 Email: admin@clarify.com
🔑 Senha: Admin@123456

⚠️  IMPORTANTE: Altere a senha após o primeiro login!
```

---

## 🏃‍♂️ Rodar o Projeto

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Deve exibir:
```
🚀 Server running on http://localhost:5000
📊 Environment: development
✅ MongoDB connected successfully
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Deve exibir:
```
VITE v7.3.0  ready in 500 ms

➜  Local:   http://localhost:5173/
```

---

## 🧪 Testar o Admin Dashboard

### 1. Acesse a Página de Login Admin

Abra: http://localhost:5173/admin/login

**Credenciais**:
- Email: `admin@clarify.com`
- Senha: `Admin@123456`

### 2. Após Login Bem-Sucedido

Você será redirecionado para: http://localhost:5173/admin/dashboard

### 3. Dashboard - O que você verá:

#### 📊 Cards de Estatísticas:
- **Downloads**: Total e crescimento mensal
- **Contatos**: Total e crescimento mensal  
- **Newsletter**: Total de assinantes e crescimento

#### 📈 Gráficos:
- **Downloads - Últimos 30 Dias**: Line chart mostrando timeline
- **Downloads por Plataforma**: Pie chart com distribuição (Windows, Linux, macOS)

#### 📋 Tabelas:
- **Downloads Recentes**: 10 últimos downloads (email, plataforma, versão, data)
- **Contatos Recentes**: 10 últimos contatos (nome, email, assunto, data, status)

---

## 🔐 Endpoints da API Admin

Todos os endpoints requerem autenticação com token JWT no header:
```
Authorization: Bearer <seu-token-jwt>
```

### Autenticação

**Login Admin**:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@clarify.com",
  "password": "Admin@123456"
}
```

**Resposta**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "admin@clarify.com",
      "name": "Admin Clarify",
      "role": "admin"
    }
  }
}
```

### Analytics Endpoints

**1. Dashboard Stats**:
```bash
GET http://localhost:5000/api/analytics/stats
Authorization: Bearer <token>
```

**2. Recent Downloads**:
```bash
GET http://localhost:5000/api/analytics/downloads
Authorization: Bearer <token>
```

**3. Downloads by Platform**:
```bash
GET http://localhost:5000/api/analytics/downloads/by-platform
Authorization: Bearer <token>
```

**4. Downloads Timeline (30 days)**:
```bash
GET http://localhost:5000/api/analytics/downloads/timeline
Authorization: Bearer <token>
```

**5. Recent Contacts**:
```bash
GET http://localhost:5000/api/analytics/contacts
Authorization: Bearer <token>
```

**6. Newsletter Subscribers**:
```bash
GET http://localhost:5000/api/analytics/newsletter
Authorization: Bearer <token>
```

---

## 🧪 Popular Banco de Dados com Dados de Teste

Para testar os gráficos e tabelas, você pode criar dados de teste:

### Via Frontend:
1. Acesse: http://localhost:5173
2. Vá para a seção "Download"
3. Clique em "Download for Windows/Linux/macOS" várias vezes
4. Vá para "Contato" e envie alguns formulários

### Via MongoDB Compass ou CLI:
Conecte no banco `clarify_site` e insira documentos manualmente nas collections:
- `downloads`
- `contacts`
- `newsletters`

---

## 🔒 Segurança Implementada

✅ **Autenticação JWT**: Tokens expiram em 24h  
✅ **Password Hashing**: bcrypt com 12 rounds  
✅ **Protected Routes**: Middleware requireAuth + requireAdmin  
✅ **Input Validation**: express-validator em todos os endpoints  
✅ **Rate Limiting**: Proteção contra brute force  
✅ **CORS**: Apenas frontend autorizado  
✅ **Helmet**: Headers de segurança OWASP  

---

## 📦 Estrutura de Arquivos Criados

```
backend/
├── src/
│   ├── routes/
│   │   ├── analytics.ts          # ✅ NEW - 6 endpoints de analytics
│   │   └── auth.ts                # ✅ NEW - Login/Register admin
│   ├── scripts/
│   │   └── createAdmin.ts         # ✅ NEW - Seed do admin
│   └── server.ts                  # ✅ UPDATED - Integrou analytics

frontend/
├── src/
│   ├── pages/
│   │   ├── AdminLogin.tsx         # ✅ NEW - Página de login
│   │   └── AdminDashboard.tsx     # ✅ NEW - Dashboard com charts
│   └── App.tsx                    # ✅ UPDATED - Rotas admin
```

---

## 🐛 Troubleshooting

### Erro: "MongoDB connection failed"
- Verifique se MongoDB está rodando
- Confirme a URL no `.env` (MONGO_URI)
- Teste: `mongosh` no terminal

### Erro: "Token inválido"
- Limpe localStorage: `localStorage.clear()` no console do navegador
- Faça login novamente

### Erro: "Já existe um usuário admin"
- O script `seed:admin` só cria admin se não existir
- Para resetar, delete o usuário no MongoDB e rode novamente

### Gráficos vazios no Dashboard
- Precisa ter dados de downloads/contacts no banco
- Use o site público para gerar downloads
- Ou insira dados manualmente via MongoDB Compass

---

## ✅ Checklist de Testes

- [ ] Backend inicia sem erros
- [ ] Frontend inicia sem erros
- [ ] Login admin funciona
- [ ] Redirect para dashboard após login
- [ ] Stats cards exibem números
- [ ] Line chart renderiza
- [ ] Pie chart renderiza
- [ ] Tabela de downloads exibe dados
- [ ] Tabela de contatos exibe dados
- [ ] Logout funciona
- [ ] Redirect para login se token inválido

---

## 🎯 Próximos Passos

Após Sprint 3, os próximos sprints são:

- **Sprint 7**: CI/CD & Testing
  - GitHub Actions
  - Vercel/Railway deployment
  - Testes automatizados

- **Sprint 8**: Documentation & Launch
  - API docs finais
  - OWASP checklist
  - Go live! 🚀

---

## 📝 Notas Importantes

1. **Senha do Admin**: Troque `Admin@123456` em produção!
2. **JWT_SECRET**: Use uma chave forte (32+ caracteres) em produção
3. **MongoDB**: Use MongoDB Atlas em produção, não localhost
4. **HTTPS**: Em produção, sempre use HTTPS
5. **Logs**: Em produção, use logging service (Winston + CloudWatch/Sentry)

---

**Sprint 3 Status**: ✅ COMPLETO  
**Última Atualização**: Janeiro 04, 2026  
**Próximo Sprint**: Sprint 7 (CI/CD)

🎉 **Parabéns! O Admin Dashboard está funcionando!**
