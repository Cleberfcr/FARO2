# TODO — FARO Radar de Oportunidades

Plano aprovado pelo usuário em 07/11/2026. FARO é nome genérico de trabalho; não foi declarado liberado. Os itens concluídos têm evidência no código, relatório ou validação indicada; verificações externas por SKU seguem abertas.

## 1. Pesquisa, validação, ranking e evidência

- [x] Pesquisar produtos, tendências, marketplaces, programas de afiliados, comissões, hospedagem e regras antes da execução; identificar fontes e data; diferenciar DADO COMPROVADO, SINAL DE MERCADO, ESTIMATIVA, HIPÓTESE e RECOMENDAÇÃO; não inventar dados. Evidência: `docs/pesquisa-validacao-06-11-2026.md`.
- [x] Validar oportunidades na sequência Produto → Demanda → Tendência → Concorrência → Monetização → Conteúdo → Tráfego → Conversão → Viabilidade; registrar oito famílias e scores; explicar que score é priorização, não garantia. Evidência: relatório e `content/opportunities.json`.
- [ ] Antes de exibir oferta/SKU concreto, verificar preço, marketplace, avaliações e sua quantidade, tendência, comissão quando disponível, fornecedor, pontuação, confiança, vantagens, riscos, link e recomendação COMPRAR/ANALISAR/EVITAR; se ausente, indicar “Não foi possível confirmar.” Nenhum SKU foi aprovado até aqui.
- [x] Para cada oportunidade prioritária, registrar público principal/secundário, necessidade, problema, desejo, poder de compra aproximado somente se houver dados, motivação e objeções; documentar riscos e confiança sem inventar poder de compra. Evidência: catálogo, páginas de detalhe e relatório.

## 2. Radar e busca

- [x] Criar RADAR DE OPORTUNIDADES que considere, quando verificável, vendas, avaliações e quantidade, crescimento da procura, tendência, engajamento, popularidade, redes sociais, potencial visual e de demonstração em vídeo, preço, comissão/margem potencial, concorrência, reputação, disponibilidade, prazo, facilidade de divulgação, recompra, risco e estabilidade de oferta. Sinais alternativos aparecem como sinais, nunca como vendas. Busca editorial e campo separado de busca automática estão implementados; a consulta externa permanece fechada até OAuth e resposta válida.
- [ ] Criar Buscador Inteligente de Produtos que aceite frases como “produto viral para cozinha”, “produto que está vendendo muito”, “produto para academia”, “produto barato para pet”, “produto com alta comissão”, “produto para TikTok”, “produto para ganhar dinheiro como afiliado” e “produtos em alta”; retornar resultados com nome, imagem, categoria, preço, marketplace, avaliação, contagem de avaliações, tendência, comissão quando disponível, fornecedor, potencial de viralização, pontuação, confiança, vantagens, riscos, link e recomendação COMPRAR/ANALISAR/EVITAR. A busca de intenção e filtros funcionam para as oito famílias, mas imagem, preço, rating e CTA de SKU permanecem indisponíveis até validação por produto.
- [x] Implementar busca editorial, filtros, categorias, ranking, score, comparação até três, favoritos locais, compartilhamento, recomendações, relacionados e SEO. Mostrar data/fontes e campos desconhecidos. A integração automática Mercado Livre é separada, só de leitura, paginada e aguarda autorização real.

## 3. Fornecedores, marketplaces e afiliados

- [x] Comparar regras públicas dos programas e hospedagem gratuita, incluindo limites e ressalvas. Evidência: relatório de pesquisa e `content/partners.json`.
- [ ] Criar RADAR DE FORNECEDORES que avalie preço, reputação, avaliações, histórico, disponibilidade, entrega, dropshipping, revenda, afiliados e transparência somente com evidência disponível. A página diferencia fabricante, varejista, marketplace e programa, mas nenhum fornecedor atacadista/dropshipping foi validado.
- [x] Exibir divulgação de afiliados e registrar as regras vigentes de links, marcas, publicidade e tráfego; não criar IDs/taxas/links sem elegibilidade confirmada nem recomendar tática proibida. Nenhum link comercial está ativo.
- [x] Não fingir estoque próprio; para venda externa, encaminhar somente por link afiliado apropriado e disclosure próximo quando link elegível estiver configurado; sem elegibilidade, manter CTA de compra bloqueado.

## 4. Marca, posicionamento e identidade

- [x] Apresentar pelo menos dez nomes, conceitos, significados, posicionamentos, slogans, identidades, cores, memorabilidade e riscos, com triagem e ressalvas; registrar escolha do usuário de FARO como nome genérico, não como liberação jurídica. Evidência: `docs/marca-e-nomes.md`, `docs/marca-recomendacao.md`.
- [x] Transmitir descoberta, confiança, modernidade, praticidade, curadoria e oportunidade; definir cores, tipografia, botões, cards, ícones, espaçamento, imagens, hierarquia e estilo fotográfico. Evidência: `plan.md`, CSS, SVG e hero.
- [x] Evitar catálogo aleatório; posicionar como marca que encontra, seleciona e contextualiza sem alegar teste próprio quando não realizado.
- [ ] Fazer busca formal de marca/domínio/handles de FARO antes de qualquer lançamento público. Não faz parte da pesquisa técnica/legal deste protótipo.

