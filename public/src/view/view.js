// import { admin } from "./admin.js";
// import { detail } from "./detail.js";
// import { product } from "./product.js";
import { FORMAT_NUMBERS } from "../controller/features/formatting.js";
import { RENDER_STAR } from "./renderStars.js";
feather.replace();

class MainView {
  constructor() {
    this.recentPRoductGrid = document.querySelector(".grid-4-columns");
    this.cartlistContainer = document.querySelector(".cart-list");
    document.addEventListener("DOMContentLoaded", () => feather.replace());
  }

  _renderRecentProduct(list) {
    if (!this.recentPRoductGrid) return;
    this.recentPRoductGrid.innerHTML = "";

    list.forEach((item) => {
      const stars = RENDER_STAR._renderStars(
        RENDER_STAR._gettingProductStars(item)
      );
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
                    1290
                  )}</span>
              </div>
    
              <div class="product-stars-div">
                 ${stars}
              </div>
              <div class="see-product-details">
                  <a href="detail.html?id=${
                    item.id
                  }"> <i data-feather="eye"></i></a>
    
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

      this.recentPRoductGrid.insertAdjacentHTML("beforeend", html);
      feather.replace();
    });
  }

  _renderMostSelledProduct(list) {
    const topSellingGri = document.querySelector(".top-selling-products-grid");
    if (!topSellingGri) return;
    topSellingGri.innerHTML = "";
    list.forEach((item) => {
      let star = "";

      const html = `
          <div class="top-sell-product-box ">
          <a href="detail.html?id=${item.id}" class="most-selled-link"></a>
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
      topSellingGri.insertAdjacentHTML("beforeend", html);
      feather.replace();
    });
  }

  _renderCartList(item, id, qty) {
    if (!item) return;
    const html = `
    <div class="product-cart" data-id="${id}"><img src="${
      item.images[0]
    }" alt="" class="product-img">
    <div class="product-cart-content">
        <div class="cart-flex"><span class="product-cart-name">${
          item.name
        }</span>
            <span class="product-cart-price">${FORMAT_NUMBERS.formatCurrency(
              item.price
            )}</span>
        </div>
        <div class="cart-flex">
            <div class="increase-quantity-box">
                <span class="decrease-quantity">-</span>
                <span class="quantity-label">${qty}</span>
                <span class="increase-quantity">+</span>
            </div>
            <span class="total-amount-product">${FORMAT_NUMBERS.formatCurrency(
              qty * item.price
            )}</span>
        </div>
    </div>
</div>
    `;
    this.cartlistContainer.insertAdjacentHTML("afterbegin", html);
  }
  _renderSearchResults(list, value) {
    const container = document.querySelector(".search-result-ontainer");

    container.innerHTML = "";
    if (!container) return;
    if (list.length < 1) {
      container.insertAdjacentHTML(
        "afterbegin",
        `<span class="no-result ">Sem resultado para "${value}"</span>`
      );
    }
    list.forEach((data) => {
      const stars = RENDER_STAR._renderStars(
        RENDER_STAR._gettingProductStars(data)
      );
      const html = ` <div class="product-search-box">
      <a href="detail.html?id=${data.id}"></a>
      <img src="${data.data.images[0]}" alt="" class="product-img">
      <div class="search-product-content">
          <div class="product-stars-search">${stars}</div>
          <span class="product-sr-name">${data.data.name}</span>
          <span class="product-sr-category">${data.data.category}</span>
      </div>
      <span class="see-detail"><i data-feather="chevron-right"></i></span>
      </div>`;
      container.insertAdjacentHTML("beforeend", html);
    });
    feather.replace();
  }
}
const view = new MainView();

export { view };
