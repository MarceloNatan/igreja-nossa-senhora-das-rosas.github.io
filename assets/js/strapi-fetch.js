// Arquivo: assets/js/strapi-fetch.js - CÓDIGO FINAL E SEGURO

document.addEventListener('DOMContentLoaded', () => {
    // URL HTTPS SEGURA com 'populate=*'
    const apiURL = 'https://cms.igrejanossasenhoradasrosas.com.br/api/artigos?populate=*';

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                // Se a conexão falhar, lança um erro, mas agora sabemos que é problema do CMS
                throw new Error(`Erro ao conectar ao CMS: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('artigos-lista');
            container.innerHTML = ''; 

            if (data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    const artigo = item.attributes;
                    
                    // CORREÇÃO FINAL: Usa a data do artigo, ou a data de criação do item como fallback
                    // Se 'data_publicacao' for nulo, usa a data de criação do Strapi ('createdAt')
                    const dataOriginal = artigo.data_publicacao || artigo.createdAt; 
                    const dataFormatada = new Date(dataOriginal).toLocaleDateString('pt-BR');

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
                 container.innerHTML = '<p class="lead text-center">Dom Justino ainda não publicou artigos.</p>';
            }
        })
        .catch(error => {
            console.error('Erro de Integração Strapi (Final):', error);
            document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha crítica: O CMS está inacessível.</p>`;
        });
});