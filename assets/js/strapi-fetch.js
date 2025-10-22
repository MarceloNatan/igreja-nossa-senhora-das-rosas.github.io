// Arquivo: assets/js/strapi-fetch.js - USANDO GraphQL

document.addEventListener('DOMContentLoaded', () => {
    // 1. Defina a URL do Endpoint GraphQL
    const graphqlURL = 'https://cms.igrejanossasenhoradasrosas.com.br/graphql';

    // 2. Defina a QUERY (A Pergunta)
    const query = JSON.stringify({
        query: `
            query ArtigosQuery {
                artigos (pagination: { limit: 6 }, publicationState: LIVE) {
                    data {
                        attributes {
                            titulo
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
                
                // LÓGICA ROBUSTA DE DATA: 
                // Tenta data_publicacao, usa createdAt se falhar.
                const dataDeUso = artigo.data_publicacao || artigo.createdAt || new Date(); 
                const dataFormatada = new Date(dataDeUso).toLocaleDateString('pt-BR');

                const cardHTML = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${artigo.titulo}</h5>
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
        console.error('Erro de Integração Strapi (GraphQL):', error);
        document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha crítica na API GraphQL.</p>`;
    });
});