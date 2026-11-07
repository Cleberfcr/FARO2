# FARO — relatório final de pesquisa, implementação e operação

**Data da implementação:** 07/11/2026. **Pesquisa-base:** 06/11/2026. **Status:** MVP editorial estático, backend Manus e banco gerenciado habilitados; migração 001 aplicada; OAuth Mercado Livre sem credenciais/conexão; busca ao vivo bloqueada; não publicado em domínio externo. FARO é um nome genérico de trabalho escolhido pelo usuário, não uma marca liberada.

O dossiê distingue **DADO COMPROVADO**, **SINAL DE MERCADO**, **ESTIMATIVA**, **HIPÓTESE** e **RECOMENDAÇÃO**. A pesquisa detalhada e os URLs de referência estão em [Pesquisa e validação (06/11/2026)](pesquisa-validacao-06-11-2026.md). A triagem dos nomes está em [Relatório de naming](marca-e-nomes.md) e [Rodada complementar](marca-recomendacao.md).

## 1. Resumo executivo

Foi criado um site editorial de pesquisa e descoberta, não uma loja com estoque ou checkout: **21 rotas HTML estáticas**, 8 análises de categoria, pesquisa local em catálogo curado, filtros, comparação de até três itens, favoritos no navegador, compartilhamento, páginas de metodologia/fornecedores/transparência, painel local de edição e uma tela de conexão OAuth. O projeto também inclui backend Node/MySQL para testar, em modo somente leitura, uma consulta Mercado Livre após OAuth; ainda não há credenciais/autorização e a busca externa está bloqueada. A Home usa imagem ilustrativa otimizada, sem representar SKU real.

Todas as oito recomendações estão em **ANALISAR**. Não há preço, estoque, quantidade vendida, vendedor escolhido, comissão efetiva, link afiliado elegível, conversão ou margem líquida confirmados por SKU. O formulário de e-mail está desativado por padrão; os links de compra permanecem ausentes até que o operador configure uma oferta real e confirme as regras do programa.

## 2. Validação do modelo

O modelo recomendado é **curadoria editorial + conteúdo orgânico + links afiliados elegíveis**, sem estoque, mídia paga ou checkout durante o teste inicial. A hipótese é viável para um piloto de custo baixo, mas **a oportunidade de negócio ainda não está validada**: dados setoriais não demonstram vendas de cada produto, tráfego, conversão ou comissão líquida.

A sequência adotada foi Produto → Demanda → Tendência → Concorrência → Monetização → Conteúdo → Tráfego → Conversão → Viabilidade. A recomendação é iniciar por C01, beleza capilar/labial, após selecionar no máximo quatro SKUs e confirmar oferta, vendedor, comissão e atribuição. Um teste orgânico de seis vídeos em sete dias é uma hipótese de operação, não uma previsão de resultado. C02 é a segunda hipótese; C06 é exploratória, com confiança baixa. Não investir em estoque ou anúncios antes de observar cliques qualificados e comissões aprovadas.

## 3. Pesquisa atualizada

**C01 — óleos capilares e cosméticos labiais:** NIQ reportou crescimento em 2024 de 68% para óleos de tratamento capilar e 47% para cosméticos labiais no Brasil; isso é sinal setorial, não venda de SKU. Fontes de Salon Line e Maybelline descrevem produtos, mas alegações de fabricante não são comprovação independente de eficácia. Pesquisa Globo fornece contexto para influência e descoberta social, sem provar viralização do FARO.

**C02 — brinquedos interativos/enriquecimento pet:** a Abempet reportou R$ 75,4 bilhões e crescimento de 9,6% no setor pet brasileiro em 2024. Fontes veterinárias explicam enriquecimento ambiental e a Petlove mantém categorias de brinquedos interativos. Isso não comprova demanda por um SKU. Segurança, porte, material, limpeza e supervisão são critérios centrais.

