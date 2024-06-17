import { admin } from "./admin.js";
import { detail } from "./detail.js";
import { endpoint } from "./data/endpoints.js";
import { addToCart } from "./features/addToCart.js";
import { product } from "./product.js";
feather.replace();

class mainApp {
  currentQty = 1;

  constructor() {
    this.allProductsContainer = document.querySelector(".main-product-list");
    this.cartContainer = document.querySelector(".cart-container");
    this.btnShowCart = document.querySelector(".cart-btn");
    this.btnToggleMenu = document.querySelector(".btn-toggle-menu");
    this.btnToggleMenu?.addEventListener("click", this._toggleMenu.bind(this));
    this.header = document.querySelector(".logo-heading");
    this.recentPRoductGrid = document.querySelector(".grid-4-columns");
    this.cartList = document.querySelector(".cart-list");
    this.cartList?.addEventListener("click", this._updateQuantity.bind(this));
    this.btnShowCart?.addEventListener(
      "click",
      this._showCartContainer.bind(this)
    );
    this.cartContainer?.addEventListener(
      "click",
      this._hideCartForm.bind(this)
    );
    this._obserserAddSticky();
    endpoint.getProducts().then((pt) => {
      this._renderRecentProduct(pt);
    });
    endpoint.getProducts().then((pt) => {
      this._renderMostSelledProduct(pt);
    });

    this.allProductsContainer?.addEventListener(
      "click",
      this._selectProductCart.bind(this)
    );
  }

  _showCartContainer() {
    this.cartContainer.classList.remove("hidden");
    this.currentQty = 1;
  }
  _hideCartForm(e) {
    const target = e.target;
    if (target.closest(".overlay-cart") || target.closest(".continue-add")) {
      this.cartContainer.classList.add("hidden");
    }
  }
  _toggleMenu() {
    const body = document.querySelector("body");
    body.classList.toggle("show-menu");
  }
  _obserserAddSticky() {
    const headerObserver = new IntersectionObserver(this._observerCallBack, {
      root: null,
      threshold: 0,
    });
    headerObserver.observe(this.header);
  }
  _observerCallBack(entries) {
    const body = document.querySelector("body");
    const [entry] = entries;
    if (!entry.isIntersecting) {
      body.classList.add("sticky");
    } else {
      body.classList.remove("sticky");
    }
  }
  _renderRecentProduct(list) {
    console.log(list);
    if (!this.recentPRoductGrid) return;
    this.recentPRoductGrid.innerHTML = "";
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
      this.recentPRoductGrid.insertAdjacentHTML("afterbegin", html);
    });
  }

  _renderMostSelledProduct(list) {
    const topSellingGri = document.querySelector(".top-selling-products-grid");
    if (!topSellingGri) return;
    topSellingGri.innerHTML = "";
    list.forEach((item) => {
      const html = `
      <div class="top-sell-product-box ">
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
      topSellingGri.insertAdjacentHTML("afterbegin", html);
    });
  }

  _selectProductCart(e) {
    const target = e.target;
    if (target.closest(".decrease-quantity"))
      this._decreaseQuantity(target.closest(".decrease-quantity"));
    if (target.closest(".increase-quantity"))
      this._increaseQuantity(target.closest(".increase-quantity"));
    if (target.closest(".add-to-cart"))
      this._addToCart(target.closest(".add-to-cart"));
  }
  _productQuantity() {}
  _decreaseQuantity(e) {
    this.currentQty === 1 ? (this.currentQty = 1) : this.currentQty--;
    // e.nextElementSibling.textContent = this.currentQty;
    const nextElement = e.nextElementSibling;
    nextElement.textContent = this.currentQty;
  }
  _increaseQuantity(e) {
    this.currentQty++;
    const previousElement = e.previousElementSibling;
    // e.previoustElementSibling.textContent = this.currentQty;
    previousElement.textContent = this.currentQty;
  }
  _addToCart(e) {
    const box = e.closest(".add-product-to-cart-div");
    const productID = box.parentElement.dataset.id;
    addToCart._addProduct(productID, this.currentQty);
    this.currentQty = 1;
    addToCart._settingTotalProduct();
    addToCart._getCartFromFireBase();
  }

  _updateQuantity(e) {
    const target = e.target;
    const parent = target.closest(".product-cart");
    const id = parent.dataset.id;
    const totalLabel = parent.querySelector(".total-amount-product");
    const price = parent.querySelector(".product-cart-price");
    console.log(totalLabel);
    if (target.closest(".decrease-quantity"))
      this._downQuantity(
        target.closest(".decrease-quantity"),
        id,
        totalLabel,
        price
      );
    if (target.closest(".increase-quantity"))
      this._upQuantity(
        target.closest(".increase-quantity"),
        id,
        totalLabel,
        price
      );
  }

  _upQuantity(e, id, total, price) {
    const previousElement = e.previousElementSibling;
    this.currentQty = +previousElement.textContent;
    this.currentQty++;
    previousElement.textContent = this.currentQty;

    total.textContent = this.currentQty * +price.textContent;
    addToCart._addProduct(id, this.currentQty);
  }
  _downQuantity(e, id, total, price) {
    const nextElement = e.nextElementSibling;
    this.currentQty = +nextElement.textContent;
    this.currentQty > 1 ? this.currentQty-- : (this.currentQty = 1);
    nextElement.textContent = this.currentQty;
    total.textContent = this.currentQty * +price;
    addToCart._addProduct(id, this.currentQty);
  }
}
const app = new mainApp();