## 5. Arquitetura, UX e conversão

- [x] Implementar as páginas com função clara entre Home, Produtos, Categorias, Ofertas, Produtos em alta/virais/mais vendidos, páginas individuais, Busca, Filtros, Comparador, Favoritos, Compartilhamento, Sobre, Contato, FAQ, Blog, Guias, Privacidade, Termos, Cookies, Divulgação de afiliados, Parceiros e Captura de leads. Foram feitas páginas pertinentes ao MVP; não há páginas vazias nem oferta fictícia. Contato/FAQ/blog ativos foram omitidos por não haver conteúdo/contato verdadeiro.
- [x] Projetar funil Visitante → Descoberta → Interesse → Produto → Benefícios → Confiança → CTA → Marketplace → Compra. Página de oportunidade responde o que é, para quem, problema, por que pode valer a pena, fontes, dúvidas e próximo passo; campos de preço/avaliação e compra não aparecem sem confirmação.
- [x] Preparar WhatsApp de compartilhamento e newsletter condicionada a configuração legal e técnica. A captação está desativada; contato comercial depende de o operador fornecer canal real.

## 6. Conteúdo, tráfego e SEO

- [x] Para as três famílias priorizadas, entregar título, subtítulo, descrição, benefícios condicionais, argumentos, objeções, FAQ, CTA, título SEO, meta description, palavras-chave e roteiro/legenda para TikTok, Instagram, YouTube Shorts e Pinterest. Evidência: `docs/conteudo-promocional.md`. Sem promessas falsas.
- [x] Criar estratégias orgânicas para TikTok, Instagram, YouTube Shorts, Pinterest, Google/SEO e WhatsApp, com formato, frequência, conteúdo, CTA, objetivo e caminho ao site. Evidência: `docs/plano-30-dias.md`.
- [x] Implementar títulos, headings, URLs, meta descriptions, links internos, robots.txt, rotas, desempenho mobile e dados estruturados válidos quando houver origem pública. Sitemap/canonicals dependem do domínio HTTPS verdadeiro; não há spam nem schema Product inventado.
- [x] Criar páginas públicas com conteúdo inicial rastreável e metadata coerente; evitar preço, review ou schema Product inventado.

## 7. Tecnologia, custo e edição

- [x] Comparar hospedagens gratuitas, custo, limites, edição, desempenho, SEO, responsividade, domínio, escalabilidade, manutenção, segurança e facilidade; relatório recomenda Netlify Free, considera Cloudflare Pages e desaconselha GitHub Pages para este caso comercial.
- [x] Manter custo de software e hospedagem possível em R$0; informar créditos/limites e custos externos possíveis. Domínio, conta/serviços externos, amostras, mídia e ferramentas opcionais não estão inclusos.
- [x] Entregar código limpo, organizado, responsivo, acessível e editável; centralizar oportunidades, preços, imagens, links, categorias, fornecedores, comissões, nome, logo, cores, textos, banners e controles em conteúdo/configuração.
- [x] Fornecer painel de edição local, importação/exportação e manual; não alegar persistência remota nem CMS.

## 8. Publicação e manual

- [x] Entregar estrutura, arquivos, código, componentes, estilos, scripts, configuração, código-fonte ZIP e distribuição `dist` ZIP.
- [x] Manual leigo explica onde clicar, como copiar, publicar gratuitamente, testar, alterar produtos/conteúdos e reconstruir o site.
- [x] Apresentar Netlify Free, Cloudflare Pages e GitHub Pages com os motivos da escolha/alternativas e limites.
- [ ] Publicar em uma conta externa Netlify/Cloudflare. O usuário pediu instruções; não forneceu conta nem pediu que conectássemos/publicássemos neste passo.

## 9. Crescimento e operação

- [x] Criar calendário operacional de 30 dias cobrindo pesquisa, publicação, seleção de produtos, conteúdo, SEO, redes, análise e otimização. Evidência: `docs/plano-30-dias.md`.
- [x] Definir indicadores simples para visitantes, cliques, CTR, produtos acessados, links clicados, leads, conversões, cancelamentos e comissões aprovadas.
- [x] Criar razão de retorno por tendências, novidades, conteúdo, ranking e curadoria, sem alegar atualização automática.

## 10. Auditoria, transparência e limitações

- [x] Auditar código, rotas, links internos, componentes/scripts, mobile, navegação, busca, filtros, CTA, metadata, sitemap condicional, dados estruturados, contraste, alt, foco e limitações. Build e validador passaram; foram feitas inspeções desktop/mobile e smoke tests da busca/painel. A auditoria também confirmou política legal dinâmica, kill switch global de afiliados e robots.txt sem bloqueio das rotas noindex. Nenhuma compra ou conversão real foi testada porque não há SKU/link elegível.
- [x] Fazer teste de realidade de publicação/edição para iniciante; painel avisa que é local e publica só depois de exportar, reconstruir e enviar `dist`. O teste de usabilidade com cliente real continua fora deste protótipo.
- [x] Relatório final segue os 28 tópicos solicitados e declara dados/limites pendentes.
- [x] Declarar incertezas, limitações e próximos passos; pesquisa não comprova SKU, preço, conversão, comissão líquida, elegibilidade ou marca registrada.

