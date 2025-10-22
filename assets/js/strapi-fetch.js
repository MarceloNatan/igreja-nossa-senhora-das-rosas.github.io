// Arquivo: assets/js/strapi-fetch.js - CÓDIGO FINAL E ESTÁVEL COM CORREÇÃO DE SINTAXE

document.addEventListener('DOMContentLoaded', () => {
    const graphqlURL = 'https://cms.igrejanossasenhoradasrosas.com.br/graphql';

    const query = JSON.stringify({
        query: `
            query GetArtigos {
                // Tenta buscar a entidade no formato singular mais seguro
                artigoEntities { 
                    data {
                        attributes {
                            // Usamos "Titulo" com T maiúsculo
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
            // Se o status for 400, lança o erro
            throw new Error(`Erro GraphQL: ${response.status}. Sintaxe de Query Incorreta.`);
        }
        return response.json();
    })
    .then(result => {
        // Acesso ao array de dados: result.data.artigoEntities.data
        const artigos = result.data.artigoEntities.data;
        const container = document.getElementById('artigos-lista');
        container.innerHTML = ''; 

        if (artigos && artigos.length > 0) {
            artigos.forEach(item => {
                const artigo = item.attributes;
                
                // Leitura e segurança de dados
                const tituloDoArtigo = artigo.Titulo; 
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
        document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha crítica: O CMS está inacessível. (Verifique console para mais detalhes).</p>`;
    });
});