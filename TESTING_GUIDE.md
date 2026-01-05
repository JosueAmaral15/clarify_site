# 🧪 Guia Rápido de Testes - Clarify Site

**Data**: 05 de Janeiro de 2026  
**Status**: Pronto para Testes Manuais

---

## 🚀 Início Rápido

### 1. Iniciar Backend
```bash
cd backend
npm run dev
# Deve exibir: "Server running on port 5000"
# Deve exibir: "MongoDB connected successfully"
```

### 2. Iniciar Frontend
```bash
# Em outro terminal
cd frontend
npm run dev
# Deve abrir: http://localhost:5174
```

---

## 🔐 Credenciais de Admin

**Email**: `josueamaral15@gmail.com`  
**Senha**: `Admin@123456`  
⚠️ **IMPORTANTE**: Trocar senha após primeiro login!

---

## ✅ Testes Rápidos (5 minutos)

### Teste 1: Login Admin (1 min)
1. Abra: http://localhost:5174/admin/login
2. Entre com credenciais acima
3. ✅ Deve redirecionar para dashboard
4. ✅ Deve exibir gráficos e estatísticas

### Teste 2: Homepage (1 min)
1. Abra: http://localhost:5174/
2. ✅ Hero section com estatísticas animadas
3. ✅ Features grid com 8 recursos
4. ✅ Tools showcase com 5 ferramentas
5. ✅ Download section com 3 plataformas
6. ✅ Testimonials com 4 depoimentos
7. ✅ Final CTA com newsletter

### Teste 3: Formulário de Contato (1 min)
1. Role até seção de contato na homepage
2. Preencha: Nome, Email, Assunto, Mensagem
3. Clique "Enviar Mensagem"
4. ✅ Deve exibir: "Mensagem enviada com sucesso!"
5. ✅ Verifique no dashboard admin (seção Contacts)

### Teste 4: Download Tracking (1 min)
1. Role até seção de download
2. Clique "Download para Linux"
3. ✅ Deve mostrar: "Download iniciado!"
4. ✅ Verifique no dashboard admin (seção Downloads)

### Teste 5: Registro de Usuário (1 min)
1. Abra: http://localhost:5174/register
2. Preencha formulário completo
3. ✅ Senha deve ter: 8+ chars, maiúscula, minúscula, número, especial
4. Clique "Registrar"
5. ✅ Deve redirecionar para dashboard do usuário

---

## 📱 Teste de Responsividade (2 minutos)

### Mobile (320px)
1. Abra DevTools (F12)
2. Selecione "iPhone SE" ou similar
3. Navegue pela homepage
4. ✅ Menu hamburger funciona
5. ✅ Cards empilham verticalmente
6. ✅ Botões clicáveis e legíveis

### Tablet (768px)
1. Selecione "iPad" ou similar
2. ✅ Grid mostra 2 colunas
3. ✅ Navegação responsiva

### Desktop (1920px)
1. Tela cheia
2. ✅ Layout centralizado
3. ✅ Espaçamento adequado

---

## 🔒 Teste de Segurança (3 minutos)

### Teste 1: Rota Protegida
1. Abra: http://localhost:5174/dashboard
2. **Sem login**: ✅ Deve redirecionar para /login
3. **Com login**: ✅ Deve exibir dashboard

### Teste 2: Rota Admin
1. Abra: http://localhost:5174/admin/dashboard
2. **Sem login**: ✅ Redireciona para /admin/login
3. **Login normal (não-admin)**: ✅ Acesso negado
4. **Login admin**: ✅ Exibe dashboard

### Teste 3: Rate Limiting
1. Envie 6 mensagens de contato seguidas
2. ✅ 6ª mensagem deve retornar erro 429
3. Aguarde 1 hora ou reinicie servidor

---

## 🐛 Teste de Erros (2 minutos)

### Formulário de Contato
- ✅ Email inválido: Mostra erro
- ✅ Campos vazios: Mostra erro
- ✅ Mensagem muito curta (<10 chars): Mostra erro

### Login
- ✅ Email incorreto: "Credenciais inválidas"
- ✅ Senha incorreta: "Credenciais inválidas"
- ✅ Email não registrado: "Usuário não encontrado"

### Registro
- ✅ Email já existe: "Email já cadastrado"
- ✅ Senha fraca: Mostra requisitos
- ✅ Senhas não coincidem: Mostra erro

---

## 🎨 Teste de Dark Mode (1 minuto)

1. A aplicação já está em dark mode por padrão
2. ✅ Todas as páginas usam cores escuras
3. ✅ Texto legível (contraste adequado)
4. ✅ Botões e cards visíveis

---

## ⚡ Teste de Performance (1 minuto)

### Lighthouse (Chrome DevTools)
1. Abra homepage
2. F12 > Lighthouse
3. Selecione "Desktop" e "Performance"
4. Clique "Analyze page load"
5. ✅ Performance > 90
6. ✅ Accessibility > 95
7. ✅ Best Practices > 90
8. ✅ SEO > 90

---

## 📊 Teste de API (via Terminal)

### Login Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"josueamaral15@gmail.com","password":"Admin@123456"}'
```
✅ Deve retornar token JWT

### Estatísticas
```bash
# Copie o token do comando acima
curl -X GET http://localhost:5000/api/analytics/stats \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```
✅ Deve retornar estatísticas

### Contato
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Teste",
    "email":"teste@exemplo.com",
    "subject":"Teste API",
    "message":"Esta é uma mensagem de teste via API"
  }'
```
✅ Deve retornar sucesso

---

## 🔍 Verificações no MongoDB

### Via MongoDB Compass
1. Conecte com a URI do .env
2. Database: `clarify_site`
3. Verifique collections:
   - ✅ `users` (deve ter admin)
   - ✅ `contacts` (deve ter submissões)
   - ✅ `downloads` (deve ter tracking)
   - ✅ `newsletters` (se alguém se inscreveu)

---

## ✅ Checklist Final

- [ ] Backend inicia sem erros
- [ ] Frontend inicia sem erros
- [ ] MongoDB conectado
- [ ] Admin login funciona
- [ ] Dashboard exibe dados
- [ ] Homepage carrega rápido (<2s)
- [ ] Formulário de contato funciona
- [ ] Download tracking funciona
- [ ] Registro de usuário funciona
- [ ] Rotas protegidas funcionam
- [ ] Responsividade OK (mobile/tablet/desktop)
- [ ] Dark mode consistente
- [ ] Sem erros no console
- [ ] Performance Lighthouse >90

---

## 🚨 Problemas Comuns

### Backend não inicia
- Verifique se MongoDB URI está correto no `.env`
- Verifique se MongoDB Atlas permite seu IP
- Execute: `npm install` novamente

### Frontend não conecta ao backend
- Verifique `frontend/.env`: `VITE_API_BASE_URL=http://localhost:5000/api`
- Verifique se backend está rodando
- Verifique CORS no backend

### Login não funciona
- Verifique se admin foi criado: `node backend/create-admin.js`
- Verifique senha: `Admin@123456` (case-sensitive)

---

## 📞 Suporte

**Email**: josueamaral15@gmail.com  
**Documentação**: `/docs`  
**Issues**: GitHub (se configurado)

---

**Última Atualização**: 05 de Janeiro de 2026  
**Versão do Guia**: 1.0.0  
**Status**: Pronto para Testes ✅
