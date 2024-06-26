import { FIREBASE } from "../../model/firebase.js";
import { view } from "../../view/view.js";
import { FORMAT_NUMBERS } from "./formatting.js";
feather.replace();

class Cart {
  constructor() {
    this.cartlistContainer = document.querySelector(".cart-list");
    this.cartArray = JSON.parse(localStorage.getItem("cartList"))
      ? JSON.parse(localStorage.getItem("cartList"))
      : [];
    this.totalCartItem = document.querySelector(".total-product-cart");
    // this._getToLocalStorage();
    this._getCartFromFireBase();
    this._settingTotalProduct();
    this._detailAddToCart();
  }
  _settingTotalProduct() {
    if (!this.totalCartItem) return;
    this.totalCartItem.textContent = this.cartArray.length;
    this.cartArray.length > 0
      ? (this.totalCartItem.style.opacity = "1")
      : (this.totalCartItem.style.opacity = "0");
  }
  _addProduct(productID, quantity) {
    const product = {
      id: productID,
      quantity: quantity,
    };
    const checker = this.cartArray.some((item) => item.id === productID);
    if (checker) {
      const id = this.cartArray.findIndex((p) => p.id === productID);
      this.cartArray[0].quantity = quantity;
    } else {
      this.cartArray.push(product);
    }
    console.log(this.cartArray);
    this._setToLocalStorage();
  }
  _setToLocalStorage() {
    localStorage.setItem("cartList", JSON.stringify(this.cartArray));
  }

  _getCartFromFireBase() {
    if (!this.cartlistContainer) return;
    this.cartlistContainer.innerHTML = "";
    this.cartArray.forEach((element) => {
      FIREBASE.getProductById(element.id).then((data) => {
        view._renderCartList(data, element.id, element.quantity);
      });
    });
  }
  _detailAddToCart() {
    this.inputQty = document.querySelector(".add-product-to-cart input");
    this.totalLabelAm = document.querySelector(".total-amount");
    const btnAddToCart = document.querySelector(".add-product-to-cart-btn");
    this.inputQty?.addEventListener("input", this._totalAmount.bind(this));
    btnAddToCart?.addEventListener("click", this._confirmAddCart.bind(this));
  }
  _totalAmount() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    FIREBASE.getProductById(id).then((data) => {
      this.totalLabelAm.textContent = FORMAT_NUMBERS.formatCurrency(
        this.inputQty.value * data.price
      );
    });
  }
  _confirmAddCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    this._addProduct(id, this.inputQty.value);
    alert();
  }
}

const addToCart = new Cart();

export { addToCart };
