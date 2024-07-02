feather.replace();
import { FIREBASE } from "../model/firebase.js";
import { view } from "../view/view.js";
import { addToCart } from "./features/addToCart.js";
import { admin } from "../view/admin.js";
import { CRUD } from "./admin/productCRUD.JS";
// import { newOrder } from "./features/order.js";
import { product } from "../view/product.js";
import { detail } from "../view/detail.js";
import { GET_URL_ID } from "./getUrlParamID.js";
import { rating } from "./features/rating.js";
import { newOrder } from "./features/order.js";
import { FORMAT_NUMBERS } from "./features/formatting.js";
import { SEARCH } from "./features/searchFilter.js";
import { mostSelled } from "./features/getMostSelled.js";
class Controller {
  currentQty = 1;

  constructor() {
    this.loginAdminFormContainer = document.querySelector(
      ".container-entry-admin"
    );
    this.btnShowAdminLogin = document.querySelector(".btn-show-admin-login");
    this.btnLoginAdmin = document.querySelector(".btn-login-admin");
    this.btnShowSearchContainer = document.querySelector(".search-input");
    this.containerSeacrh = document.querySelector(".main-search-container");
    this.allProductsContainer = document.querySelector(".main-product-list");
    this.cartContainer = document.querySelector(".cart-container");
    this.btnShowCart = document.querySelector(".cart-btn");
    this.btnToggleMenu = document.querySelector(".btn-toggle-menu");
    this.btnToggleMenu?.addEventListener("click", this._toggleMenu.bind(this));
    this.header = document.querySelector(".logo-heading");
    this.btnFinilizeOrder = document.querySelector(".btn-finilize-order");
    this.cartList = document.querySelector(".cart-list");
    this.btnShowSearchContainer?.addEventListener(
      "click",
      this._showSearchContainer.bind(this)
    );
    this.containerSeacrh?.addEventListener(
      "click",
      this._closeSearchContaine.bind(this)
    );
    this.cartList?.addEventListener("click", this._updateQuantity.bind(this));
    this.btnShowCart?.addEventListener(
      "click",
      this._showCartContainer.bind(this)
    );
    this.btnFinilizeOrder?.addEventListener(
      "click",
      this._redirectToCheckout.bind(this)
    );
    this.cartContainer?.addEventListener(
      "click",
      this._hideCartForm.bind(this)
    );
    this._obserserAddSticky();

    this.allProductsContainer?.addEventListener(
      "click",
      this._selectProductCart.bind(this)
    );
    this.btnShowAdminLogin?.addEventListener(
      "click",
      this._showLoginAdminForm.bind(this)
    );
    this.loginAdminFormContainer?.addEventListener(
      "click",
      this._closeLoginAdminForm.bind(this)
    );
    this.btnLoginAdmin?.addEventListener("click", this._loginAdmin.bind(this));
  }
  _showSearchContainer() {
    this.containerSeacrh.classList.remove("hidden");
  }
  _closeSearchContaine(e) {
    const target = e.target;
    if (target.closest(".overlay-search"))
      this.containerSeacrh.classList.add("hidden");
    if (target.closest(".btn-close-search"))
      this.containerSeacrh.classList.add("hidden");
  }
  _redirectToCheckout() {
    window.location.href = "./order.html";
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
  _formatCurrString(value) {
    const returned = value.includes("Kz")
      ? value.replace("Kz", "")
      : value.replace("AOA", "");
    return +returned.replace(/\s/g, "").replace(",", ".");
  }
  _upQuantity(e, id, total, price) {
    const previousElement = e.previousElementSibling;
    this.currentQty = +previousElement.textContent;
    this.currentQty++;
    previousElement.textContent = this.currentQty;

    total.textContent = FORMAT_NUMBERS.formatCurrency(
      this.currentQty * this._formatCurrString(price.textContent)
    );
    addToCart._addProduct(id, this.currentQty);
  }
  _downQuantity(e, id, total, price) {
    const nextElement = e.nextElementSibling;
    this.currentQty = +nextElement.textContent;
    this.currentQty > 1 ? this.currentQty-- : (this.currentQty = 1);
    nextElement.textContent = this.currentQty;

    total.textContent = FORMAT_NUMBERS.formatCurrency(
      this.currentQty * this._formatCurrString(price.textContent)
    );
    addToCart._addProduct(id, this.currentQty);
  }

  _showLoginAdminForm() {
    this.loginAdminFormContainer.classList.remove("hidden");
  }
  _closeLoginAdminForm(e) {
    const target = e.target;
    if (target.closest(".overlay-entry"))
      this.loginAdminFormContainer.classList.add("hidden");
    if (target.closest(".close-login-form"))
      this.loginAdminFormContainer.classList.add("hidden");
  }
  _loginAdmin(e) {
    e.preventDefault();
    const email = document.querySelector(".admin-email-input");
    const password = document.querySelector(".admin-password-input");
    FIREBASE.adminLogin(email.value, password.value);
  }
}

class LinkView {
  arrHelper = [];
  constructor() {
    this.categoryListContainer = document.querySelector(".category-list");
    this.categoryListContainer?.addEventListener(
      "click",
      this._toggleCategoryFilter.bind(this)
    );
    FIREBASE.getProducts().then((pt) => {
      this._gettingRecentProducts(pt);
      this._gettingAllProducts(pt);
      this._gettingMostSelledProducts(pt);
    });
    // this._gettingRelatedProduct();
    FIREBASE.getCategories().then((data) => {
      product._renderAllCategories(data);
    });
  }
  _gettingRecentProducts(list) {
    const sorted = list.sort((a, b) => b.data.date - a.data.date);
    const returned = sorted.splice(-6);
    view._renderRecentProduct(returned);
  }
  _gettingMostSelledProducts(list) {
    FIREBASE.getProducts().then((data) => {
      const returned = mostSelled._sortBySell(data);
      view._renderMostSelledProduct(returned);
      product._renderMostSelledProducts(returned);
    });
  }
  _gettingAllProducts(list) {
    FIREBASE.getProducts().then((data) => {
      const sort = data.sort((a, b) => a.data.sales - b.data.sales);
      const returned = data.splice(-8);
      product._paginationAllProducts(returned);
    });
  }
  _gettingRelatedProduct(category) {
    FIREBASE.getProducts().then((data) => {
      const sort = data.filter((data) => {
        return data.data.category === category;
      });
      const returned = data.splice(-8);
      detail._renderRelatedProduct(sort);
    });
  }

  _toggleCategoryFilter(e) {
    const target = e.target.closest("li");
    if (!target) return;
    target.classList.toggle("active-filter");
    const name = target.dataset.id;
    this._filterProductsByCategory(name, target);
  }
  _filterProductsByCategory(ctgr, trgt) {
    FIREBASE.getProducts().then((data) => {
      const filter = data.filter((i) => i.data.category === ctgr);
      if (trgt.classList.contains("active-filter"))
        this.arrHelper.push(...filter);
      if (!trgt.classList.contains("active-filter")) {
        filter.forEach((item, i) => {
          this.arrHelper.splice(i, 1);
        });
      }
      product._paginationAllProducts(this.arrHelper);
      product._renderMostSelledProducts(mostSelled._sortBySell(this.arrHelper));
    });
  }
}

const linkView = new LinkView();
const controller = new Controller();
export { linkView };
