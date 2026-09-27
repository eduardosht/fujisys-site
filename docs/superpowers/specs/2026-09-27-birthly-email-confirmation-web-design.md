# Fluxo web de confirmação de e-mail do Birthly

## Objetivo

Publicar no `fujisys-site` as páginas HTTPS que recebem o retorno do Supabase
Auth após a confirmação de e-mail e orientam a pessoa a voltar ao aplicativo
Birthly. O site é um export estático do Next.js, portanto não terá sessão,
chaves do Supabase ou chamada de API no navegador.

O fluxo deve ser compatível com o app `birthday`, que envia
`EMAIL_CONFIRM_REDIRECT_URL` como `redirectTo` no cadastro e no reenvio de
confirmação.

## Rotas públicas

### `/birthly/confirm-email/`

Página pública e estática para o destino do Supabase. Ela deve:

- reconhecer callbacks de sucesso do Supabase (`type=signup`, token de acesso
  no fragmento ou `code` PKCE não vazio durante a migração);
- reconhecer erros presentes na query ou no fragmento;
- dar precedência a qualquer erro sobre marcadores de sucesso;
- exibir somente três estados seguros: `success`, `error` e `unknown`;
- remover query string e fragmento da barra do navegador após a leitura;
- nunca persistir, renderizar ou enviar tokens, descrições de erro ou outros
  parâmetros brutos;
- oferecer a ação `Abrir Birthly`, transportando somente
  `confirmation_result=success|error|unknown`;
- permitir continuar no site quando fizer sentido.

Uma visita direta sem parâmetros deve permanecer neutra e não afirmar que o
endereço foi confirmado.

### `/birthly/open-app/`

Página pública de fallback para quando o navegador não abrir o app. Ela deve:

- mostrar uma orientação curta para abrir ou instalar o Birthly;
- oferecer links de loja quando forem configurados por variáveis públicas de
  build;
- manter um retorno para `/birthly/confirm-email/`;
- não ser usada como `redirectTo` do Supabase;
- não receber nem persistir tokens.

O deep link primário será `birthday://signup-confirmation`, preservando a
compatibilidade com o fluxo nativo já publicado. A implementação não presume
Universal Link/App Link até que os domínios e associações nativas reais sejam
configurados.

## Contrato de produção

Depois do deploy do site, o app `birthday` deverá ser compilado com:

```text
EMAIL_CONFIRM_REDIRECT_URL=https://fujisys.com.br/birthly/confirm-email/
```

No Supabase Auth:

```text
Site URL: https://fujisys.com.br
Redirect URL permitida: https://fujisys.com.br/birthly/confirm-email/
```

Durante a migração, manter `birthday://signup-confirmation` na allowlist do
Supabase e no app. A configuração de produção não deve usar wildcard amplo.
O domínio deve ser confirmado pelo deploy antes de promover o build do app.

Para staging, usar um domínio de staging e, preferencialmente, um projeto
Supabase separado, sempre com o redirect completo correspondente ao ambiente.

## Composição visual

As páginas devem reutilizar o shell existente do `fujisys-site` (header,
footer, tipografia, cores e espaçamentos do Birthly) e receber estilos próprios
para o conteúdo de confirmação. O layout deve ser responsivo, com uma coluna
em telas estreitas, foco visível, texto em português e contraste suficiente em
light/dark mode do sistema quando aplicável.

O estado de sucesso deve ser visualmente positivo sem depender de emoji como
único indicador; erro e estado desconhecido devem ser claramente distinguíveis.

## Limites de segurança

- Nenhum segredo, chave Supabase ou token deve entrar no bundle.
- O código de confirmação não será trocado nem persistido pelo site.
- O site não deve tratar `confirmation_result` arbitrário como sucesso.
- A limpeza da URL deve ocorrer antes de qualquer ação de navegação.
- O resultado salvo para retorno deve ser limitado ao conjunto fechado de três
  estados e consumido uma única vez.
- Links de callback de outras páginas não devem alterar o estado da página de
  confirmação.

## Testes e critérios de aceite

Adicionar testes unitários/estáticos para:

1. sucesso via `type=signup`, token no fragmento e código PKCE;
2. erro prevalecendo sobre sucesso;
3. visita direta e parâmetros vazios resultando em `unknown`;
4. limpeza de query/fragmento sem persistir dados sensíveis;
5. CTA limitado ao resultado permitido;
6. retorno do fallback consumido uma única vez;
7. rotas fora de `/birthly/confirm-email/` não sendo tratadas como callback;
8. geração dos dois `index.html` no export estático.

Os comandos de validação são:

```bash
npm run build
npm run test:static
node --test test-web/*.test.cjs
```

## Fora de escopo

- configurar credenciais ou alterar o dashboard do Supabase;
- publicar o site ou fazer push da branch;
- implementar Universal Links/App Links sem domínio e identidade de assinatura
  confirmados;
- corrigir o erro MDX preexistente no projeto `birthday`;
- trocar o fluxo OAuth ou recuperação de senha do aplicativo.

