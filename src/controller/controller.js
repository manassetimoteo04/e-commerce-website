feather.replace();
import { FIREBASE } from "../model/firebase.js";
import { view } from "../view/view.js";
import { addToCart } from "./features/addToCart.js";
import { admin } from "../view/admin.js";
import { CRUD } from "./admin/productCRUD.JS";
import { newOrder } from "./features/order.js";
import { product } from "../view/product.js";
import { detail } from "../view/detail.js";
import { GET_URL_ID } from "./getUrlParamID.js";
import { rating } from "./features/rating.js";
class Controller {
  currentQty = 1;

  constructor() {
    this.allProductsContainer = document.querySelector(".main-product-list");
    this.cartContainer = document.querySelector(".cart-container");
    this.btnShowCart = document.querySelector(".cart-btn");
    this.btnToggleMenu = document.querySelector(".btn-toggle-menu");
    this.btnToggleMenu?.addEventListener("click", this._toggleMenu.bind(this));
    this.header = document.querySelector(".logo-heading");

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
    total.textContent = this.currentQty * +price.textContent;
    addToCart._addProduct(id, this.currentQty);
  }
}

class LinkView {
  constructor() {
    FIREBASE.getProducts().then((pt) => {
      this._gettingRecentProducts(pt);
      this._gettingAllProducts(pt);
      console.log(pt);
      this._gettingMostSelledProducts(pt);
    });
    this._gettingRelatedProduct();
  }
  _gettingRecentProducts(list) {
    const sorted = list.sort((a, b) => b.data.date - a.data.date);
    const returned = sorted.splice(-6);
    view._renderRecentProduct(returned);
    console.log(returned);
  }
  _gettingMostSelledProducts(list) {
    FIREBASE.getProducts().then((data) => {
      console.log(data);
      const sort = data.sort((a, b) => a.data.sales - b.data.sales);
      const returned = data.splice(-8);
      view._renderMostSelledProduct(returned);
      product._renderMostSelledProducts(returned);
    });
  }
  _gettingAllProducts(list) {
    FIREBASE.getProducts().then((data) => {
      console.log(data);
      const sort = data.sort((a, b) => a.data.sales - b.data.sales);
      const returned = data.splice(-8);
      product._renderAllProducts(returned);
    });
  }
  _gettingRelatedProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    FIREBASE.getProducts().then((data) => {
      console.log(data);
      const sort = data.filter((data) => {
        console.log(data, category);
        return data.data.category === category;
      });
      console.log(sort);
      const returned = data.splice(-8);
      detail._renderRelatedProduct(sort);
    });
  }
}

const linkView = new LinkView();
const controller = new Controller();
const events = [
  { id: 1, name: "Event 1", date: "2023-06-25T14:30:00Z" },
  { id: 2, name: "Event 2", date: "2023-06-24T09:00:00Z" },
  { id: 3, name: "Event 3", date: "2023-06-25T16:00:00Z" },
];
