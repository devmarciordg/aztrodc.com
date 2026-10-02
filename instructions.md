# Instruções para desenvolvimento

Este projeto usa **React + Vite + Sass** no frontend e **PHP + MySQL** no backend. O Vite compila arquivos `.scss` importados pelos módulos React; não é necessário plugin Sass adicional. O Node.js executa as ferramentas de desenvolvimento e o build do frontend; em hospedagem compartilhada, o servidor web entrega os arquivos estáticos compilados e executa o PHP. Não dependa de um processo Node.js ativo no servidor de produção.

## Comandos

- `npm install`: instala as dependências do frontend.
- `npm run dev`: inicia o servidor Vite para desenvolvimento local.
- `npm run build`: gera o site otimizado em `dist/`.
- `npm run preview`: serve localmente o conteúdo compilado para conferência.
- `php -S localhost:8000 -t .`: inicia o servidor PHP local. O proxy `/api` do Vite encaminha as chamadas para ele.

Os estilos ficam em `src/styles/` e usam a extensão `.scss`. Importe o Sass necessário pelo código da aplicação para que o Vite inclua o CSS compilado no build.

O endpoint de exemplo está em `api/index.php` (`/api/health`). Configure o banco copiando `api/config.example.php` para `api/config.php` e preenchendo as credenciais. Nunca versione credenciais reais. O arquivo `database/schema.sql` é o ponto de partida para o esquema.

## Publicação em hospedagem compartilhada

1. Rode `npm run build` em ambiente de desenvolvimento/CI.
2. Envie o conteúdo de `dist/` para a raiz pública do domínio (geralmente `public_html/`).
3. Envie a pasta `api/` para uma localização executável pelo PHP, mantendo-a acessível em `/api` ou ajuste o roteamento conforme a hospedagem.
4. Crie o banco e usuário MySQL no painel da hospedagem, importe o esquema e configure `api/config.php` com credenciais privadas.
5. Confirme a versão PHP e extensões necessárias (PDO MySQL), HTTPS, permissões de arquivos e rotas antes de publicar.

Vite não serve a aplicação de produção. O diretório `dist/` é o artefato de frontend. Se o projeto adotar rotas de página no cliente, configure fallback para `index.html` no Apache, sem interceptar endpoints PHP.

## Regras de desempenho e Core Web Vitals

Toda implementação, revisão ou geração de código deve priorizar carregamento rápido, estabilidade visual e resposta imediata. Consulte os limites atuais de Core Web Vitals antes de decisões que dependam de métricas, pois os critérios podem mudar. Como referência, busque LCP até 2,5 s, INP até 200 ms e CLS até 0,1 no percentil 75, em dados reais quando disponíveis.

- **Imagens:** prefira WebP (ou AVIF quando houver fallback adequado); comprima e dimensione para o espaço de exibição. Declare `width` e `height` ou `aspect-ratio`. Use `srcset`/`sizes` para responsividade. Faça lazy-load em imagens fora da primeira dobra; não aplique lazy-load à imagem LCP. Use `fetchpriority="high"` com parcimônia para o recurso LCP.
- **Fontes:** use poucas famílias e pesos; prefira fontes locais ou do sistema. Se fontes web forem indispensáveis, hospede apenas os subconjuntos/pesos usados, considere WOFF2 e `font-display: swap`.
- **JavaScript:** mantenha poucas dependências. Prefira APIs nativas e componentes pequenos. Divida código por rota/funcionalidade quando necessário, remova código morto e evite trabalho pesado no thread principal. Não adicione uma biblioteca sem justificar seu custo em bytes, execução e manutenção.
- **Sass e CSS:** use Sass como pré-processador, com módulos pequenos e escopo claro. Prefira `@use`/`@forward`; não use `@import` legado, nesting profundo, seletores globais excessivos ou mixins que dupliquem grandes blocos de CSS. Sass organiza e compila estilos, mas não reduz automaticamente o CSS entregue: confira o resultado do build e remova regras não utilizadas.
- **BEM:** nomeie blocos e elementos de forma previsível (`.card`, `.card__title`) e modificadores por estado/variação (`.card--featured`, `.button--disabled`). Mantenha nomes independentes da estrutura HTML e evite depender de seletores de tag ou encadeamentos longos. Em JSX, classes BEM devem continuar legíveis e refletir o componente.
- **Componentes React:** divida a interface em componentes reutilizáveis com responsabilidade clara e propriedades explícitas. Extraia componentes quando houver repetição ou uma unidade de interface/comportamento coerente; evite abstrações genéricas prematuras e componentes fragmentados demais. Prefira elementos HTML semânticos e controles nativos, reduza estado duplicado e mantenha efeitos fora de renderizações desnecessárias.
- **Portabilidade:** mantenha React, Sass e lógica da interface independentes do servidor PHP; integre-os por HTTP/JSON na API. Use caminhos relativos e configuração do Vite compatível com publicação em subdiretório quando necessário. O build deve produzir arquivos estáticos em `dist/`, sem exigir Node.js no host final.
- **CSS e layout:** reduza CSS não utilizado, evite estilos bloqueantes desnecessários e reserve espaço para conteúdo que carrega depois. Evite inserir conteúdo acima do conteúdo existente sem reservar dimensões.
- **Rede:** minimize requisições críticas, use cache adequado para arquivos com hash e compressão Brotli/Gzip quando disponível. Carregue apenas os recursos necessários para a página atual.
- **Acessibilidade e UX:** use HTML semântico, controles nativos quando adequados, navegação por teclado, rótulos claros e estados de foco visíveis. Desempenho não deve comprometer legibilidade ou acessibilidade.
- **Backend PHP/MySQL:** use PDO e prepared statements, valide entradas no servidor, selecione somente os campos necessários e pagine listas. Evite consultas N+1 e índices ausentes. Não exponha erros, segredos ou detalhes do banco em respostas públicas.
- **Verificação:** meça páginas representativas em Lighthouse/PageSpeed Insights e, quando houver tráfego, acompanhe dados de campo. Corrija primeiro gargalos que afetam usuários reais e registre antes/depois. Não trate uma pontuação de laboratório isolada como garantia de CWV.

