# Renomeação do aplicativo para Birthly

## Objetivo

Renomear publicamente o aplicativo Birthday para **Birthly** em todo o site institucional da Fuji Sys.

## Escopo

- Atualizar textos visíveis, navegação, conteúdo jurídico, suporte, FAQ, títulos e descrições HTML para Birthly.
- Atualizar o nome do produto na configuração compartilhada do site.
- Preservar os caminhos `/birthday`, `/birthday/privacy` e `/birthday/support` para manter compatibilidade com URLs já cadastradas na Apple e links existentes.
- Preservar nomes técnicos internos, classes CSS e diretórios de assets que não aparecem para o usuário e cuja troca não traz benefício funcional.
- Não alterar o conteúdo substantivo da política de privacidade nem os dados tratados pelo aplicativo.

## Validação

- Buscar referências públicas remanescentes a “Birthday” nos arquivos executáveis e HTML.
- Executar o build de produção.
- Revisar o diff antes de criar commit e enviar a `main`.
