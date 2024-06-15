import { endpoint } from "./data/endpoints.js";
class ProductApp {
  constructor() {
    this.mostSelledProducts = document.querySelector(".all-most-selled");
    this.allProductsContainer = document.querySelector(".product-grid-3-cl");
    endpoint.getProducts().then((data) => {
      this._renderMostSelledProducts(data);
      this._renderAllProducts(data);
      console.log(data);
    });
  }
  _renderAllProducts(list) {
    if (!this.allProductsContainer) return;
    this.allProductsContainer.innerHTML = "";
    list.forEach((item) => {
      const html = `
      <div class="new-product-box" data-id="${item.id}">
      <div class="img-box">
      <img src="${item.data.images[0]}" alt="">
  </div>
      <div class="new-product-content home-recent-product">
          <span class="category-name">${item.data.category}</span>
          <span class="product-name">${item.data.name}</span>
          <div class="product-price-div">
              <span class="current-product-price">${item.data.price}</span>
              <span class="last-product-price">$1290</span>
          </div>

          <div class="product-stars-div">
              <i data-feather="star"></i>
              <i data-feather="star"></i>
              <i data-feather="star"></i>
              <i data-feather="star"></i>
              <i data-feather="star"></i>
          </div>
          <div class="see-product-details">
              <a href="detail.html?id=${item.id}&category=${item.data.category}&name=${item.data.name}"> <i data-feather="eye"></i></a>

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
    });
  }
  _renderMostSelledProducts(list) {
    if (!this.mostSelledProducts) return;
    this.mostSelledProducts.innerHTML = "";
    list.forEach((item) => {
      const html = `
     
      <div class="top-sell-product-box">
      <a href="detail.html?id=${item.id}&category=${item.data.category}&name=${item.data.name}" class="most-selled-link"></a>
      <img src="${item.data.images[0]}" alt="" >
      <div class="top-sell-product-content">
          <span class="product-category">${item.data.category}</span>
          <span class="product-name">${item.data.name}</span>

          <div class="top-selling-price">
              <span class="top-selling-curr-price">${item.data.price}</span>
              <span class="top-selling-last-price">$4098,00</span>
          </div>
      </div>
  </div>
      
          `;
      this.mostSelledProducts.insertAdjacentHTML("afterbegin", html);
    });
  }
}
const product = new ProductApp();
export { product };
