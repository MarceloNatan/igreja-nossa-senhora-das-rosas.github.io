// Arquivo: assets/js/strapi-fetch.js - CÓDIGO FINAL DE FUNCIONALIDADE (REST API)

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
                    // VERIFICAÇÃO CRÍTICA (Se o item estiver corrompido, pulamos)
                    if (!item.attributes || !item.attributes.Titulo) { 
                        console.warn("Item de artigo inválido encontrado. Pulando.");
                        return; 
                    }
                    
                    const artigo = item.attributes;
                    
                    // Ajuste o objeto aqui para o nome correto do campo "Titulo" (T maiúsculo)
                    const tituloDoArtigo = artigo.Titulo; 
                    
                    // Lógica de Data Segura: Tenta a data publicada ou a data de criação
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
                 container.innerHTML = '<p class="lead text-center">Dom Justino ainda não publicou artigos.</p>';
            }
        })
        .catch(error => {
            console.error('Erro de Integração Strapi (FINAL):', error);
            document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha crítica: O CMS está inacessível.</p>`;
        });
});