**C06 — jardinagem urbana/suportes:** existe contexto institucional brasileiro de agricultura urbana; sinais de tendência sobre cultivo vertical e plantas em interiores são em parte internacionais. A disponibilidade e comissão de SKUs locais não foram confirmadas; a confiança é baixa.

Outras hipóteses: organizadores modulares/prateleiras (C03), iluminação decorativa/espelhos pequenos (C04), acessórios básicos de treino/hidratação (C08), cadeiras gamer/ergonômicas de entrada (C05) e organizadores de bagagem/viagem (C07). A oferta ou a demanda específica de SKU não foi comprovada para essas famílias. Dados completos, fontes e riscos estão na [pesquisa-base](pesquisa-validacao-06-11-2026.md).

## 4. Plataformas gratuitas

**Netlify Free** continua como alternativa de hospedagem estática para o catálogo editorial; a pesquisa de 06/11/2026 reportou US$0/mês, 300 créditos por ciclo, pausa dos sites quando o saldo chega a zero e ausência de cobrança excedente automática. Isso não inclui o backend Manus nem garante custo zero para banco/API; limites e preços podem mudar. Usa subdomínio `netlify.app` e HTTPS automático; domínio próprio é custo separado. A busca ao vivo requer container Manus ou backend equivalente.

**Cloudflare Pages** é a alternativa não escolhida: bom encaixe técnico para conteúdo estático e limites gratuitos amplos segundo a documentação consultada, mas formulários/backend usam Workers/Functions e a página pública da Netlify deixou mais claro o uso comercial e o caminho de Forms para este MVP.

**GitHub Pages** não é recomendado para produção deste projeto: os limites oficiais consultados restringem uso gratuito como negócio online/e-commerce/site primariamente voltado a facilitar transações comerciais. A pesquisa completa está no relatório-base. Não há domínio comprado nem conta conectada nesta implementação.

## 5. Ferramentas

Node.js 22, HTML/CSS/JavaScript, JSON editável e driver MySQL `mysql2`. O site é pré-renderizado para SEO e mantém catálogo editorial; o código adiciona API/infraestrutura para testar uma consulta Mercado Livre após OAuth, mas ainda não há credenciais ou autorização e nenhum resultado ao vivo foi confirmado. O painel editorial continua local e exporta JSON; não é CMS autenticado. A imagem de hero é WebP ilustrativa e leve. Analytics de plataforma está habilitado no Manus; a exportação estática não injeta analytics de terceiros. CRM, e-mail e redes sociais não foram conectados.

## 6. Produtos promissores

“Promissor” significa hipótese priorizada, não oportunidade comprovada. A recomendação de partida é C01. Conteúdo comercial detalhado e roteiros seguros estão em [Conteúdo para as hipóteses prioritárias](conteudo-promocional.md).

## 7. Radar de oportunidades

O radar expõe necessidade, público hipotético, score por categoria, confiança, sinais, riscos, lacunas, data e fontes. Busca editorial aceita termos como cozinha, pet, academia, TikTok, alta comissão e “vendendo muito”. A interface de busca geral ao Mercado Livre está codificada, mas continua bloqueada até OAuth e teste autorizado; não há atualização automática de preço/estoque na curadoria. Filtros cobrem categoria, score, confiança e ordenação; o comparador aceita até três oportunidades e favoritos ficam apenas no navegador atual.

## 8. Ranking

| Prioridade | Família | Score / 100 | Confiança | Leitura |
|---:|---|---:|---|---|
| 1 | C01 — óleos capilares e cosméticos labiais | 77 | Média | Melhor evidência setorial; primeira hipótese de conteúdo. |
| 2 | C02 — brinquedos interativos/enriquecimento pet | 67 | Média | Setor grande e oferta por categoria; segurança e SKU ainda pendentes. |
| 3 | C06 — jardinagem urbana e suportes | 62 | Baixa | Sinal visual, mas evidência comercial local fraca. |
| 4 | C04 — iluminação decorativa e espelhos | 61 | Média | Conteúdo possível; segurança, oferta e demanda por SKU pendentes. |
| 5 | C07 — organizadores de bagagem | 61 | Média | Contexto de viagem; demanda e comissão do SKU não confirmadas. |
| 6 | C03 — organizadores modulares e prateleiras | 60 | Média | Alternativa visual, com sinais específicos ainda limitados. |
| 7 | C05 — cadeiras gamer/ergonômicas de entrada | 58 | Média | Não prometer ergonomia/benefício clínico sem documentação. |
| 8 | C08 — acessórios básicos de treino/hidratação | 54 | Baixa | Baixa prioridade até surgir oferta e sinal de demanda verificáveis. |

