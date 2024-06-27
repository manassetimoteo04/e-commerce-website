class Crawler {
  constructor() {
    // Verifica se a página deve ser pré-renderizada
    if (this.isBot(navigator.userAgent)) {
      this.preRenderPage();
    }
    this.preRenderPage();
  }
  // Função para atualizar meta tags com base nos dados do produto
  atualizarMetaTags(produto) {
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

  // Suponha que você tenha uma função para carregar os dados do produto
  carregarProduto(id) {
    fetch(`/produto/${id}`)
      .then((response) => response.json())
      .then((produto) => {
        // Atualiza as meta tags Open Graph com base nos dados do produto

        // Atualiza o conteúdo da página com os dados do produto
        document.getElementById("titulo").innerText = produto.titulo;
        document.getElementById("descricao").innerText = produto.descricao;
        document.getElementById("imagem").src = produto.imagem;
      })
      .catch((error) => console.error("Erro ao carregar produto:", error));
  }

  // Verifica se é um bot de mecanismo de busca
  isBot(userAgent) {
    const bots = [
      "googlebot",
      "bingbot",
      "yandexbot",
      // Adicione outros bots se necessário
    ];

    return bots.some((bot) => userAgent.toLowerCase().includes(bot));
  }

  // Função para pré-renderizar página usando Prerender.io
  preRenderPage() {
    const pageUrl = window.location.href;
    const headlessRenderApiToken =
      "dXMtd2VzdC0yOjNiYmIxZDA3LTEzMjAtYzU4OC05NGFkLTI4NTY1NDA1ZmRkZg.LBGc7zVfWLa07NgtRlwAIWMooblmmw6yUDGXDoewr_g"; // Substitua pelo seu token de acesso Prerender.io
    fetch(
      `https://api.headless-render.com/render?url=${encodeURIComponent(
        pageUrl
      )}&token=${headlessRenderApiToken}`
    )
      .then((response) => {
        if (response.ok) {
          console.log("Página pré-renderizada com sucesso.");
        } else {
          console.error("Erro ao pré-renderizar página:", response.status);
        }
      })
      .catch((error) => {
        console.error("Erro na solicitação de pré-renderização:", error);
      });
  }
}

const crawler = new Crawler();
export { crawler };
