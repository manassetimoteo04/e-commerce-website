import { CRUD } from "../controller/admin/productCRUD.JS";
import { FORMAT_NUMBERS } from "../controller/features/formatting.js";
class ProductApp {
  constructor() {
    this.categoryListContainer = document.querySelector(".category-list");
    this.mostSelledProducts = document.querySelector(".all-most-selled");
    this.allProductsContainer = document.querySelector(".product-grid-3-cl");

    // this.categoryListContainer?.addEventListener(
    //   "click",
    //   this._toggleCategoryFilter.bind(this)
    // );
    //paginação
    this.btnPrevProduct = document.querySelector(".btn-prev-page");
    this.btnNextProduct = document.querySelector(".btn-next-page");
    this.currProductPage = document.querySelector(".current-page");

    this.btnNextProduct?.addEventListener(
      "click",
      this.goToNextPage.bind(this)
    );
    this.btnPrevProduct?.addEventListener(
      "click",
      this.goToPreviousPage.bind(this)
    );
  }

  _gettingProductStars(data) {
    const star_5 = data.data.comments
      .filter((rate) => rate.rating === 5)
      .reduce((acc, arr) => acc + 1, 0);
    const star_4 = data.data.comments
      .filter((rate) => rate.rating === 4)
      .reduce((acc, arr) => acc + 1, 0);
    const star_3 = data.data.comments
      .filter((rate) => rate.rating === 3)
      .reduce((acc, arr) => acc + 1, 0);
    const star_2 = data.data.comments
      .filter((rate) => rate.rating === 2)
      .reduce((acc, arr) => acc + 1, 0);

    const star_1 = data.data.comments
      .filter((rate) => rate.rating === 1)
      .reduce((acc, arr) => acc + 1, 0);
    const totalRating = star_1 + star_2 + star_3 + star_4 + star_5;
    const returned = {
      star_1: { rate: star_1, stars: 1 },
      star_2: { rate: star_2, stars: 2 },
      star_3: { rate: star_3, stars: 3 },
      star_4: { rate: star_4, stars: 4 },
      star_5: { rate: star_5, stars: 5 },
      totalRating: totalRating,
    };

    let maxRate = -Infinity;
    let acc = 0;
    for (const key in returned) {
      if (key !== "totalRating" && returned[key].rate > maxRate) {
        maxRate = returned[key].rate;
        acc = returned[key].stars;
      }
    }

    return acc;
  }
  _renderStars(s) {
    let star = "";
    for (let i = 1; i <= s; i++) {
      star += '<i data-feather="star"></i> ';
    }
    return star;
  }
  _renderAllProducts(list) {
    if (!this.allProductsContainer) return;
    this.allProductsContainer.innerHTML = "";
    list.forEach((item) => {
      const stars = this._renderStars(this._gettingProductStars(item));
      const html = `
      <div class="new-product-box" data-id="${item.id}">
      <div class="img-box">
      <img src="${item.data.images[0]}" alt="${item.data.name} ${
        item.data.category
      }">
    </div>
      <div class="new-product-content home-recent-product">
          <span class="category-name">${item.data.category}</span>
          <span class="product-name">${item.data.name}</span>
          <div class="product-price-div">
              <span class="current-product-price">${FORMAT_NUMBERS.formatCurrency(
                item.data.price
              )}</span>
              <span class="last-product-price">${FORMAT_NUMBERS.formatCurrency(
                45690
              )}</span>
          </div>
          <div class="product-stars-div">
              ${stars}
          </div>
          <div class="see-product-details">
              <a href="detail.html?id=${item.id}&category=${
        item.data.category
      }&name=${item.data.name}"> <i data-feather="eye"></i></a>

          </div>

      </div>
      <div class="add-product-to-cart-div">
      <div class="increase-quantity-box">
      <span class="decrease-quantity"><i data-feather="minus"></i></span>
      <span class="quantity-label">1</span>
      <span class="increase-quantity"><i data-feather="plus"></i></span>
  </div>
          <button class="add-to-cart">Adicionar<i data-feather="shopping-cart"></i></button>
      </div>
  </div>
        `;
      this.allProductsContainer.insertAdjacentHTML("afterbegin", html);
      feather.replace();
    });
  }
  _renderMostSelledProducts(list) {
    if (!this.mostSelledProducts) return;
    this.mostSelledProducts.innerHTML = "";
    list.forEach((item) => {
      const html = `
      <div class="top-sell-product-box">
      <a href="detail.html?id=${item.id}&category=${item.data.category}&name=${
        item.data.name
      }" class="most-selled-link"></a>
      <img src="${item.data.images[0]}" alt="${item.data.name} ${
        item.data.category
      }">
      <div class="top-sell-product-content">
          <span class="product-category">${item.data.category}</span>
          <span class="product-name">${item.data.name}</span>

          <div class="top-selling-price">
              <span class="top-selling-curr-price">${FORMAT_NUMBERS.formatCurrency(
                item.data.price
              )}</span>
              <span class="top-selling-last-price">${FORMAT_NUMBERS.formatCurrency(
                item.data.price
              )}</span>
          </div>
      </div>
  </div>
      
          `;
      this.mostSelledProducts.insertAdjacentHTML("afterbegin", html);
    });
  }
  _renderAllCategories(data) {
    const categoryContainer = document.querySelector(".category-list");
    if (!categoryContainer) return;
    categoryContainer.innerHTML = "";
    data.forEach((item) => {
      const html = `<li class="a" data-id="${item.name}"><span class="category-name-filter">${item.name}</span></li>`;
      categoryContainer.insertAdjacentHTML("afterbegin", html);
    });
  }

  // PAGINAÇÃO DA LISTA DE PRODUCTOS
  _paginationAllProducts(productList) {
    this.productList = productList;
    this.productsPerPage = 6;
    this.currentPage = 1;
    this.totalPages = Math.ceil(productList.length / this.productsPerPage);
    this.renderCurrentPage(this.currentPage, productList);
    if (!this.currProductPage) return;
    this.currProductPage.textContent = this.currentPage;
  }

  // CONFIGURARA  PÁGINA A SER RENDERIZADA
  renderPage(page, list) {
    this.startIndex = (page - 1) * this.productsPerPage;
    this.endIndex = this.startIndex + this.productsPerPage;

    //LISTA  A SER RENDERIZADO
    this.productsToRender = list.slice(this.startIndex, this.endIndex);
    this._renderAllProducts(this.productsToRender);
  }
  renderCurrentPage(currentPage, list) {
    this.renderPage(currentPage, list);
  }

  // FUNÇÃO PARA IR NA PÁGINA ANTERIOR
  goToPreviousPage = function () {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderCurrentPage(this.currentPage, this.productList);
      console.log(this.productsToRender);
    }
    this.currProductPage.textContent = this.currentPage;
  };

  // FUNÇÃO PARA IR NA PÁGINA POSTERIOR
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderCurrentPage(this.currentPage, this.productList);
    }
    this.currProductPage.textContent = this.currentPage;
  }
}
const product = new ProductApp();
export { product };
