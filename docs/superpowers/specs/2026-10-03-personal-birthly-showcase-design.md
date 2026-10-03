# Fuji Sys pessoal + showcase de cartões Birthly

## Objetivo

Reposicionar a home da Fuji Sys como uma apresentação pessoal de ferramentas feitas a partir de problemas reais, mantendo o site enxuto e adicionando ao Birthly uma prova visual curta da criação de cartões personalizados.

O sucesso será medido por três resultados: a home comunicar autoria e abertura para colaboração; a página do Birthly mencionar fotos, mensagem e assinatura com um exemplo visual real; e as transições deixarem a navegação mais viva sem prejudicar legibilidade, responsividade ou acessibilidade.

## Escopo

### 1. Showcase de cartões no Birthly

Adicionar uma seção entre a declaração inicial e os benefícios, com:

- título curto sobre cartões que guardam um momento;
- texto mencionando foto, mensagem e assinatura personalizada;
- a imagem fornecida pelo usuário, copiada para `public/birthday/examples/leandro-birthday-card.jpeg`;
- legenda acessível descrevendo o cartão de aniversário de Leandro;
- animação de entrada via `Reveal`, seguida de uma flutuação/rotação muito sutil no cartão;
- estado hover/focus coerente com a identidade vinho/rosa do Birthly;
- fallback de `prefers-reduced-motion` sem deslocamento, rotação ou escala contínuos.

A imagem será tratada como conteúdo editorial do exemplo. O texto não será recriado por cima dela; a seção apresentará a imagem preservando o cartão original.

Texto inicial proposto:

> Cartões que guardam um momento.
>
> No Birthly, uma data também pode virar uma lembrança para compartilhar: escolha uma foto, escreva sua mensagem e assine do seu jeito.

### 2. Home mais pessoal

Reescrever os textos institucionais principais em primeira pessoa, sem transformar a Fuji Sys em uma biografia extensa. A narrativa deve explicar que as ferramentas nascem de necessidades reais, são feitas pelo autor para uso próprio e podem ser compartilhadas com outras pessoas.

Direção de conteúdo:

- hero: “Eu crio ferramentas para lembrar, organizar e aproximar.”;
- seção de contexto: “Algumas ideias começam numa necessidade minha. Outras começam numa conversa.”;
- contato: convite para colaborar, compartilhar uma ideia ou apontar um problema real.

Os links e a estrutura de rotas permanecem iguais.

### 3. Hero, blocos e movimento

- ampliar a proporção útil da hero da home, reduzindo o espaço vazio entre texto e arte;
- manter o artboard atual da Fuji Sys, mas dar mais presença ao conteúdo e ao elemento visual;
- usar o `Reveal` existente com delays escalonados nos blocos principais;
- adicionar transições discretas em statement, card do Birthly, showcase de cartão e painel de contato;
- preservar a regra global de movimento reduzido.

Não será criado um fluxo sticky ou uma animação dependente de scroll contínuo. O movimento será acionado por entrada na viewport, hover/focus e flutuação limitada do cartão.

### 4. Favicon

Criar `app/icon.svg`, aproveitando o monograma “F” já usado na identidade visual, em um fundo arredondado de alto contraste. O App Router do Next.js reconhecerá o arquivo automaticamente como ícone do site; não será necessário alterar rotas ou adicionar dependência.

## Arquitetura e arquivos previstos

- `src/components/pages/Content.tsx`: copy pessoal da home e nova seção/markup do showcase Birthly.
- `app/globals.css`: layout da hero, showcase, estados de interação e animações reduzidas.
- `public/birthday/examples/leandro-birthday-card.jpeg`: asset fornecido pelo usuário.
- `app/icon.svg`: favicon do site.
- `app/layout.tsx`: somente se a metadata precisar explicitar o ícone; preferir o comportamento automático do App Router.
- `test-web/personal-showcase.test.mjs`: contratos de copy, asset e favicon.

## Acessibilidade e comportamento responsivo

- a imagem terá `alt` descritivo;
- a seção usará heading semântico e não dependerá apenas da animação para comunicar a feature;
- o cartão continuará legível em telas estreitas, com imagem e texto empilhados;
- hover não será a única forma de descobrir a interação;
- `prefers-reduced-motion` manterá a composição estática;
- o favicon terá forma simples e contraste suficiente em tamanhos pequenos.

## Fora do escopo

- implementar edição real de cartões no site;
- adicionar autenticação, persistência ou upload de imagens;
- alterar páginas legais, suporte ou fluxos de recuperação;
- mudar a paleta do Birthly já definida;
- publicar ou fazer deploy.

## Validação

1. Teste automatizado confirma os textos-chave, o asset do cartão e `app/icon.svg`.
2. Testes existentes de arquitetura, exportação estática, callbacks e typecheck continuam passando.
3. `npm run build` passa com exportação estática.
4. Inspeção visual em `/` e `/birthly/` confirma largura da hero, entrada dos blocos, presença do cartão e comportamento reduzido quando aplicável.
