# Renomeação do aplicativo para Birthly

## Objetivo

Renomear publicamente o aplicativo Birthday para **Birthly** em todo o site institucional da Fuji Sys.

## Escopo

- Atualizar textos visíveis, navegação, conteúdo jurídico, suporte, FAQ, títulos e descrições HTML para Birthly.
- Atualizar o nome do produto na configuração compartilhada do site.
- Substituir as rotas públicas por `/birthly`, `/birthly/privacy` e `/birthly/support`.
- Não manter páginas nem redirecionamentos em `/birthday/...`, pois o projeto ainda não foi lançado publicamente.
- Preservar nomes técnicos internos, classes CSS e diretórios de assets que não aparecem para o usuário e cuja troca não traz benefício funcional.
- Não alterar o conteúdo substantivo da política de privacidade nem os dados tratados pelo aplicativo.

## Validação

- Buscar referências públicas remanescentes a “Birthday” nos arquivos executáveis e HTML.
- Confirmar que as páginas estáticas de produção existem apenas sob as novas rotas `/birthly/...`.
- Executar o build de produção.
- Revisar o diff antes de criar commit e enviar a `main`.