Pesos iniciais: Demanda 20, Tendência 15, Potencial de viralização 15, Comissão/margem potencial 15, Concorrência 10, Reputação/prova social 10, Facilidade de divulgação 5, Disponibilidade 5, Recompra 5. A nota é avaliação editorial de categoria, não vendas nem probabilidade de lucro.

## 9. Fornecedores

O diretório separa **fabricante, varejista, marketplace e programa de afiliados**. Salon Line, Maybelline, Petlove e páginas/categorias de marketplace aparecem como fontes de produto ou sinais de oferta, não como garantia de estoque, reputação de vendedor, dropshipping, revenda ou comissão. Não foi validado fornecedor atacadista/dropshipping específico. Não foi possível confirmar elegibilidade, vendedor, preço ou entrega de qualquer SKU prioritário.

## 10. Afiliados

Condições públicas reportadas em 06/11/2026; confirmar tudo no painel no momento de adesão e divulgação:

- **Amazon Associados Brasil:** a pesquisa reportou 13% em Beleza/Saúde e Cuidados Pessoais, 11% em Pet, 8% em várias categorias de Casa/Esportes e 7% em categorias de bagagem, sujeito à classificação do SKU e compras qualificadas. Sessão normalmente de 24 h, com condições especiais de carrinho; análise reportada após três vendas qualificadas em 180 dias e mínimo de pagamento R$30. A declaração obrigatória de participante precisa ser usada conforme as regras.
- **Mercado Livre Afiliados e Criadores:** a pesquisa reportou 16%/8% em Beleza direta/indireta e 12%/6% em Casa, brinquedos e outras categorias. Atribuição de 24 h; validação pode levar até 60 dias; mínimo R$30 e transações de ao menos três usuários distintos segundo os termos consultados. Mídia paga é restrita; search/shopping e termos de marca não devem ser presumidos permitidos.
- **Shopee Afiliados:** a pesquisa reportou 3% em situações indicadas e até 30% extra para parceiros selecionados; janela de até sete dias pelo último clique e mínimo reportado de R$10 validado. Não há taxa universal. Há restrições a tráfego pago, termos de marca, spam e tráfego artificial.

Não há cadastro aprovado, ID ou link afiliado no site. Disclosure é visível; oferta só aparece quando `affiliateLinksConfigured` estiver `true`, a oportunidade estiver em `COMPRAR` e o operador inserir URL HTTPS, SKU, preço, marketplace, data de conferência e declarar elegibilidade. O checkbox do painel é uma declaração do editor, não validação automática pelo programa; a flag é um bloqueio geral para desligar todos os CTAs.

## 11. Nome

O usuário escolheu **FARO** como nome genérico de trabalho. Dez nomes da triagem anterior: Clareva, Zelora, Nitora, Seleva, Veriva, Evidara, Sinale, Metriva, Lumeva e Levora. A triagem de 06/11 classificou os nomes alternativos como arriscados por usos/domínios/handles ou proximidades e recomendou não adotar nenhum deles. **FARO não foi liberado juridicamente nem teve INPI, domínio ou handles confirmados após a escolha.** Não registrar, comprar domínio ou abrir perfis com base neste protótipo; fazer busca formal e jurídica primeiro.

## 12. Identidade visual

