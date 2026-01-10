# Integração Front-end e Back-end

## Resumo da Integração

A integração entre o front-end React/TypeScript e o back-end Django REST foi concluída com sucesso. Todas as páginas principais agora consomem a API REST ao invés de usar localStorage.

## Arquitetura

### Back-end (Django REST Framework)
- **Base URL**: `http://localhost:8000`
- **Modelos**: Aluno, Curso, Matricula
- **Endpoints principais**:
  - `/alunos/` - CRUD completo de alunos
  - `/cursos/` - CRUD de cursos (sem DELETE)
  - `/matriculas/` - CRUD completo de matrículas
  - `/alunos/{id}/matriculas/` - Listar matrículas de um aluno
  - `/cursos/{id}/matriculas/` - Listar alunos matriculados em um curso

### Front-end (React + TypeScript)
- **Arquivo principal de API**: `src/services/api.ts`
- **Biblioteca HTTP**: Axios
- **Tipos TypeScript**: Todos os modelos tipados

## Arquivos Modificados

### Backend
- ✅ `back-end/setup/settings.py` - Adicionado suporte CORS para `localhost:5173`

### Frontend - Serviços
- ✅ `src/services/api.ts` - Criado com todas as funções de API

### Frontend - Alunos
- ✅ `src/pages/students/StudentsList.tsx` - Integrado com API
- ✅ `src/pages/students/StudentForm.tsx` - Integrado com API (criar/editar)

### Frontend - Cursos
- ✅ `src/pages/courses/CoursesList.tsx` - Integrado com API
- ✅ `src/pages/courses/CourseForm.tsx` - Integrado com API (criar/editar)

### Frontend - Matrículas
- ✅ `src/pages/enrollments/EnrollmentsList.tsx` - Integrado com API
- ✅ `src/pages/enrollments/EnrollmentForm.tsx` - Integrado com API (criar)

## Como Usar

### 1. Iniciar o Backend

```bash
cd back-end
python manage.py runserver
```

O servidor estará disponível em `http://localhost:8000`

### 2. Iniciar o Frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 3. Verificar a Conexão

Acesse o frontend e tente:
- Listar alunos
- Criar um novo aluno
- Criar um novo curso
- Criar uma matrícula

## Estrutura da API

### Aluno (Model Django)
```python
{
  "id": int,
  "nome": string (max 30),
  "rg": string (max 9),
  "cpf": string (max 11),
  "data_nascimento": date,
  "celular": string (max 11),
  "foto": ImageField (nullable)
}
```

### Curso (Model Django)
```python
{
  "id": int,
  "codigo_curso": string (max 10),
  "descricao": string (max 100),
  "nivel": "B" | "I" | "A"  # Básico, Intermediário, Avançado
}
```

### Matrícula (Model Django)
```python
{
  "id": int,
  "aluno": int (foreign key),
  "curso": int (foreign key),
  "periodo": "M" | "V" | "N"  # Matutino, Vespertino, Noturno
}
```

## Funcionalidades Implementadas

### Alunos
- ✅ Listar todos os alunos (com suporte à v2 da API)
- ✅ Visualizar detalhes de um aluno
- ✅ Criar novo aluno
- ✅ Editar aluno existente
- ✅ Upload de foto
- ✅ Excluir aluno
- ✅ Busca por nome ou CPF

### Cursos
- ✅ Listar todos os cursos
- ✅ Visualizar detalhes de um curso
- ✅ Criar novo curso
- ✅ Editar curso existente
- ✅ Busca por nome ou código
- ⚠️ Exclusão não disponível no backend

### Matrículas
- ✅ Listar todas as matrículas
- ✅ Criar nova matrícula
- ✅ Excluir matrícula
- ✅ Filtro por período (Matutino/Vespertino/Noturno)
- ✅ Busca por aluno ou curso
- ✅ Exibição de informações detalhadas (nome do aluno e curso)

## Estados de Loading e Erro

Todas as páginas implementam:
- ✅ Estado de carregamento (loading)
- ✅ Tratamento de erros com mensagens amigáveis
- ✅ Feedback ao usuário em operações assíncronas
- ✅ Botão para tentar novamente em caso de erro

## Melhorias Futuras

### Backend
1. Implementar autenticação JWT
2. Adicionar paginação nos endpoints
3. Implementar soft delete para cursos
4. Adicionar filtros avançados nos endpoints
5. Adicionar validações customizadas

### Frontend
1. Adicionar cache de requisições
2. Implementar React Query para melhor gerenciamento de estado
3. Adicionar debounce nas buscas
4. Melhorar feedback visual de operações
5. Adicionar testes unitários e de integração

## Dependências

### Backend
- Django 3.0.7
- djangorestframework
- django-cors-headers
- Pillow (para upload de imagens)

### Frontend
- React 18
- TypeScript
- Axios
- React Router DOM
- Lucide React (ícones)
- Tailwind CSS

## Troubleshooting

### Erro de CORS
- Verifique se o backend está rodando na porta 8000
- Verifique se `CORS_ALLOWED_ORIGINS` no `settings.py` inclui `http://localhost:5173`

### Erro 404 nos endpoints
- Verifique se o backend está rodando
- Verifique a URL base configurada em `src/services/api.ts`

### Dados não aparecem
- Abra o console do navegador e verifique se há erros
- Verifique se o backend tem dados cadastrados
- Use o Django Admin para popular dados iniciais

## Contato

Para dúvidas ou sugestões sobre a integração, consulte a documentação do Django REST Framework e do Axios.
