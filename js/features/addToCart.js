import { endpoint } from "../data/endpoints.js";
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
      endpoint.getProductById(element.id).then((data) => {
        this._renderCartList(data, element.id, element.quantity);
      });
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
            <span class="product-cart-price">${item.price}</span>
        </div>
        <div class="cart-flex">
            <div class="increase-quantity-box">
                <span class="decrease-quantity">-</span>
                <span class="quantity-label">${qty}</span>
                <span class="increase-quantity">+</span>
            </div>
            <span class="total-amount-product">${qty * item.price}</span>
        </div>
    </div>
</div>
    `;
    this.cartlistContainer.insertAdjacentHTML("afterbegin", html);
  }
}

const addToCart = new Cart();

export { addToCart };
