# FARO — plano de implementação

## Decisões e objetivo

FARO é o nome genérico de trabalho escolhido pelo usuário em 07/11/2026. Não houve liberação jurídica, reserva de domínio ou perfis com esse nome. A pesquisa de mercado foi concluída em 06/11/2026 e será preservada com fontes e limites: oito famílias avaliadas; beleza capilar/labial é a primeira hipótese, com nota estimada 77/100. Todas as oportunidades estão em ANALISAR, sem vendas por SKU, conversão ou comissão líquida confirmadas.

Construir uma central editorial de descoberta e pesquisa, sem estoque próprio, checkout ou promessa de rendimento. O MVP deve ser executável e exportável, com custo recorrente inicial evitável. A base editorial continua sendo a alternativa local; a busca geral de produtos será complementada por consultas somente de leitura ao Mercado Livre via backend Manus após conexão OAuth e teste autorizado. Não usar scraping, não prometer pesquisa literalmente infinita e não tratar ausência de resposta como vendas. A busca local não precisa de IA paga.

## Implementação e funcionamento

- Site híbrido: HTML estático com metadata completa produzido pelo gerador Node.js; runtime Node.js Manus para `/api/...`, health e OAuth; MySQL gerenciado para state/token mínimo; front-end usa URLs relativas. O pacote estático independente segue útil como fallback curado, mas não contém credenciais nem busca ao vivo.
- Home com posicionamento, busca por intenção, foco piloto, destaques e conteúdos para voltar. Catálogo/radar editorial com oito famílias, filtros por categoria, confiança, nota e recomendação; em separado, busca geral por palavra-chave no Mercado Livre fica bloqueada até OAuth e teste real. Não transformar ausência de dados em vendas, comissão, preço ou estoque comprovados.
- Fichas individuais com necessidade, públicos, utilidade, motivos editoriais, riscos, vantagens condicionais, roteiro, FAQ, fontes/data, nota de categoria decomposta, confiança e lacunas. Distinguir família de produto e SKU. Preço, avaliação, quantidade de avaliações, vendedor, frete, estoque, comissão efetiva e vendas desconhecidos mostram “Não foi possível confirmar.”
- Comparador de até três oportunidades, favoritos salvos somente neste navegador, compartilhamento nativo/WhatsApp e cópia de link. Não há sincronização entre aparelhos.
- Radar de fornecedores/parceiros com páginas e regras já pesquisadas; tipo de entidade e evidência visíveis. Fabricante, marketplace e vendedor não são intercambiáveis. Não atestar reputação, entrega, dropshipping ou revenda sem verificação.
- Guias, metodologia e transparência, Sobre/FAQ e páginas de privacidade, termos, cookies e divulgação de afiliados. Não lançar falsas listas de “mais vendidos”, “ofertas” ou “virais comprovados”; usar rótulos de potencial e análise.
- Links de fabricante/fonte são links editoriais. CTAs afiliados só aparecerão como tais quando URL real elegível estiver configurada; não inventar IDs nem usar link comum como se gerasse comissão. Aviso próximo do CTA e descrição específica exigida pelo programa escolhido.
- Painel editorial local: interface para alterar configuração/dados e exportar JSON validado; não é autenticado e não recebe segredo ou informação pessoal. Página separada noindex permite conexão OAuth Mercado Livre com chave administrativa enviada apenas no request; segredo do app, state, access e refresh tokens permanecem no servidor/banco cifrados, nunca no bundle/navegador.
- Captura de leads/newsletter e contato de WhatsApp preparados para endpoint ou link real do proprietário, centralizados em configuração. Enquanto não forem fornecidos, informar que não estão ativos e não aceitar e-mails com falsa mensagem de sucesso. WhatsApp para compartilhar conteúdo funcionará sem número do proprietário. Uma integração externa gratuita pode ser conectada depois de seus termos e consentimento serem definidos.
- Analytics da plataforma quando disponível e documentado; para a exportação, integração externa opcional. Não fingir que contador local representa visitantes totais, vendas ou comissões. Cliques/conversões/comissões precisam ser apurados no serviço de analytics e painel do afiliado.

## Estrutura e publicação

`content/` contém JSON editável de marca, oportunidades, fornecedores e parceiros. `src/templates/` guarda páginas/layouts; `src/js/` guarda busca local e cliente da API; `src/server/` guarda pool MySQL/OAuth; `migrations/` guarda DDL aditivo versionado. `scripts/` contém build, validação, migração e servidor. `public/` contém CSS, JavaScript, imagem, manifesto e demais assets. `Dockerfile` publica runtime e backend no Manus; `dist/` é a saída estática portável sem secrets. `docs/` guarda pesquisa, relatório, conteúdo, manual e plano operacional.

