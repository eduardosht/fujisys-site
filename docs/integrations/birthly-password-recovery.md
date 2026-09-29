# Recuperação de senha do Birthly

## Contrato canônico de produção

Novas solicitações de recuperação devem usar a página HTTPS estática abaixo:

```text
PASSWORD_RESET_REDIRECT_URL=https://fujisys.com.br/birthly/reset-password/
```

Essa é a URL que o app `birthday` deve enviar ao Supabase em produção. A barra final faz parte do contrato. A página consome o retorno de recuperação no fragmento ou um código PKCE de uso único na query string, remove os dados sensíveis do histórico e permite atualizar a senha no navegador. O código PKCE nunca é registrado nem persistido.

No projeto Supabase de produção, conferir no dashboard do Auth:

```text
Site URL: https://fujisys.com.br
Redirect URL permitida: https://fujisys.com.br/birthly/reset-password/
Redirect URL permitida: https://fujisys.com.br/birthly/confirm-email/
```

As duas URLs devem ser entradas exatas e independentes. Não usar wildcard amplo em produção, não trocar a URL de recuperação pela página `/birthly/open-app/` e não adicionar o esquema `birthday://` à allowlist web. A configuração da confirmação de e-mail está detalhada em [birthly-email-confirmation.md](./birthly-email-confirmation.md).

## Variáveis por ambiente

O site é um export estático e só pode receber credenciais públicas de navegador durante o build. Os nomes são os mesmos em todos os ambientes:

| Ambiente | `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `PASSWORD_RESET_REDIRECT_URL` |
| --- | --- | --- | --- |
| Produção | URL do projeto Supabase de produção | publishable key do projeto de produção | `https://fujisys.com.br/birthly/reset-password/` |
| Staging | URL do projeto Supabase de staging | publishable key do projeto de staging | `https://<dominio-de-staging>/birthly/reset-password/` |
| Local | `http://127.0.0.1:54321` ou projeto local/teste equivalente | publishable key local/teste | `http://localhost:3000/birthly/reset-password/` |

Staging e local devem usar projetos Supabase separados sempre que possível. Para cada projeto, o `Site URL` e a allowlist devem apontar para o domínio daquele ambiente; nunca usar a URL de produção para validar staging ou local. Se o host local for `127.0.0.1`, adicionar esse host explicitamente em vez de presumir que `localhost` e `127.0.0.1` sejam a mesma entrada.

O app mantém também `EMAIL_CONFIRM_REDIRECT_URL` para confirmação de cadastro. Em produção, esse valor é exatamente `https://fujisys.com.br/birthly/confirm-email/`; ele não deve ser reutilizado como destino de recuperação.

Os valores públicos podem ser injetados no build do site, mas não devem ser gravados neste documento, em commits, screenshots ou logs. Não criar variáveis `NEXT_PUBLIC_*` para segredos. Em particular, nunca fornecer uma chave `service_role` (nem qualquer chave administrativa ou token de sessão) ao site, ao app ou ao navegador. A chave publicável e a URL do projeto podem aparecer no bundle por serem credenciais públicas; isso não autoriza expor tokens, senhas ou fragmentos de links de recuperação.

O script `scripts/verify-public-supabase-config.mjs` roda antes do build e interrompe a publicação quando as variáveis públicas estão ausentes ou quando a chave tem formato de secret/service-role. Isso evita gerar um bundle estático com uma credencial administrativa.

## Migração do deep link legado

Links antigos podem continuar chegando como `birthday://password-reset`. Durante a janela de migração, o app deve continuar reconhecendo esse deep link e mostrar um estado recuperável, sem encaminhar o usuário para onboarding. Novas solicitações devem gerar somente o destino HTTPS `/birthly/reset-password/`.

O suporte ao esquema legado deve ser removido apenas depois de documentar a janela, observar versões do app ainda ativas e considerar o tempo de permanência dos e-mails enviados. Essa remoção é uma mudança do app, não uma alteração deste export estático. Não registrar URLs completas de e-mail durante a observação: fragmentos podem conter `access_token` e `refresh_token`.

## Procedimento seguro de deploy e leitura de volta

Antes do deploy, configurar as variáveis do ambiente correto e executar:

```bash
npm run build
npm run test:static
npm run test:callback-output
node --test test-web/*.test.mjs
git diff --check
```

Depois do deploy, confirmar por HTTPS que `/birthly/reset-password/`, `/birthly/confirm-email/` e `/birthly/open-app/` existem e preservam a barra final. Ler novamente no dashboard do Supabase o `Site URL` e cada Redirect URL permitida, e comparar com o ambiente que foi publicado. Também conferir no artefato que `out/birthly/reset-password/index.html` foi emitido.

Dashboard, variáveis do provedor de deploy e publicação do export são ações externas a este repositório. Este documento não afirma que elas foram aplicadas. Só marcar a configuração como concluída depois de ler esses valores de volta no ambiente correspondente e registrar o resultado sem incluir chaves, tokens, senhas ou fragmentos de callback.

## Registro de verificação local (29/09/2026)

- `npm run build` foi executado com uma URL Supabase de produção sintética, uma publishable key sintética e o redirect HTTPS de produção. A exportação estática gerou `out/birthly/reset-password/index.html`.
- Os dois valores públicos sintéticos apareceram somente em um chunk JavaScript de cliente gerado; não apareceram no HTML das rotas nem no bundle do callback.
- A inspeção do HTML da recuperação e dos chunks carregados pelo callback não encontrou access tokens, refresh tokens, senhas, chaves `service_role`, segredos de servidor, material JWT/chave privada ou fixtures sensíveis embutidos.
- Passaram localmente: `npm run test:static` (34 assertions do callback e 11 arquivos estáticos), `npm run test:callback-output` (8/8), `node --test test-web/*.test.mjs` (48/48), `npm run test:site-architecture` (4/4), `node --experimental-strip-types --test test-web/password-recovery.test.mjs` (10/10), `npx tsc --noEmit` e `git diff --check`.
- **Pendente, não lido de volta externamente:** dashboard do Supabase (Site URL e Redirect URLs), variáveis do provedor de deploy, publicação/HTTPS e existência das rotas no ambiente publicado. Nenhuma alteração externa foi feita nesta verificação; os valores usados foram somente placeholders locais.

## Higiene de tokens e suporte

- Nunca colar em tickets ou mensagens a URL completa recebida por e-mail; redigir `code`, `access_token`, `refresh_token`, `token`, senhas e cookies.
- Não enviar tokens, senhas ou erros brutos do Supabase para logs, analytics, query strings, HTML estático ou links de suporte.
- Usar somente mensagens genéricas para links expirados, inválidos ou já utilizados; a equipe pode correlacionar o ambiente e o horário sem coletar o segredo.
- Se uma chave administrativa ou token aparecer em um log, ticket ou artefato, interromper a divulgação, revogar/rotacionar a credencial no provedor e registrar apenas o identificador seguro da ocorrência.
