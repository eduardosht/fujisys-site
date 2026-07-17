# Birthday Motion Refresh — Design

Data: 17 de julho de 2026

## Objetivo

Atualizar o site institucional da Fuji Sys para utilizar a identidade visual oficial do Birthday, incorporar animações Lottie contextuais em todas as áreas do produto e aumentar a riqueza das transições sem prejudicar leitura, desempenho ou acessibilidade.

## Assets de origem

Os assets serão copiados do projeto `/Users/jessicavenancio/Documents/birthday` para o diretório público deste site, preservando os arquivos de origem.

- Logo oficial: `assets/icons/app_icon_master.png`.
- Home e hero do Birthday: `assets/lotties/imported/present  birthday.lottie` e `success_celebration.lottie`.
- Benefícios e destaque funcional: `Notification.lottie`.
- Suporte: `email.lottie`.
- Privacidade: `bud_leaf_2_fix.lottie`, usado como elemento abstrato e calmo.

Somente os arquivos efetivamente exibidos serão copiados. Nenhum asset será carregado de CDN externa.

## Alterações de conteúdo e composição

### Home

- Remover integralmente a seção “Como fazemos”, incluindo os cards Clareza, Criatividade e Cuidado na entrega.
- Manter hero, apresentação da empresa, produto e contato.
- Substituir o símbolo Birthday criado em CSS pelo logo oficial.
- Incorporar uma animação curta de presente ou celebração no card do Birthday, sem competir com o título e a descrição.

### Birthday

- Substituir o bolo criado em CSS pelo logo oficial como elemento visual principal.
- Usar uma animação de celebração como camada complementar do hero.
- Adicionar a animação de notificação junto ao benefício relacionado à organização e lembrança de datas.
- Manter os textos e links oficiais já aprovados.

### Privacidade

- Adicionar um Lottie abstrato de folha ao cabeçalho da página, em escala reduzida e com baixa intensidade visual.
- Não inserir animações entre as seções jurídicas nem alterar o texto da política.

### Suporte

- Adicionar a animação de e-mail ao card do canal de atendimento.
- Manter endereço de e-mail, FAQ, instruções e links existentes.

## Componente de animação

Criar um componente `LottiePlayer` responsável por:

- renderizar arquivos `.lottie` locais;
- aceitar nome acessível opcional ou permanecer decorativo;
- iniciar somente quando visível;
- pausar quando sair da viewport;
- respeitar `prefers-reduced-motion`, exibindo um frame estático ou o fallback visual;
- manter dimensões reservadas para evitar deslocamento de layout;
- esconder o player e preservar o restante do conteúdo se o asset falhar.

O player será carregado de forma assíncrona para não bloquear o conteúdo principal.

## Motion e transições

As transições existentes serão ampliadas com:

- reveal em camadas para eyebrow, título, texto e ações;
- pequenas diferenças de velocidade entre conteúdo e elementos decorativos;
- elevação e escala suave em cards, somente em dispositivos com hover;
- transição de cor e sublinhado nos links;
- movimento de profundidade sutil no logo do Birthday;
- stagger curto entre benefícios e FAQs;
- mudança suave de opacidade entre os principais blocos da página.

Nenhum movimento será necessário para compreender o conteúdo ou operar a navegação. Com `prefers-reduced-motion: reduce`, movimentos de entrada, parallax, loops e transições não essenciais serão desativados.

## Desempenho e falhas

- O logo será otimizado para web mantendo qualidade suficiente em telas retina.
- Lotties serão carregados apenas nas páginas que os utilizam.
- O conteúdo textual será renderizado antes do carregamento das animações.
- Falha de JavaScript, player ou asset não removerá links, textos ou ações.
- A política e o suporte continuarão utilizáveis sem animação.

## Validação

- Build Vite concluído sem erros.
- Quatro URLs públicas continuam sendo geradas.
- Logo oficial aparece na home e na página Birthday.
- “Como fazemos” não aparece no código nem no build.
- Lotties locais aparecem em home, Birthday, privacidade e suporte.
- Nenhum asset depende de URL externa.
- `prefers-reduced-motion` pausa ou remove animações não essenciais.
- Navegação por teclado e foco visível permanecem funcionais.
- GitHub Pages publica todos os novos assets sem 404.

## Fora de escopo

- Alterações no aplicativo Birthday original.
- Criação ou edição dos arquivos Lottie existentes.
- Mudanças nos textos jurídicos.
- Novos produtos, formulários ou integrações de backend.