A plataforma Manus é usada para Preview, backend híbrido e histórico de versões. O ZIP estático permanece portável para Netlify/Cloudflare Pages, mas nesses hosts a busca Mercado Livre ao vivo continua indisponível sem função/backend equivalente. Nenhuma conta ou credencial de marketplace está conectada ainda; a única integração planejada agora é Mercado Livre e não inclui rede social, Amazon ou Shopee. O manual deve distinguir claramente deploy Manus (API possível após OAuth) e pasta `dist` (modo curado). Domínio próprio pode custar; nenhum custo zero futuro é garantido.

## Design

Direções consideradas: editorial suíço com contraste botânico (probabilidade 0,07); revista neo-brutalista com tinta e coral (0,04); minimalismo tátil de catálogo com azul mineral (0,06). Escolha: editorial suíço com contraste botânico, coerente com clareza, modernidade e curadoria.

**Movimento:** design editorial suíço contemporâneo com influência de revistas de objetos e pesquisa.

**Princípios:** informação antes de hype; hierarquia tipográfica forte; whitespace; evidência e ressalva na mesma ficha que o CTA.

**Cores:** papel quente `#F6F5EF` e tinta `#16221D` para serenidade e leitura; verde profundo `#214D3A` para a marca; lima suave `#D7EA84` como marcador de descoberta; cores de status discretas, nunca o único meio de comunicar risco.

**Layout:** hero assimétrico com texto grande à esquerda e ilustração editorial do Perdigueiro FARO à direita; faixas e listas numeradas para ranking; navegação leve; fichas de produto em catálogo compacto, sem encher toda a Home com cartões repetitivos.

**Assinaturas:** marca de orientação em quatro direções, filetes editoriais e pequenas notas de fonte/data; numeração de oportunidades.

**Interação:** filtros explícitos e reversíveis, busca com contagem e vazio útil, favoritos que confirmam o estado, comparação com limite visível e feedback acessível.

**Animação:** transições de 160–220 ms em hover e abertura de painéis; nenhum carrossel automático, brilho contínuo ou falsa urgência. Respeitar `prefers-reduced-motion`.

**Tipografia:** títulos com Georgia/serifa editorial e corpo com sans-serif de sistema (sans de boa leitura, sem depender de chamada externa para renderizar); etiquetas em monoespaçada de sistema. Escala responsiva, textos com largura controlada e contraste legível.

**Essência:** FARO encontra e contextualiza produtos para quem quer escolher com critério, mostrando tanto o motivo da seleção quanto o que falta confirmar. Personalidade: observadora, prática e transparente.

**Voz:** direta e sem promessas universais. Exemplos: “Descubra o que faz sentido para sua rotina.”; “Veja os sinais. Confira os limites. Decida com contexto.”

**Wordmark:** FARO em letras capitais espaçadas com marca direcional própria; nome genérico de trabalho, não desenho copiado de marca existente.

**Cor assinatura:** verde profundo, com acento lima para descoberta.

**Imagens:** um hero original de objetos genéricos de autocuidado em composição editorial, explicitamente ilustrativo; marca direcional simples. Para foto de SKU real, usar apenas imagem fiel/licenciada ou fonte autorizada, nunca gerar imitação. Ilustrações de categoria serão rotuladas como tais, não fotos de produto testado.

## Entrega e limites materiais

Entregar site funcional na Preview, código/pasta de publicação em ZIP, relatórios e manual simples, conteúdo para prioridades, plano de 30 dias e auditoria factual. Preservar a ordem dos 28 tópicos da entrega no relatório de operação. Não declarar negócio validado ou pronto para comissões: continuam pendentes aprovação nos afiliados, links elegíveis, atualização de preço/estoque/comissão, escolha de vendedor e integrações de contato/captação. Não comprar estoque, mídia ou amostra nem executar publicações sociais. Plano de 30 dias é orientação, não agendamento ou automação ativa.


## Aditivo — busca Mercado Livre (07/11/2026)

O usuário relatou que o buscador não funcionava e escolheu a opção 1: priorizar busca somente de leitura do Mercado Livre, com backend Manus; Amazon/Shopee e redes sociais ficam fora desta etapa. No navegador local, consultas de categoria (“produto para academia”) retornam oportunidades da base curada; consultas gerais (“fone bluetooth”, “celular Samsung”, “maquiagem”) retornam zero porque o buscador atual só pesquisa oito famílias editoriais. Não se deve chamar isso de pesquisa geral ao vivo.

