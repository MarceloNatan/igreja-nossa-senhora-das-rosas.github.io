// Arquivo: assets/js/strapi-fetch.js - CÓDIGO FINAL CORRIGIDO COM GRAPHQL

document.addEventListener('DOMContentLoaded', () => {
    const graphqlURL = 'https://cms.igrejanossasenhoradasrosas.com.br/graphql';

    // 1. Defina a QUERY (A Pergunta) - Nomes em minúsculas para segurança
    const query = JSON.stringify({
        query: `
            query ArtigosQuery {
                // A coleção sempre é referenciada no plural E minúsculas
                artigos (pagination: { limit: 6 }, publicationState: LIVE) {
                    data {
                        attributes {
                            // ATENÇÃO AQUI: 'Titulo' (com 'T' maiúsculo) é o nome do campo no seu schema.
                            Titulo 
                            slug
                            data_publicacao
                            createdAt 
                        }
                    }
                }
            }
        `
    });

    fetch(graphqlURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: query,
    })
    .then(response => {
        if (!response.ok) {
            // Se o status for 400, lança o erro, mas agora sabemos que o problema é a Query
            throw new Error(`Erro GraphQL: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        // Agora, os dados são acessados via result.data.artigos.data
        const artigos = result.data.artigos.data;
        const container = document.getElementById('artigos-lista');
        container.innerHTML = ''; 

        if (artigos && artigos.length > 0) {
            artigos.forEach(item => {
                const artigo = item.attributes;
                
                // Leitura do Título (AGORA COM 'T' MAIÚSCULO, conforme o schema.json)
                const tituloDoArtigo = artigo.Titulo; 
                
                // LÓGICA DE DATA SEGURA
                const dataDeUso = artigo.data_publicacao || artigo.createdAt || new Date(); 
                const dataFormatada = new Date(dataDeUso).toLocaleDateString('pt-BR');

                const cardHTML = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${tituloDoArtigo}</h5>
                                <p class="card-text"><small class="text-muted">Publicado em: ${dataFormatada}</small></p>
                                
                                <a href="/artigos/${artigo.slug}" class="btn btn-sm btn-outline-dark mt-3">Continuar Lendo</a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += cardHTML;
            });
        } else {
             container.innerHTML = '<p class="lead text-center">Nenhum artigo publicado ainda.</p>';
        }
    })
    .catch(error => {
        console.error('Erro de Integração Strapi (FINAL):', error);
        // Não mostrar "CMS fora do ar" para evitar confusão, mas sim uma falha geral
        document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha ao carregar conteúdo editável.</p>`;
    });
});