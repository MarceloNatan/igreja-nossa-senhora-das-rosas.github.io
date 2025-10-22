// Arquivo: assets/js/strapi-fetch.js - CÓDIGO FINAL E SEGURO

document.addEventListener('DOMContentLoaded', () => {
    // URL HTTPS SEGURA com 'populate=*'
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
                    // VERIFICAÇÃO CRÍTICA: Se item ou item.attributes estiver faltando, pule
                    if (!item.attributes) {
                        console.warn("Item de artigo inválido encontrado no Strapi. Pulando.");
                        return; // Pula este item corrompido
                    }

                    const artigo = item.attributes;
                    
                    // LÓGICA ROBUSTA DE DATA: Tenta ler data_publicacao, ou usa a data de criação.
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
                 container.innerHTML = '<p class="lead text-center">Dom Justino ainda não publicou artigos.</p>';
            }
        })
        .catch(error => {
            console.error('Erro de Integração Strapi (Final):', error);
            document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha de conexão com o CMS.</p>`;
        });
});