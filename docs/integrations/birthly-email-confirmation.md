# Confirmação de e-mail do Birthly

## Contrato de produção

Após publicar e conferir as páginas no domínio de produção, compilar o app `birthday` com o valor exato:

```text
EMAIL_CONFIRM_REDIRECT_URL=https://fujisys.com.br/birthly/confirm-email/
```

O app usa esse valor como `redirectTo` no cadastro e no reenvio de confirmação. A rota `/birthly/confirm-email/` recebe o retorno do Supabase Auth; `/birthly/open-app/` é apenas a página de apoio para abrir ou instalar o aplicativo e não deve ser usada como `redirectTo`.

No dashboard do Supabase Auth, configurar:

```text
Site URL: https://fujisys.com.br
Redirect URL permitida: https://fujisys.com.br/birthly/confirm-email/
```

Usar a URL completa, com barra final, na lista de redirecionamentos permitidos. Evitar wildcard amplo em produção. Durante a transição, manter `birthday://signup-confirmation` permitido no Supabase e reconhecido pelo app para links e builds antigos. O botão de abrir o app no site também usa esse deep link. Retirar o redirect legado apenas após validar que não há mais versões dependentes dele; não presumir Universal Links ou App Links sem a configuração nativa correspondente.

A recuperação de senha usa um contrato separado: `PASSWORD_RESET_REDIRECT_URL=https://fujisys.com.br/birthly/reset-password/`. A URL de confirmação acima e a URL de recuperação devem permanecer como entradas exatas e independentes na allowlist do mesmo projeto Supabase, sem wildcard amplo. Para as variáveis públicas, a separação por ambiente e a orientação de nunca usar `service_role`, consultar [birthly-password-recovery.md](./birthly-password-recovery.md).

## Handoff para o app

Depois de ler o retorno de `/birthly/confirm-email/`, o site remove query e fragmento da URL do navegador. O botão **Abrir Birthly** usa o esquema customizado `birthday://signup-confirmation?source=email-confirmation&confirmation_result=success|error|unknown` (a ordem dos parâmetros de query não é contratual). O link alternativo leva a `/birthly/open-app/` com apenas esses dois parâmetros e respeita o base path do site; nessa página, o botão de abrir o app usa o mesmo esquema customizado.

`confirmation_result` é apenas um resultado indicativo para a interface, não uma prova de autenticação. Tokens e códigos recebidos no callback são descartados e não são enviados ao app. O site não cria uma sessão de autenticação no navegador. Ao receber o deep link, o app deve fazer sua própria verificação de autenticação/sessão antes de considerar o cadastro confirmado ou liberar conteúdo autenticado.

## Links opcionais das lojas

Os links de instalação da página `/birthly/open-app/` são definidos no build do site, se houver destinos HTTPS públicos válidos:

```text
NEXT_PUBLIC_BIRTHLY_IOS_URL=https://apps.apple.com/...
NEXT_PUBLIC_BIRTHLY_ANDROID_URL=https://play.google.com/store/apps/details?id=...
```

Sem essas variáveis, a página não apresenta links de loja. Seus valores são públicos e entram no export estático; não colocar segredos, tokens ou chaves Supabase neles. Se forem alterados, reconstruir e publicar o site.

## Validação em staging

Usar um domínio HTTPS de staging e, de preferência, um projeto Supabase separado. Configurar nesse projeto o Site URL do domínio de staging e permitir a URL completa `https://<dominio-de-staging>/birthly/confirm-email/`. Compilar o app de staging com `EMAIL_CONFIRM_REDIRECT_URL` apontando para essa mesma rota. Manter o redirect legado permitido enquanto a transição estiver em curso; não usar a rota de produção para testar staging.

Antes do deploy, executar no worktree do site:

```bash
npm run build
npm run test:static
node --test test-web/*.test.mjs
git diff --check
```

Após publicar staging, confirmar por HTTPS que `/birthly/confirm-email/` e `/birthly/open-app/` abrem sem 404. Testar cadastro e reenvio reais no projeto de staging: link válido, link com erro e acesso direto sem callback. Conferir que o resultado exibido corresponde ao caso, que a URL do navegador perde query e fragmento após a leitura, e que o botão abre o app ou oferece o fallback. Validar os links de loja somente se foram configurados no build. Repetir a checagem das duas rotas no domínio de produção antes de promover o novo build do app.

## Responsabilidades de integração

Este repositório contém as páginas estáticas, o verificador do export e este contrato de integração. Publicar o site, ajustar `EMAIL_CONFIRM_REDIRECT_URL` no build do repositório `birthday` e configurar Site URL e Redirect URLs no dashboard do Supabase são ações externas a este repositório. Este documento não registra essas ações como aplicadas; elas ainda precisam ser executadas e verificadas nos ambientes correspondentes.
