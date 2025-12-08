# Backoffice de Gestão Escolar

Aplicação front-end construída com Vite + React + TypeScript para gerenciar cursos, matrículas e estudantes.

## Visão Geral

Este repositório contém a interface do Backoffice de Gestão Escolar — painel administrativo para gerir cursos, alunos e matrículas, além de gerar relatórios e importar/exportar dados.

## Requisitos

- Node.js 18+ (ou versão compatível com as dependências)
- npm (ou yarn/pnpm)

## Instalação

Abra um terminal e execute:

```pwsh
npm install
```

## Scripts úteis

- `npm run dev` — inicia o servidor de desenvolvimento (Vite)
- `npm run build` — gera a build de produção
- `npm run preview` — pré-visualiza a build gerada
- `npm run lint` — executa o ESLint

Exemplo rápido:

```pwsh
npm run dev
```

## Estrutura do projeto (resumida)

- `src/` — código fonte
	- `App.tsx`, `index.tsx`, `index.css`
	- `components/` — `Navbar`, `Sidebar`, `Layout`
	- `pages/` — `Dashboard`, `Login`, `Reports`, módulos por domínio (students, courses, enrollments)
	- `services/db.ts` — abstração de acesso a dados (fake/cliente)

## Como contribuir

1. Faça um fork e crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
2. Faça commits pequenos e significativos
3. Abra um pull request com descrição das mudanças

## Observações

- Este template foi iniciado a partir de um scaffold Vite; ajuste configurações e dependências conforme necessário.
- Para problemas ou dúvidas, abra uma issue neste repositório.

---

Mantido por: Gabriel-Sao-Pedro
