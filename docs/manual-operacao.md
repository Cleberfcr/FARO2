# Manual leigo — publicar e operar o FARO

Estado em 07/11/2026: backend Manus e banco gerenciado compartilhado foram habilitados com autorização do usuário; a migração inicial foi aplicada. **O app e os secrets do Mercado Livre ainda não foram configurados, então a busca externa está bloqueada.** Existe um deploy bem-sucedido de uma revisão anterior; as alterações atuais ainda precisam ser publicadas.

## Publicar a versão estática

O pacote [`faro-netlify-dist.zip`](../faro-netlify-dist.zip) contém o catálogo curado e as páginas compiladas. Extraia o ZIP, entre no painel Netlify, escolha deploy manual e arraste a pasta `dist` completa. A URL `netlify.app` serve as páginas e o catálogo local; não inclui backend, OAuth ou busca ao vivo. Cloudflare Pages é outra alternativa estática. Para API dinâmica, é necessário publicar o container Manus ou outro backend compatível. Não coloque secrets no ZIP ou HTML.

A revisão atual deste projeto ainda não foi publicada; há um deploy bem-sucedido de uma revisão anterior. Antes de publicar a revisão atual, reveja limites e custos vigentes no Dashboard e não prometa custo zero para backend/banco.

## Busca ao vivo e OAuth Mercado Livre

O Radar tem busca editorial local e uma área separada para anúncios externos. Com OAuth e teste autorizado, a busca do marketplace começa automaticamente ao digitar ao menos três caracteres; **Carregar mais** pagina por clique. O FARO limita a 1.000 anúncios por consulta e 120 chamadas por minuto por instância; a API pode limitar antes. Portanto, não há busca literalmente infinita. Anúncios não provam vendas, avaliações, comissão, estoque, elegibilidade ou recomendação e seus links não são afiliados do FARO.

O teste sem autenticação ao endpoint candidato retornou 403; a documentação oficial consultada não confirmou a busca geral por palavra-chave para afiliados. A aplicação tenta habilitar o recurso somente depois que uma chamada OAuth real retornar anúncios válidos. Se houver 401/403 ou resposta incompatível, a busca externa fica bloqueada e a base curada continua disponível. Não use scraping.

### Configurar e conectar

1. No Preview do projeto, abra `/conectar-mercadolivre/` e copie a URL de callback exibida. Cadastre **exatamente** essa URL no app criado no DevCenter Mercado Livre. A callback atual é para a origem Preview; ao usar outro domínio, atualize `marketplaceAllowedOrigins` e cadastre a nova callback no app.
2. No DevCenter, crie/abra a aplicação e obtenha Client ID e Client Secret. A autorização será em nome da conta do operador; a integração faz apenas buscas de leitura.
3. Quando o app estiver pronto, peça ao Manus o cartão seguro para registrar `MERCADOLIVRE_CLIENT_ID`, `MERCADOLIVRE_CLIENT_SECRET`, `FARO_ADMIN_KEY` e `FARO_TOKEN_ENCRYPTION_KEY`. **Não envie os valores pelo chat, e-mail, JSON ou Git.**
4. Gere `FARO_ADMIN_KEY` com ao menos 32 caracteres, exclusiva do FARO. Gere a chave de cifragem com `openssl rand -base64 32` ou gerenciador equivalente. Guarde-a com segurança e não a troque casualmente: tokens existentes dependem dela.
5. Em `/conectar-mercadolivre/`, digite a chave administrativa, clique **Conectar conta** e autorize no Mercado Livre. Em seguida clique **Testar busca somente leitura**. Somente um teste bem-sucedido libera a busca.
6. Para desconectar, use **Remover token local**. Isso apaga o token FARO, mas não revoga a permissão na conta Mercado Livre; faça a revogação também no DevCenter/conta.

A página de conexão é pública; só as ações administrativas exigem chave. OAuth usa `state` temporário de uso único. Tokens são cifrados AES-256-GCM no banco e chaves ficam em secrets do servidor; não aparecem no browser, HTML ou Git.

**Atenção:** Preview e produção usam o mesmo banco MySQL; não há ambiente de desenvolvimento separado. Token autorizado em Preview também fica disponível ao runtime publicado. Conecte somente a conta que deseja usar na operação real.

## Origem, sitemap e rebuild

No código-fonte, abra `content/site.json` e troque `"publicOrigin": ""` pela origem HTTPS publicada, sem `/` no final; por exemplo: `"publicOrigin": "https://seu-nome.netlify.app"`. Se a origem de produção for diferente da Preview, atualize também `marketplaceAllowedOrigins` e a callback do app Mercado Livre. Rode `npm ci`, depois `npm run build`, confira a pasta `dist` e publique novamente. Abra `/sitemap.xml` e confirme os URLs. Não use origem fictícia, local ou Preview como canonical pública.

## Editar a curadoria

`/painel/` é um editor editorial local, **não privado**; não insira senha, dados de cliente ou informação pessoal. Escolha a oportunidade, edite campos e fontes HTTPS, ajuste os nove componentes do score, valide e clique **Baixar catálogo editado**. Substitua `content/opportunities.json` pelo arquivo baixado, rode `npm ci` e `npm run build`, e publique `dist`. O rascunho fica no navegador atual; baixe uma cópia antes de sair. Use `ANALISAR`, não `COMPRAR`, quando faltarem fonte ou oferta confirmada.

`content/site.json` concentra identidade, cores, origem, contato e flags. O hero usa a ilustração editorial gerada do Perdigueiro FARO por um endereço estável de armazenamento Manus; ela não é uma foto de produto nem representa teste, preço ou oferta real. Esse caminho funciona no Preview e na publicação Manus. Em Netlify/Cloudflare independentes, o endereço `/manus-storage/...` pode não existir: antes de publicar ali, obtenha uma cópia local pronta, salve em `public/assets/` e atualize `heroImage` e `staticHeroImage` para esse caminho; depois gere o ZIP `dist` novamente. FARO é nome genérico de trabalho; não foi liberado juridicamente.

## Afiliados, newsletter e custos

Mantenha `affiliateLinksConfigured` como `false` até haver conta aprovada, SKU/link conferido e disclosure perto do CTA. Busca de anúncios não cria link afiliado. Newsletter permanece desativada; só habilite depois de identificar responsável/contato e revisar finalidade, consentimento, retenção, descadastro e política real.

A pesquisa original indicou opções de hospedagem estática gratuita na data da coleta, mas isso não garante custo zero para backend, banco ou recursos computacionais. Confira uso e limites do plano no Dashboard; domínio, e-mail, analytics, mídia e outros serviços podem custar. Não há outras integrações de marketplace ou redes sociais nesta fase.

## Verificação antes de compartilhar

Confira Home, `/radar/`, detalhes, fontes, `robots.txt`, `sitemap.xml`, `/painel/` e `/conectar-mercadolivre/` em computador e celular. A busca externa deve continuar bloqueada até autorização real e teste bem-sucedido; nenhum CTA deve aparecer sem oferta elegível conferida.

## Fontes oficiais consultadas

- [Criar aplicação Mercado Livre](https://developers.mercadolivre.com.br/pt_br/crie-uma-aplicacao-no-mercado-livre)
- [OAuth e tokens](https://developers.mercadolivre.com.br/en_us/search-products-seller/identity-and-access-management-oauth-and-tokens)
- [Itens e buscas](https://developers.mercadolivre.com.br/pt_br/itens-e-buscas)
