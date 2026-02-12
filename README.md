# 🏋️ Workout Manager API

API REST para gerenciamento de treinos e exercícios, desenvolvida com foco em boas práticas de arquitetura, modelagem relacional profissional, validação de dados e organização de código com NestJS.

---

## 🚀 Tecnologias Utilizadas

- Node.js  
- NestJS  
- Prisma ORM  
- PostgreSQL  
- Docker & Docker Compose  
- Class Validator  
- Bcrypt  
- JWT  
- TypeScript  

---

## 🧠 Funcionalidades

✔ Cadastro e login de usuários  
✔ Autenticação segura com JWT  
✔ Criptografia de senha  
✔ CRUD de Exercícios (catálogo)  
✔ CRUD de Treinos  
✔ Adicionar exercícios a um treino  
✔ Definir séries, repetições e carga  
✔ Marcar exercício como concluído  
✔ Atualização automática do status do treino  
✔ Relacionamento N:N com dados extras (WorkoutExercise)  
✔ Validação de DTOs  
✔ Estrutura modular seguindo padrão do NestJS  

---

## 🏗️ Arquitetura

O projeto segue arquitetura modular por domínio:

```bash
src/
 ├── modules
 │   ├── auth
 │   ├── users
 │   ├── workouts
 │   ├── exercises
 │   └── workout-exercises
 ├── prisma
 └── main.ts
```

**Princípios aplicados**

- Separação por domínio  
- Services responsáveis por regra de negócio  
- Controllers apenas para camada HTTP  
- Prisma isolado em módulo próprio  
- DTOs para validação  
- Relacionamentos modelados corretamente  

---

## 🧠 Modelagem do Banco

```text
User 1 ─── N Workout
Workout 1 ─── N WorkoutExercise
Exercise 1 ─── N WorkoutExercise
```

A tabela `WorkoutExercise` resolve o relacionamento N:N entre treinos e exercícios, armazenando:

- séries  
- repetições  
- peso  
- status de conclusão  
- comentários do usuário  

---

## ⚙️ Como rodar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone <repo-url>
cd workout-manager-api
```

---

### 2️⃣ Criar o arquivo de ambiente

```bash
cp .env.example .env
```

Ou manualmente:

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/workout_manager?schema=public"
JWT_SECRET="supersecretkey"
```

---

### 3️⃣ Subir a aplicação com Docker

```bash
docker-compose up --build
```

A API estará disponível em:

```
http://localhost:3001
```

---

## 🐳 O que o Docker faz automaticamente

- Instala dependências  
- Gera Prisma Client  
- Executa migrations  
- Build da aplicação  
- Inicializa o servidor NestJS  

Ambiente totalmente reprodutível.

---

## 🛠 Rodar comandos dentro do container (opcional)

```bash
docker exec -it workout_manager_app bash
```

---

## 📦 Principais Endpoints

### 👤 Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/users` | Criar usuário |
| GET | `/users` | Listar usuários |
| GET | `/users/:id` | Buscar usuário |
| DELETE | `/users/:id` | Remover usuário |

---

### 🔐 Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/login` | Login do usuário |

---

### 🧠 Exercícios

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/exercises` | Criar exercício |
| GET | `/exercises` | Listar exercícios |
| GET | `/exercises/:id` | Buscar exercício |
| PATCH | `/exercises/:id` | Atualizar exercício |
| DELETE | `/exercises/:id` | Remover exercício |

---

### 🏋️ Treinos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/workouts` | Criar treino |
| GET | `/workouts` | Listar treinos do usuário |
| GET | `/workouts/:id` | Buscar treino com exercícios |
| DELETE | `/workouts/:id` | Remover treino |

---

### ➕ Exercícios dentro do Treino

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/workouts/:workoutId/exercises` | Adicionar exercício ao treino |
| PATCH | `/workout-exercises/:id` | Atualizar séries, reps ou peso |
| PATCH | `/workout-exercises/:id/complete` | Marcar exercício como concluído |
| DELETE | `/workout-exercises/:id` | Remover exercício do treino |

---

## 🔐 Segurança

- Senhas criptografadas com **bcrypt**  
- Autenticação com **JWT**  
- DTOs validados com **class-validator**  
- Dados sensíveis não retornados nas respostas  

---

## 🧪 Futuras melhorias

- Testes unitários  
- Testes e2e  
- Swagger para documentação automática  
- Logs estruturados  
- Deploy em cloud  

---

## 📄 Licença

Este projeto está sob a licença MIT.
