# Mercado Livre API — consulta de integração FARO

Data: 2026-11-07. Objetivo: verificar se busca geral ao vivo pode ser habilitada de forma oficial antes de solicitar credenciais.

## Teste no endpoint

GET `https://api.mercadolibre.com/sites/MLB/search?q=fone%20bluetooth&limit=3&offset=0` sem Authorization retornou HTTP 403, corpo `{"message":"forbidden","error":"forbidden","status":403,"cause":[]}`. Esse resultado demonstra falha da chamada neste ambiente, mas sozinho não identifica a causa: autorização, endpoint/depreciação, política de acesso ou bloqueio por IP podem produzir o bloqueio.

## Fontes oficiais abertas

1. Mercado Livre, “Create an application”: https://developers.mercadolivre.com.br/pt_br/crie-uma-aplicacao-no-mercado-livre
   - O documento instrui registrar aplicação no DevCenter, informar URLs de redirect, fornece client ID e client secret, e manda consultar OAuth para obter access token.
2. Mercado Livre, “Identity and access management — OAuth and tokens”: https://developers.mercadolivre.com.br/en_us/search-products-seller/identity-and-access-management-oauth-and-tokens
   - A documentação declara OAuth 2.0 para operações em nome de vendedor e orienta armazenar credenciais/tokens com segurança, não no código, não nos logs, e enviar tokens em cabeçalhos, não query string.
3. Mercado Livre, “Itens e buscas”: https://developers.mercadolivre.com.br/pt_br/itens-e-buscas
   - O texto extraído da documentação explica busca e recursos de itens, mas a parte examinada é concentrada em itens/listagens de vendedor e não confirmou autorização de acesso à busca geral por palavra-chave usada no teste.

## Decisão de segurança

Não solicitar client secret/access token pelo chat. Não usar scraping nem declarar suporte à busca geral como comprovado. Prosseguir somente após confirmar o endpoint/escopo oficial. A integração OAuth exige persistência; tokens não devem ser guardados apenas em memória de container efêmero. **A observação original de configuração nesta nota era do início do levantamento, antes da autorização.** Depois, o usuário autorizou explicitamente `server` e `database`, a revisão 4 foi aplicada e a migração aditiva FARO foi executada; o site ainda não recebeu Client ID/Secret nem token OAuth. `publishing.auto_publish` permaneceu desligado.

## Complemento da verificação oficial

A navegação da página oficial “Itens e buscas” abriu o shell dinâmico de consentimento, e a extração estática oficial obtida por `fetch` descreve recursos de itens e buscas por vendedor (ex.: seller ID/nickname) e observa erro 401/403. Uma nova busca direcionada no domínio de desenvolvedores não localizou documentação oficial atual que declare a rota `/sites/MLB/search?q=...` como um endpoint geral de catálogo autorizado para uso afiliado. Não foi possível testar OAuth sem a aplicação/token do usuário. Portanto, o 403 anônimo não prova sozinho que OAuth resolverá; o endpoint e o escopo devem ser confirmados em uma chamada autorizada depois que o app existir. Não usar scraping nem um serviço comercial de terceiro sem escolha explícita.


## Requisitos de segurança OAuth da documentação

A página oficial de OAuth orienta criptografar access tokens com AES-256 em banco, manter a chave de criptografia em um cofre/secret manager fora do banco e do código, restringir acesso, não registrar tokens/headers em logs e enviar tokens no cabeçalho Authorization, nunca na URL. Também recomenda renovação antes da expiração, tratamento de erro de refresh, persistência segura do refresh token rotativo e remoção dos tokens locais quando a conexão for desfeita. Fonte: https://developers.mercadolivre.com.br/en_us/search-products-seller/identity-and-access-management-oauth-and-tokens

## Estado após habilitação consentida

O usuário autorizou explicitamente backend e banco gerenciado compartilhado. A busca geral continua não comprovada: a integração FARO será gated e só passará a exibir resultados depois de OAuth e de uma chamada autorizada que retorne uma estrutura de busca utilizável. Essa confirmação empírica não substitui documentação/termos oficiais nem garante disponibilidade futura. O token de acesso/refresh será criptografado; a conexão ao Mercado Livre ainda não foi iniciada e nenhum segredo do app foi recebido.