## Bloqueios antes de comercializar

- [ ] Escolher e validar SKUs reais; preencher vendedores, preços, links, comissão, estoque e datas conforme termos vigentes.
- [ ] Obter aprovação no programa/canal de afiliados e confirmar cada link.
- [ ] Resolver titularidade/INPI/domínio/handles para FARO.
- [ ] Definir responsável legal, contato e política de dados antes de ativar newsletter.


## 11. Solicitação de busca geral e integração — 07/11/2026

- [ ] **Busca geral de produtos, automática e paginada.** Reproduzido que a busca anterior consultava apenas oito oportunidades editoriais: “fone bluetooth”, “celular Samsung” e “maquiagem” retornavam zero, enquanto “produto para academia” retornava duas categorias. O novo front-end agora aceita texto geral e chama em debounce uma área separada do marketplace, com botão manual “Carregar mais”, safe fields, fallback editorial e mensagens de erro. O FARO impõe limite de 1.000 anúncios por consulta e 120 requisições/minuto por instância; a API pode limitar antes. Não prometer pesquisa literalmente infinita, vendas ou campos ausentes. A busca externa ainda depende de app OAuth e de um teste autorizado que retorne anúncios válidos.
- [ ] **Integração de catálogo Mercado Livre em modo somente leitura.** Usuário escolheu Mercado Livre como primeira plataforma, autorizou backend Manus/banco e informou que possui ou criará aplicação e autorizará OAuth. A chamada anônima a `/sites/MLB/search?q=...` retornou 403; documentação oficial consultada não confirmou que essa seja uma API geral de catálogo liberada para afiliados. O código mantém a busca bloqueada até autorização real e um teste de resposta válida; esse teste empírico não será apresentado como autorização comercial ou garantia futura. O front-end chama o backend por rota relativa; client secret e tokens nunca ficam no navegador, HTML, Git ou logs. A integração está codificada, mas ainda não testada com credenciais nem publicada.
- [ ] **OAuth e tokens duráveis.** Código do callback, `state` anti-CSRF de uso único, redirect URI/origens permitidas, AES-256-GCM, refresh token no servidor e mensagens para ausência/expiração/401/403 estão implementados. A conexão ainda não está ativa porque aguardamos app, credenciais no cartão protegido e autorização real. Não guardar refresh/access tokens apenas em memória, navegador ou código. Só declarar conexão ativa após chamada autorizada e resposta válida.
- [ ] **Banco gerenciado habilitado; tokens ainda pendentes.** A persistência de token é necessária para tolerar restart/rotação; o banco Manus compartilha o mesmo MySQL entre desenvolvimento e produção e é de mão única, sem ambiente de desenvolvimento separado. O usuário autorizou explicitamente `server: true` e `database: true` em 07/11/2026; a configuração revisão 4 foi aplicada e a migração aditiva `001_mercadolivre_oauth.sql` foi executada pelo servidor. O schema FARO está criado e verificado; ainda não há app OAuth, tokens ou credenciais. Persistir somente os tokens mínimos, cifrados com AES-256-GCM e com chave de servidor fora do banco/Git/browser.
- [x] **Plataformas fora do escopo desta fase.** Nesta rodada, não foram integradas Amazon, Shopee, Instagram, TikTok, Pinterest nem outras redes/lojas. A busca de produtos não cria automaticamente link afiliado; disclosure/kill switch seguem ativos e nenhuma oportunidade foi marcada COMPRAR sem SKU/link elegível verificado.
- [x] **Limite de hospedagem estática.** Busca em tempo real depende de backend e credenciais seguras. O ZIP estático Netlify/Cloudflare não contém secrets nem proxy; a interface mantém a busca editorial curada e explica a ausência do backend. Para resultados ao vivo, será necessário publicar o container Manus ou implementar backend/função equivalente.


## 11. Atualização da identidade da Home — 07/11/2026

- [ ] **Logo maior e mascote Perdigueiro FARO na Home.** Aumentar a presença do wordmark existente sem perder legibilidade ou responsividade. Atualizar a identidade da página inicial e incluir uma ilustração original de um cachorro da raça perdigueiro caminhando/farejando atrás de pistas de oferta. Manter as cores e o estilo editorial do FARO; não inserir preços, descontos, logos ou texto falso na imagem e não sugerir que a mascote ou equipe testou produtos. Atualizar texto alternativo e legenda; validar desktop/mobile e manter imagem independente da exportação estática. **Status:** logo e legenda atualizados; ilustração final já propagou e foi conferida no Preview desktop/mobile. A exportação para hosting independente ainda precisa de um asset local.
