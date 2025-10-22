// Arquivo: assets/js/strapi-fetch.js - CÓDIGO FINAL DE INTEGRAÇÃO

document.addEventListener('DOMContentLoaded', () => {
    // URL HTTPS SEGURA com o parâmetro 'populate=*' para buscar todos os campos
    const apiURL = 'https://cms.igrejanossasenhoradasrosas.com.br/api/artigos?populate=*';

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                // Se o Strapi não responder (código 404, 500, etc.)
                throw new Error(`Erro ao conectar ao CMS: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('artigos-lista');
            container.innerHTML = ''; 

            // 1. Verificar se há dados
            if (data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    const artigo = item.attributes;
                    
                    // 2. CORREÇÃO CRÍTICA: Tratar o campo 'data_publicacao' que pode ser nulo
                    // Usa a data do artigo, ou a data atual como fallback para evitar o TypeError
                    const dataOriginal = artigo.data_publicacao || new Date(); 
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
                 // Mensagem se o array de artigos estiver vazio
                 container.innerHTML = '<p class="lead text-center">Dom Justino ainda não publicou artigos. Volte em breve!</p>';
            }
        })
        .catch(error => {
            // Este catch só deve rodar se a URL HTTPS falhar, o que agora é raro.
            console.error('Erro de Integração Strapi (Final):', error);
            document.getElementById('artigos-lista').innerHTML = `<p class="text-danger text-center">Falha crítica: O CMS está inacessível. (Verifique Nginx/PM2).</p>`;
        });
});