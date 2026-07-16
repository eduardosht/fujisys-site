# Fuji Sys — site institucional e páginas oficiais do Birthday

Data: 16 de julho de 2026

## Objetivo

Criar um site institucional público para a Fuji Sys que apresente a empresa como criadora de soluções úteis, criativas e bem executadas. O site também será a origem oficial das páginas exigidas pela Apple para o aplicativo Birthday: política de privacidade e suporte em português do Brasil.

## Público e mensagem

O site atende usuários dos produtos Fuji Sys, avaliadores da App Store e potenciais parceiros. A comunicação será direta, acolhedora e confiante, sem promessas vagas ou linguagem excessivamente corporativa.

Mensagem central: a Fuji Sys transforma problemas reais em produtos digitais simples, criativos e bem entregues, compartilhando suas soluções com o mundo.

## Arquitetura

O projeto será uma aplicação React responsiva com quatro rotas públicas:

- `/`: página institucional da Fuji Sys.
- `/birthday`: apresentação do aplicativo Birthday.
- `/birthday/privacy`: política de privacidade oficial do Birthday.
- `/birthday/support`: suporte oficial do Birthday em português do Brasil.

As páginas compartilharão cabeçalho, rodapé, identidade visual, tipografia e componentes de navegação. O conteúdo será estático nesta primeira versão, sem banco de dados, autenticação do site ou formulário próprio.

## Direção visual

A direção escolhida é editorial tecnológica: fundo predominantemente claro, tipografia expressiva, espaços amplos, linhas finas e formas geométricas suaves. A estética será inspirada no ritmo e na limpeza da referência fornecida, sem reproduzir sua composição ou identidade.

A paleta combinará off-white, grafite e um azul-violeta elétrico usado com moderação. O Birthday receberá um acento quente complementar para transmitir celebração e afeto.

Movimentos serão funcionais e discretos:

- entrada progressiva de títulos e blocos durante a rolagem;
- transições suaves em links, botões e cards;
- formas decorativas com movimento lento;
- resposta sutil ao cursor apenas em dispositivos compatíveis;
- ausência de animações essenciais para compreender ou navegar pelo conteúdo;
- respeito a `prefers-reduced-motion`, reduzindo ou removendo efeitos.

## Página institucional

A página inicial terá:

1. Cabeçalho com marca Fuji Sys, links para empresa, produtos e contato.
2. Hero com a proposta de transformar problemas reais em soluções digitais criativas.
3. Bloco curto sobre a empresa e sua forma de trabalhar.
4. Princípios: clareza, criatividade e entrega cuidadosa.
5. Seção de produtos com o Birthday como primeiro produto publicado e espaço estrutural para futuros produtos, sem cards vazios ou promessas de lançamentos.
6. Chamada para contato usando `contato@fujisys.com.br`.
7. Rodapé com links para Birthday, privacidade, suporte e contato.

## Página do Birthday

A apresentação do Birthday explicará que o aplicativo ajuda o usuário a lembrar datas importantes e manter pessoas queridas por perto. Ela destacará organização simples, acesso por conta e experiência cuidadosa, sem afirmar funcionalidades ainda não confirmadas.

A página terá links claros para a política de privacidade e o suporte. Não haverá botão de download para loja até que uma URL oficial seja fornecida.

## Política de privacidade

A política em `/birthday/privacy` será escrita em português claro e conterá:

- identificação da Fuji Sys como responsável pelo aplicativo;
- data da última atualização;
- informação de que o único dado pessoal coletado é o endereço de e-mail;
- finalidade exclusiva do e-mail: autenticação, acesso e gestão da conta;
- informação de que não há venda de dados nem compartilhamento para publicidade;
- uso do Resend como fornecedor de infraestrutura para envio de e-mails de autenticação;
- medidas gerais de segurança e limitação de acesso;
- retenção apenas enquanto necessária ao funcionamento da conta e às obrigações aplicáveis;
- direito de solicitar acesso, correção ou exclusão pelo e-mail `contato@fujisys.com.br`;
- aviso de que a política poderá ser atualizada, com publicação da nova versão nesta URL;
- canal de contato para dúvidas de privacidade.

O texto será uma declaração operacional baseada nas informações fornecidas, sem se apresentar como parecer jurídico. Antes da publicação definitiva, a Fuji Sys poderá submetê-lo a revisão jurídica.

## Página de suporte

A página em `/birthday/support` atenderá ao requisito de suporte em português do Brasil e incluirá:

- introdução curta e acolhedora;
- botão de contato por `mailto:contato@fujisys.com.br`;
- orientação para incluir descrição do problema e, quando útil, versão do aplicativo e do sistema;
- FAQ sobre acesso à conta, recebimento do e-mail de login, atualização do endereço de e-mail, exclusão da conta e privacidade;
- links de retorno ao Birthday e à política de privacidade;
- expectativa genérica de resposta, sem prometer prazo ainda não confirmado.

## Estados e tratamento de falhas

Como o site é estático, os principais estados de falha são navegação inválida e indisponibilidade do aplicativo de e-mail. Rotas inexistentes receberão uma página 404 coerente com a identidade. O endereço de suporte também aparecerá como texto copiável, de modo que o usuário não dependa do link `mailto:`.

Links terão estados visíveis de foco. Navegação por teclado, contraste adequado, marcação semântica e hierarquia correta de títulos serão requisitos de implementação.

## Responsividade

O layout será projetado para celulares, tablets e desktops. Em telas pequenas, a navegação será compacta, os textos manterão tamanho legível e as animações serão reduzidas. Nenhuma ação dependerá exclusivamente de hover.

## Validação

A entrega será considerada pronta quando:

- as quatro rotas responderem diretamente por URL;
- `/birthday/privacy` contiver todos os itens de privacidade definidos;
- `/birthday/support` oferecer contato e FAQ em pt-BR;
- a navegação funcionar por teclado e em telas pequenas;
- a preferência por movimento reduzido for respeitada;
- links internos e o endereço de e-mail estiverem corretos;
- o projeto concluir a compilação de produção sem erros;
- as páginas tiverem título e descrição próprios para mecanismos de busca e compartilhamento.

## Fora do escopo inicial

- painel administrativo;
- envio de mensagens por formulário;
- caixa de entrada integrada ao Resend;
- blog ou CMS;
- múltiplos idiomas;
- integração com a App Store;
- analytics, cookies publicitários ou rastreamento de comportamento.