## Convenções

- Mantenha frontend em `src/`, API PHP em `api/` e SQL versionado em `database/`.
- Não coloque segredos no frontend, no Git ou em respostas da API.
- Preserve compatibilidade com versões comuns de PHP/MySQL oferecidas por hospedagens compartilhadas; confirme o ambiente alvo antes de adotar recursos recentes.
- Documente novas variáveis de ambiente/configuração e mantenha exemplos sem segredos.

## Boas práticas de Git e branches

- Nunca trabalhe nem faça commits diretamente na branch `main`. Toda alteração deve ser feita em um branch próprio, incluindo correções pequenas e documentação.
- Antes de começar, atualize as referências remotas e crie um branch a partir da versão mais recente da `main`:

```bash
git switch main
git pull --ff-only
git switch -c feat/nome-curto-da-tarefa
```

- Escolha um prefixo que descreva o trabalho, por exemplo `feat/`, `fix/`, `docs/`, `refactor/` ou `perf/`. Use nomes curtos, em minúsculas e separados por hífens.
- Faça commits pequenos, coesos e frequentes no seu branch, seguindo Conventional Commits. Revise `git status` e `git diff` antes de cada commit; não inclua arquivos gerados, credenciais, dependências instaladas ou alterações alheias à tarefa.
- Mantenha o branch atualizado com `main`, resolva conflitos nele e publique o branch para revisão:

```bash
git fetch origin
git rebase origin/main
git push -u origin feat/nome-curto-da-tarefa
```

- Integre alterações à `main` por Pull Request/Merge Request após revisão e verificações apropriadas. Não faça push direto para `main` nem use commits locais nessa branch para implementar tarefas.
- Depois da integração, sincronize `main` e remova o branch de trabalho quando não for mais necessário.

## Conventional Commits (Commits Convencionais)

Escreva as mensagens de commit em português ou inglês, mantendo o tipo e o formato padronizados:

```text
<tipo>[escopo opcional][!]: <descrição curta no imperativo>
```

Use um dos tipos abaixo conforme a mudança:

- `feat`: adiciona uma funcionalidade.
- `fix`: corrige um erro.
- `docs`: altera documentação.
- `style`: altera formatação sem mudar comportamento (por exemplo, espaços ou ponto e vírgula).
- `refactor`: reorganiza código sem adicionar funcionalidade ou corrigir erro.
- `perf`: melhora desempenho.
- `test`: adiciona ou altera testes.
- `build`: altera build, dependências ou ferramentas.
- `ci`: altera integração ou automação contínua.
- `chore`: tarefas de manutenção que não se encaixam nos tipos anteriores.
- `revert`: reverte um commit anterior.

Exemplos:

```text
feat(api): adicionar consulta de produtos
fix: corrigir validação do formulário
docs: documentar publicação em hospedagem compartilhada
perf(home): carregar imagem principal em WebP
feat!: remover suporte ao endpoint antigo
```

Use escopos curtos e consistentes quando ajudarem a identificar a área (`frontend`, `api`, `database`, `config`). Escreva a descrição em minúsculas após os dois-pontos, de forma curta e específica. Para mudanças que quebram compatibilidade, use `!` antes dos dois-pontos e explique a quebra no corpo do commit; alternativamente, inclua `BREAKING CHANGE: ...` no rodapé. Commits devem representar uma mudança coerente e evitar mensagens vagas como `alterações` ou `ajustes`.