Direção editorial suíça contemporânea com contraste botânico: papel `#F6F5EF`, tinta `#16221D`, verde profundo `#214D3A`, lima suave `#D7EA84`, cinza `#66716B` e linhas `#DDE1D8`. Títulos em serifa editorial do sistema; corpo sem serifa; etiquetas monoespaçadas. Marca direcional simples em quatro pontos, hierarquia forte, notas de fonte/data e espaçamento generoso. A ilustração do hero mostra o Perdigueiro FARO seguindo uma trilha de etiquetas abstratas, sem produtos, preços ou marcas; a legenda esclarece que a mascote segue pistas, não promessas, e não sugere teste de produto.

## 13. Posicionamento

“Uma curadoria editorial que encontra sinais, explica por que uma categoria entrou no radar e mostra o que ainda precisa ser confirmado.” Personalidade: observadora, prática e transparente. Slogan: **“Veja os sinais. Confira os limites. Decida com contexto.”** O FARO não afirma que testou produtos nem que é loja, fabricante ou parceiro aprovado.

## 14. Arquitetura

Home; Radar; oito análises individuais; Fornecedores e programas; Metodologia; Guia de primeiro teste; Sobre; Divulgação de afiliados; Privacidade; Termos; Cookies e métricas; painel local; agradecimento de formulário (noindex); 404. Contato real não foi inventado porque não existe e-mail/WhatsApp empresarial fornecido. Não há páginas falsas de “mais vendidos” ou ofertas ativas.

## 15. UX/UI

Hero assimétrico, busca direta, resultados e estados vazios, cards com score e ressalva, filtros claros, comparador reversível, favoritos locais, links de fonte, disclosure e alertas de incerteza. Layout responsivo; suporte a teclado, foco visível, skip-link, rótulos, `aria-live`, alt text e `prefers-reduced-motion`. A interface foi conferida em desktop e largura mobile. O painel informa que é público/local e não deve receber dados sensíveis.

## 16. Funil

Visitante → descoberta pela Home/busca → interesse no card → análise de sinais e riscos → confiança via fontes/data/metodologia → decisão de continuar investigando. Só depois de SKU e link confirmados poderá existir CTA afiliado → marketplace → compra. No MVP atual a etapa de compra fica bloqueada; não há preço ou CTA comercial inventado.

## 17. SEO

HTML inicial pré-renderizado por rota, `lang=pt-BR`, title/description por página, H1, Open Graph/Twitter, links internos, sitemap e JSON-LD condicional a `publicOrigin` HTTPS real. Sitemap é omitido até preencher a origem pública; robots.txt permite que crawlers leiam o `noindex` do painel e da página de agradecimento. Não há schema `Product`, preço, review ou nota de cliente fictícios. Depois de publicar, configurar a URL pública real, reconstruir e reenviar para gerar canonicals, OG e sitemap válidos.

## 18. Conteúdo

Roteiros, títulos, descrições, benefícios condicionais, objeções, FAQ, CTAs editoriais, SEO e adaptações para TikTok, Instagram, YouTube Shorts e Pinterest para C01, C02 e C06 estão em [Conteúdo para as hipóteses prioritárias](conteudo-promocional.md). São três famílias priorizadas, não SKUs anunciados. Não declarar eficácia cosmética, tratamento veterinário, capacidade estrutural, vendas ou viralização sem evidência.

## 19. Tráfego

Plano de tráfego orgânico para TikTok, Instagram, Shorts, Pinterest, Google/SEO e WhatsApp, com cadência de teste, conteúdo, objetivo e CTA, está no [Plano operacional de 30 dias](plano-30-dias.md). Não iniciar mídia paga antes de entender as regras do programa, a comissão validada e a elegibilidade do canal.

## 20. Código completo

O código-fonte completo está no arquivo de entrega `faro-codigo-fonte.zip`; a distribuição compilada está em [FARO — pacote de deploy Netlify](../faro-netlify-dist.zip). São artefatos complementares: um contém fontes/documentação; o outro, a pasta estática `dist/` pronta para o primeiro deploy.

