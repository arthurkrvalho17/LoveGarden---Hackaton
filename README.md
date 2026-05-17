# 🌸 LoveGarden

Uma homenagem interativa para o Dia das Mães. Plante flores virtuais com mensagens especiais e compartilhe o jardim com quem você ama.

**Acesse:** [arthurkrvalho17.github.io/LoveGarden---Hackaton](https://arthurkrvalho17.github.io/LoveGarden---Hackaton/)

---

## Como usar

### 1. Entrar no jardim

Na tela inicial, clique em **Entrar no Jardim**. Você será levado ao seu jardim pessoal, onde pode começar a plantar flores.

### 2. Plantar uma flor

1. Toque no botão **🌸** no canto inferior direito para abrir o menu de flores
2. Escolha entre **Rosa**, **Girassol** ou **Tulipa**
3. **Arraste** a flor até o jardim e **solte** onde quiser plantá-la
4. Preencha o título e a mensagem da memória (opcional: adicione uma foto)
5. Clique em **Plantar!**

### 3. Ver e editar uma flor

Toque em qualquer flor já plantada para ver a mensagem guardada nela.

- **✏️** — edita o título, mensagem ou foto
- **🪣** — remove a flor do jardim

### 4. Modo noturno

Clique no botão **🌙** na barra superior para alternar entre o jardim diurno e noturno. No modo noite:

- O céu escurece com estrelas e uma lua
- As flores se transformam em plantas noturnas brilhantes
- A música muda automaticamente para uma trilha ambiente 2am

Clique em **☀️** para voltar ao modo dia.

### 5. Música

A música começa automaticamente ao entrar no jardim.

- **🎵** — ativa a música
- **🔇** — silencia a música

A faixa troca automaticamente entre jazz de jardim (dia) e ambient noturno (noite) ao alternar o modo.

### 6. Salvar e compartilhar

Clique em **💾 Salvar** para guardar o jardim. Após salvar, um link único será gerado — copie e envie para quem você quer presentear. Quem receber o link poderá visualizar o jardim e ler todas as mensagens das flores.

---

## Estrutura do projeto

```
LoveGarden/
├── frontend/          # Aplicação Angular (GitHub Pages)
│   └── src/
│       ├── app/
│       │   ├── pages/
│       │   │   ├── home/      # Tela inicial
│       │   │   └── garden/    # Jardim interativo
│       │   └── core/
│       │       ├── models/    # Interfaces TypeScript
│       │       └── services/  # Comunicação com a API
│       └── assets/
│           └── musics/        # Trilhas de fundo (dia e noite)
├── backend/           # API Spring Boot (Railway)
│   └── src/main/java/com/br/LoveGarden/
│       ├── controller/
│       ├── service/
│       ├── model/
│       └── repository/
└── design/
    └── plantas-noturnas.html  # Referência dos SVGs nocturnos
```

---
## Como Acessar? 
- Acesso o link: https://arthurkrvalho17.github.io/LoveGarden---Hackaton/#/
  
## Rodando localmente

### Pré-requisitos

- Node.js 18+
- Java 21
- Maven 3.9+
- MongoDB (local ou Atlas)

### Backend

```bash
cd backend

# Configure as variáveis de ambiente
# MONGODB_URI=mongodb://localhost:27017/lovegarden
# CORS_ORIGINS=http://localhost:4200

./mvnw spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

### Frontend

```bash
cd frontend

npm install
npm start
```

Acesse `http://localhost:4200`.

---

## Deploy

| Camada | Plataforma | Trigger |
|--------|-----------|---------|
| Frontend | GitHub Pages | Push na `main` com mudanças em `frontend/**` |
| Backend | Railway | Push na `main` (Railpack auto-build) |

---

## Tecnologias

- **Frontend:** Angular 21, TypeScript, CSS puro
- **Backend:** Spring Boot 4, Spring Data MongoDB
- **Banco de dados:** MongoDB Atlas
- **Áudio:** ffmpeg (compressão), Web Audio API
- **CI/CD:** GitHub Actions
