// Arquivo: assets/js/strapi-fetch.js - CÓDIGO FINAL E FUNCIONAL

document.addEventListener('DOMContentLoaded', () => {
    // URL REST API com HTTPS e POPULATE
    const apiURL = 'https://cms.igrejanossasenhoradasrosas.com.br/api/artigos?populate=*';

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro de rede no CMS: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('artigos-lista');
            container.innerHTML = ''; 

            if (data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    
                    // CORREÇÃO FINAL: O item.attributes não existe, então usamos o item diretamente.
                    if (!item.Titulo) { 
                        console.warn("Item de artigo inválido ou sem Título. Pulando.");
                        return; 
                    }
                    
                    // Leitura de dados 'planos'
                    const tituloDoArtigo = item.Titulo; 
                    const slugDoArtigo = item.slug;
                    const dataDeUso = item.data_publicacao || item.createdAt || new Date(); 
                    const dataFormatada = new Date(dataDeUso).toLocaleDateString('pt-BR');

                    const cardHTML = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm">
                                <div class="card-body">
                                    <h5 class="card-title">${tituloDoArtigo}</h5>
                                    <p class="card-text"><small class="text-muted">Publicado em: ${dataFormatada}</small></p>
                                    
                                    <a href="/artigo-detalhe.html?slug=${slugDoArtigo}" class="btn btn-sm btn-outline-dark mt-3">Continuar Lendo</a>
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
            console.error('Erro de Integração Strapi (FINAL):', error);
            document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha crítica: O CMS está inacessível.</p>`;
        });
});