## 21. Estrutura

`content/` guarda JSON de oportunidades, programas e configuração do site; `src/templates/` define páginas; `src/css/` e `src/js/` definem identidade e comportamento; `src/server/` contém API OAuth/MySQL; `migrations/` contém schema aditivo; `public/` guarda assets e rotas; `scripts/` compila, migra, serve e valida; `dist/` é a saída estática; `docs/` reúne pesquisa e operação. Comandos: `npm ci`, `npm run build`, `npm run validate`, `npm start`/`npm run dev`. `mysql2` é dependência do runtime backend.

## 22. Publicação

O deploy público não foi feito; nenhuma conta Netlify/Cloudflare foi conectada e o auto-publish Manus permaneceu desligado. Server/database estão habilitados e a migração foi aplicada, mas faltam app, credenciais e teste OAuth. O pacote `faro-netlify-dist.zip` pode ser extraído e publicado como site estático; pesquisa ao vivo requer publicar o container Manus depois de confirmar o endpoint/autorização, ou usar backend equivalente. A URL pública e domínio ainda precisam ser definidos pelo operador.

## 23. Edição

`/painel/` permite escolher ou criar oportunidade, alterar texto, score por dimensão, fontes, dados de SKU, URL afiliada, preço/data declarados pelo editor e recomendação; valida o JSON e baixa um arquivo. O rascunho fica no navegador do usuário e não atualiza o site ao vivo. Para publicar a mudança, substituir `content/opportunities.json`, rodar o build e reenviar `dist/`. A configuração de nome, origem, cores, contato, formulário e kill switch global `affiliateLinksConfigured` fica em `content/site.json`; mantenha a flag desligada até revisar todos os links comerciais.

## 24. Descoberta de produtos

A busca só encontra itens da base editorial existente. Para adicionar oportunidades, pesquisar fontes de categoria e produto, separar dado de hipótese, verificar necessidade/público, oferta e regras, registrar URLs HTTPS, calcular dimensões com evidência, colocar inicialmente `ANALISAR` e documentar riscos/lacunas. Não preencher vendas com ranking, views, reviews ou popularidade; não converter uma categoria em SKU confirmado sem abrir e conferir oferta atual.

## 25. Plano de 30 dias

O calendário diário, critérios de avanço e métricas estão em [Plano operacional de 30 dias](plano-30-dias.md). Principais indicadores: visitas, buscas, aberturas de detalhes, favoritos, cliques externos, CTR de saída, retenção/conclusão de vídeo, pedidos aprovados, cancelamentos, comissão validada, EPC e leads somente depois que captação estiver autorizada/configurada.

## 26. Auditoria

Build e validação local concluídos: 21 rotas HTML geradas; 13 páginas públicas e 8 análises reconhecidas pelo validador; ausência de links internos quebrados críticos; manifesto com 14 rotas válido; 404 testado; queries de cozinha, pet, academia, alta comissão e “vendendo muito” exercitadas; painel carrega oito oportunidades e nove dimensões; e-mail inativo; hero gerenciado presente e conferido em desktop/mobile. A exportação para hosting independente ainda exige um asset local. Todas as notas continuam `ANALISAR`; nenhum link comercial externo foi criado. Não há testes automatizados end-to-end nem teste de compra real, por não existirem conta/links.

## 27. Limitações

Catálogo não é dinâmico, não acessa marketplace ao vivo, não consulta tendências automaticamente, não valida comissão, preço, estoque, vendedor ou elegibilidade, não armazena leads e não autentica o painel. Favoritos permanecem no dispositivo. A pesquisa é datada e regras podem mudar. Contato, redes sociais e domínio não foram fornecidos. Email capture está desativado por padrão até completar identificação do controlador e política. Acessibilidade foi revisada de forma básica, não certificada por auditoria independente.

## 28. Próximos passos

