// import Render from "render-js";

class Crawler {
  constructor() {
    this.render = this.render.bind(this);
    this.preRenderPageIfNeeded = this.preRenderPageIfNeeded.bind(this);

    window.onload = () => {
      const pageUrl = window.location.href;
      this.preRenderPageIfNeeded(pageUrl);
    };
  }

  // Método para renderizar uma URL usando Render.js
  render(url) {
    return Render.renderUrl(url);
  }

  // Método para verificar se o agente de usuário é um bot de mecanismo de busca
  isBot(userAgent) {
    return /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
  }

  // Método para pré-renderizar a página se for um bot de mecanismo de busca
  preRenderPageIfNeeded(url) {
    if (this.isBot(navigator.userAgent)) {
      this.render(url)
        .then((html) => {
          console.log("Página pré-renderizada com sucesso:", html);
          // Substituir o conteúdo atual com o HTML pré-renderizado
          document.body.innerHTML = html;
        })
        .catch((error) => {
          console.error("Erro ao pré-renderizar página:", error);
        });
    }
  }

  // Método para atualizar meta tags dinamicamente
  atualizarMetaTags(produto) {
    if (produto) {
      document
        .querySelector('meta[property="og:title"]')
        .setAttribute("content", produto.name);
      document
        .querySelector('meta[property="og:description"]')
        .setAttribute("content", produto.description);
      document
        .querySelector('meta[property="og:image"]')
        .setAttribute("content", produto.images[0]);
      document
        .querySelector('meta[property="og:url"]')
        .setAttribute("content", produto.url);
      document
        .querySelector('meta[property="og:type"]')
        .setAttribute("content", "product");
    }
  }
}

// // Instanciar e usar a classe Crawler
const crawler = new Crawler();
export { crawler };
