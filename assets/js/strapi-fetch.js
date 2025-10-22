// Arquivo: assets/js/strapi-fetch.js - CÓDIGO FINAL E SEGURO COM NOVO GRAPHQL

document.addEventListener('DOMContentLoaded', () => {
    const graphqlURL = 'https://cms.igrejanossasenhoradasrosas.com.br/graphql';

    // A Query será ajustada para o formato plural padrão do Strapi.
    const query = JSON.stringify({
        query: `
            query GetArtigos {
                // Tenta o formato plural correto para a API
                artigos { 
                    data {
                        attributes {
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
            // Este erro é 400 Bad Request
            throw new Error(`Erro GraphQL: ${response.status}. Cheque o console para detalhes da Query.`);
        }
        return response.json();
    })
    .then(result => {
        // Acesso ao array de dados: result.data.artigos.data
        const artigos = result.data.artigos.data;
        const container = document.getElementById('artigos-lista');
        container.innerHTML = ''; 

        if (artigos && artigos.length > 0) {
            artigos.forEach(item => {
                const artigo = item.attributes;
                
                // Lógica de Data Segura (Agora deve funcionar sem o erro)
                const dataDeUso = artigo.data_publicacao || artigo.createdAt || new Date(); 
                const dataFormatada = new Date(dataDeUso).toLocaleDateString('pt-BR');

                const cardHTML = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${artigo.Titulo}</h5>
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
        document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha ao carregar conteúdo editável.</p>`;
    });
});