1. Fazer busca formal no INPI, domínio e redes para FARO antes de lançar a marca.
2. Abrir/validar conta em um programa de afiliados e confirmar as regras vigentes.
3. Escolher dois óleos capilares e dois itens labiais reais; confirmar preço, vendedor, procedência, estoque, comissão, link e atribuição. Marcar `COMPRAR` apenas se elegíveis e atualizados.
4. Preencher identidade legal e contato; revisar privacidade/consentimento antes de habilitar newsletter.
5. Fazer primeiro deploy no Netlify Free; colocar a origem pública real e reconstruir para habilitar canonical e sitemap.
6. Executar o piloto orgânico por sete dias e revisar métricas antes de escalar.

## Referências e anexos

- [Pesquisa de validação com referências e metodologia](pesquisa-validacao-06-11-2026.md)
- [Nomes da primeira rodada](marca-e-nomes.md)
- [Recomendação/segunda rodada de nomes](marca-recomendacao.md)
- [Estado e limites da API Mercado Livre](mercadolivre-api-status-2026-11-07.md)
- [Conteúdo promocional para C01, C02 e C06](conteudo-promocional.md)
- [Manual leigo](manual-operacao.md)
- [Plano de 30 dias](plano-30-dias.md)


## Atualização 07/11/2026 — solicitação de busca automática

O usuário confirmou Mercado Livre como primeira integração e autorizou explicitamente backend Manus e banco gerenciado compartilhado. Os recursos estão ativos na revisão 4; a migração aditiva `001_mercadolivre_oauth.sql` foi executada e o schema FARO verificado. O código agora possui runtime HTTP/API, fluxo OAuth com `state` de uso único, origem de retorno allowlisted, troca e renovação de token no servidor, tokens cifrados com AES-256-GCM, limites de consulta, interface de conexão e busca automática por digitação com paginação manual. Não há Client ID/Secret, chave administrativa, chave AES ou autorização OAuth configurados; nenhum token foi gravado.

O endpoint candidato de busca geral, testado sem autenticação, retornou 403. A documentação oficial consultada confirma cadastro de app e OAuth para acesso em nome de vendedor, mas não confirmou que `/sites/MLB/search?q=...` ofereça busca geral de catálogo para afiliados. Por segurança, o recurso permanece bloqueado até que o operador registre o app, conecte a conta por fluxo protegido e o teste somente leitura retorne anúncios válidos. O resultado do teste não será tratado como autorização comercial nem garantia de disponibilidade futura. Sem credenciais ou diante de 401/403, o catálogo editorial local continua funcionando.

A busca não é literalmente infinita: o FARO limita a 1.000 anúncios por consulta e 120 requisições por minuto por instância; o provedor pode impor limites menores. O botão “Carregar mais” é manual para evitar chamadas contínuas e descontroladas. Anúncios externos não são links afiliados, não comprovam vendas, avaliações, comissão ou recomendação. Amazon, Shopee e APIs de redes sociais ficaram fora desta etapa.

O banco MySQL é compartilhado entre Preview e produção, sem separação de desenvolvimento; isso foi informado e autorizado. O ZIP estático Netlify/Cloudflare continua sem secrets e sem proxy dinâmico; somente o runtime Manus ou backend equivalente pode realizar busca ao vivo. Há um deploy bem-sucedido anterior na revisão `718fb4f`; a revisão atual ainda não foi publicada.


## Atualização 07/11/2026 — identidade visual da Home

O cabeçalho da página inicial agora dá mais destaque ao wordmark FARO e à bússola existente. A Home adota a linha “Um faro para ofertas. Critério para decidir.” e uma ilustração editorial original do Perdigueiro FARO caminhando e farejando uma trilha de etiquetas abstratas. A imagem não mostra produto, preço, desconto, marca de marketplace nem afirma teste; o texto alternativo e a legenda explicam que a mascote segue pistas, não promessas. O layout e a imagem final foram conferidos em desktop e mobile no Preview. O asset é gerenciado pelo Manus; hospedagens estáticas independentes podem exigir uma cópia local.
