# O Meu Treino

Aplicação Expo/React Native para organizar, executar e acompanhar treinos semanais.

## MVP implementado

- Autenticação local de MVP com criação de conta, login, objetivo principal e logout.
- Tela inicial de logo com redirecionamento automático para login ou Home.
- Home mobile-first com programa ativo, semana atual, resumo semanal e histórico.
- Criação e seleção local de múltiplos programas de treino.
- Criação local de semanas de treino.
- Criação local de dias dentro de uma semana.
- Criação local de exercícios dentro de um dia.
- Execução básica com marcação de exercícios concluídos.
- Finalização de treino com histórico simples persistido no dispositivo.

## Stack

- React Native + Expo + Expo Router
- TypeScript
- AsyncStorage para persistência local do protótipo
- Supabase como backend planejado para Auth, PostgreSQL e RLS

## Arquitetura e planejamento

- `docs/architecture.md`: fronteiras entre app, features, API, backend e banco.
- `docs/database.md`: regras de modelagem, ownership, status e migrations.
- `docs/api-contracts.md`: contratos de services para telas não acessarem banco direto.
- `docs/codex-notes.md`: memória curta do projeto para futuras tarefas no Codex.
- `supabase/schema.md`: visão do schema planejado.
- `supabase/migrations/0001_initial_schema.sql`: migration inicial com tabelas, índices, triggers e RLS.

## Scripts

```bash
npm install
npm run typecheck
npm run web
```

## Próximos passos técnicos

1. Conectar autenticação com Supabase Auth.
2. Criar a camada `shared/api` com cliente Supabase e erros normalizados.
3. Migrar auth e workouts para services por módulo.
4. Aplicar a migration inicial no projeto Supabase.
5. Substituir o store local por serviços com cache local e sincronização.
6. Preparar monetização e área de personal trainer após validação do MVP.
