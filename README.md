# FARO — Radar de Oportunidades

Site editorial em português, com catálogo curado, score transparente, fontes e incertezas explícitas. O projeto agora inclui um backend Manus e banco gerenciado para testar uma integração de busca Mercado Livre por OAuth. **Ainda não há app/segredos Mercado Livre nem autorização de conta; a busca ao vivo permanece bloqueada até teste autorizado bem-sucedido.** O 403 sem autenticação e a documentação consultada não confirmam, por si, que a busca geral por palavra-chave esteja disponível para afiliados.

## Requisitos e comandos

- Node.js 22; npm fixado no `package.json`/lockfile; driver MySQL `mysql2`.
- `npm ci` instala as dependências registradas no lockfile.
- `npm run build` gera páginas HTML indexáveis em `dist/`.
- `npm run validate` reconstrói e verifica rotas, metadata, conteúdo e links internos.
- `npm start` executa o servidor HTTP e API; requer `PORT` e `DATABASE_URL` definidos pelo ambiente Manus. Na inicialização, aplica somente a migração aditiva versionada.
- `npm run dev` serve o mesmo backend na porta local configurada; o banco de Preview e produção é compartilhado.

## Estrutura

- `content/site.json`: marca provisória, origens permitidas, callback, identidade, imagens e controles de afiliados/newsletter.
- `content/opportunities.json`: oportunidades, scores, evidências, riscos, fontes e ofertas por SKU opcionais.
- `content/partners.json`: programas e regras públicas consultadas.
- `src/templates/`: páginas HTML pré-renderizadas.
- `src/css/` e `src/js/`: identidade e comportamento no navegador, incluindo busca editorial e consultas automáticas autorizadas.
- `src/server/db.mjs`: pool MySQL e migrações idempotentes.
- `src/server/mercadolivre.mjs`: OAuth, criptografia de tokens, refresh, limites e proxy de busca somente leitura.
- `scripts/`: build, servidor, migração explícita e validação.
- `migrations/001_mercadolivre_oauth.sql`: tabelas com prefixo FARO para estados OAuth e token cifrado.
- `public/`: assets e manifesto público de rotas.
- `dist/`: saída estática para Netlify/Cloudflare; contém catálogo editorial, mas não substitui o backend ao vivo.
- `docs/`: pesquisa, relatório, manual, conteúdo e plano operacional.

## Busca e Mercado Livre

O campo aceita texto geral. A busca editorial local e os resultados externos são separados. Quando a integração estiver conectada e verificada, a consulta ao vivo começa automaticamente após a digitação; “Carregar mais” é manual e pagina segundo a API. O FARO limita a navegação a 1.000 anúncios por consulta e 120 requisições/minuto por instância; o Mercado Livre pode impor limites menores. “Total” é o total reportado pela API, não unidades vendidas. Os anúncios não são links afiliados do FARO.

O OAuth administra uma conta autorizada; client ID/secret, chave de cifragem, chave administrativa e tokens nunca devem ser enviados pelo chat, colocados no navegador ou versionados. A tela pública `/conectar-mercadolivre/` calcula a callback para o domínio atualmente aberto e protege as ações com chave administrativa; cada domínio real também precisa estar na allowlist do servidor e registrado no app Mercado Livre. A chave de cifragem deve permanecer em secrets do servidor. Access/refresh tokens são cifrados com AES-256-GCM no MySQL gerenciado.

**Banco:** por decisão explícita do usuário, `server` e `database` foram habilitados; a migração `001` foi aplicada. O banco é compartilhado entre Preview e produção; uma autorização feita na prévia fica disponível ao runtime publicado. Não há tokens gravados no momento. Não publique um backend até concluir a conexão e confirmar o endpoint/escopo real.

A documentação oficial consultada não confirmou acesso geral a `/sites/MLB/search?q=...`; o teste anônimo retornou 403. O app chama o endpoint candidato apenas após OAuth e mantém a busca ao vivo bloqueada até o teste administrativo retornar anúncios válidos. Se o provedor devolver 401/403/shape incompatível, a busca editorial continua funcionando. Não há scraping nem integração com Amazon, Shopee ou APIs de redes sociais nesta fase; o botão WhatsApp existente apenas compartilha um link e não publica conteúdo por integração.

Hospedar somente `dist/` em Netlify/Cloudflare não publica o backend nem seus secrets; nessa opção, a busca local curada permanece disponível, sem resultado ao vivo. Para pesquisa dinâmica, publique o container Manus ou implemente um backend autorizado equivalente.

## SEO, publicação e operação

HTML inicial contém corpo, metadata e links por rota. Canonical, `og:url`, sitemap e JSON-LD com URL só são gerados quando `publicOrigin` em `content/site.json` contém o domínio HTTPS real. Não use Preview ou domínio fictício. O projeto inclui `robots.txt` e `manus-routes.json`.

A publicação não foi executada nesta alteração. Consulte o [manual de operação](docs/manual-operacao.md) antes de conectar a conta e publicar. O auto-publish do projeto estava desligado; Preview/checkpoint não significam que o site foi publicado.

## Documentação

- [Relatório final](docs/relatorio-final.md) — escopo, limitações e status de implementação.
- [Pesquisa e validação](docs/pesquisa-validacao-06-11-2026.md) — estudo original de produtos, plataformas e fontes.
- [Estado da API Mercado Livre](docs/mercadolivre-api-status-2026-11-07.md) — links oficiais e incertezas de acesso.
- [Conteúdo promocional](docs/conteudo-promocional.md) — conteúdo para C01/C02/C06.
- [Plano de 30 dias](docs/plano-30-dias.md) — plano orgânico.
- [Manual leigo](docs/manual-operacao.md) — publicação, OAuth e edição.

FARO é nome genérico de trabalho. Disponibilidade jurídica, domínio e handles não foram confirmados.
