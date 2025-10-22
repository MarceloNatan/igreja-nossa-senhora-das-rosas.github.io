// Arquivo: assets/js/strapi-fetch.js

document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ ATENÇÃO: COLOQUE AQUI O SEU IP PÚBLICO DO DIGITALOCEAN
    const apiURL = 'http://167.172.205.53:1337/api/artigos';

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
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
                    // Formatação de data (opcional)
                    const dataFormatada = new Date(artigo.data_publicacao).toLocaleDateString('pt-BR');

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
            console.error('Erro de Integração Strapi:', error);
            document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha ao carregar o conteúdo. CMS fora do ar?</p>`;
        });
});