O teste HTTP direto em `GET https://api.mercadolibre.com/sites/MLB/search?q=fone%20bluetooth&limit=3&offset=0`, sem conta/token, retornou `403 forbidden`. Isso comprova que a consulta não funcionou neste ambiente; não basta para identificar se a causa foi autenticação obrigatória, mudança/restrição de endpoint ou bloqueio do ambiente. A documentação oficial consultada orienta cadastrar uma aplicação, usar OAuth 2.0 para acesso em nome de vendedor e proteger client secret/access/refresh tokens. Nenhuma credencial foi pedida nem conectada. Não usar scraping nem afirmar que a busca geral do catálogo está oficialmente disponível até confirmar endpoint e escopo de leitura autorizados.

O usuário aprovou em 07/11/2026 a habilitação do backend Manus e do banco gerenciado compartilhado. A configuração WebDev revisão 4 declara `server: true` e `database: true`, com `runtime_sync: applied`; `DATABASE_URL` está disponível ao servidor. O usuário informou que possui ou criará uma aplicação do Mercado Livre e autorizará OAuth. `src/server/mercadolivre.mjs` implementa o fluxo OAuth e um endpoint candidato de busca somente no servidor; o navegador usa URLs relativas `/api/...`; os segredos não entram no bundle nem na resposta HTML. `state` de uso único/expiração, allowlist de redirect origin, escopo de escrita nunca solicitado, sanitização de erros, limite de tamanho/tempo e resposta clara para falta de credenciais, 401/403 e endpoint indisponível são requisitos. A busca só pode ser liberada depois de OAuth real e teste de resposta autorizada; esse resultado empírico não comprova direito de acesso nem disponibilidade futura. Uma vez liberada, a busca oferece paginação/carregamento progressivo conforme limites reais do provedor (não promete “infinito”); preço/imagem/vendedor/link só aparecem quando a fonte os devolve. Métrica de vendas, comissão afiliada, tendência, disponibilidade e elegibilidade não serão inferidas de uma listagem. O catálogo local permanece como alternativa separada quando a integração não está conectada.

Access/refresh tokens OAuth não devem permanecer apenas em memória no container, pois processos/instâncias são efêmeros e tokens podem expirar/rotacionar. O banco gerenciado compartilha desenvolvimento e publicação, sem ambiente de desenvolvimento separado; essa condição foi autorizada. A migração aditiva versionada 001 foi aplicada pelo startup e a consulta read-only confirmou as três tabelas FARO (migrações, estados OAuth efêmeros, conexão); ainda não há tokens. O token é cifrado com AES-256-GCM e a chave fica em secret do servidor, fora do banco/Git/browser. Credenciais do app e chaves serão coletadas somente no cartão protegido; não devem ser enviadas no chat. Nenhum OAuth foi iniciado até agora.

A busca dinâmica só funcionará em runtime com backend e autorização Mercado Livre. O ZIP/Netlify puramente estático não pode guardar segredos nem executar esse proxy sem uma função/backend equivalente; o modo estático deve explicar esse limite. Não publicar a aplicação socialmente, não automatizar marketing nesta fase e não habilitar contas Amazon/Shopee.
### Fontes oficiais consultadas

- [Mercado Livre — criar uma aplicação](https://developers.mercadolivre.com.br/pt_br/crie-uma-aplicacao-no-mercado-livre): cadastro, client ID/secret e configuração de redirect.
- [Mercado Livre — OAuth e tokens](https://developers.mercadolivre.com.br/en_us/search-products-seller/identity-and-access-management-oauth-and-tokens): OAuth para acesso em nome do vendedor e proteção de tokens.
- [Mercado Livre — itens e buscas](https://developers.mercadolivre.com.br/pt_br/itens-e-buscas): documentação pública revisada; o conteúdo disponível não confirmou que a busca geral por palavra-chave usada no teste permaneça sem restrição.


## Atualização de identidade visual da Home — 07/11/2026

Manter o movimento editorial suíço com contraste botânico e a bússola atual, mas dar mais presença ao wordmark FARO no cabeçalho. Na Home, substituir a imagem de cosméticos genéricos por uma única ilustração editorial original da mascote Perdigueiro FARO, caminhando e farejando uma trilha de etiquetas de oferta abstratas. A imagem não pode conter preço, texto, logo de marketplace nem sugerir oferta, teste ou desconto real. Atualizar texto alternativo e legenda para identificar a mascote como ilustração e reforçar que ela segue pistas, não promessas. Manter busca, CTA, paleta e identidade tipográfica; usar asset independente, responsivo e otimizado para a Home e para a exportação estática, sem alterar conteúdo das páginas de produto.
