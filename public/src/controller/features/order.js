import { FIREBASE } from "../../model/firebase.js";
import { addToCart } from "./addToCart.js";
import { FORMAT_NUMBERS } from "./formatting.js";
class Order {
  cart = JSON.parse(localStorage.getItem("cartList"))
    ? JSON.parse(localStorage.getItem("cartList"))
    : [];
  total = 0;
  ARR = [2, 234, 34, 56, 56, 56, 5];
  constructor() {
    this.totalCartAmount = document.querySelector(".order-total-amount");
    this.orderProductList = document.querySelector(".order-product-list");
    this.btnFinalizeOrder = document.querySelector(".confirm-order");
    this.btnFinalizeOrder?.addEventListener(
      "click",
      this._sendOrder.bind(this)
    );
    this.cart.forEach((product) => {
      if (!this.orderProductList) return;
      this.orderProductList.innerHTML = "";
      FIREBASE.getProductById(product.id).then((data) => {
        if (!data) return;
        this._renderCartProducts(data, product.quantity);
        this.total += +data.price * product.quantity;
        this.totalCartAmount.textContent = FORMAT_NUMBERS.formatCurrency(
          this.total
        );
      });
    });
    this._loadingAllCart();
  }
  _loadingAllCart() {
    this.loadedCart = [];
    this.cart.forEach((product) => {
      FIREBASE.getProductById(product.id).then((data) => {
        const push = {
          data: data,
          quantity: product.quantity,
        };

        this.loadedCart.push(push);
      });
    });
  }
  _renderCartProducts(data, quantity) {
    if (!this.orderProductList) return;
    const html = `
          <div class="product">
          <span>${quantity}x ${data.name}</span>
          <span>${FORMAT_NUMBERS.formatCurrency(data.price * quantity)}</span>
         </div>
            `;
    this.orderProductList.insertAdjacentHTML("afterbegin", html);
  }
  _updateProductSales() {
    alert();
    this.cart.forEach((data) => {
      FIREBASE.incrementProductSell(data.id, data.quantity);
    });
  }
  _takingClientInformation() {
    const clientNameInput = document.querySelector(".full-name-order-input");
    const clientEmail = document.querySelector(".email-order-input");
    const clientPhone = document.querySelector(".phone-order-input");
    const clientCountry = document.querySelector(".country-order-input");
    const clientProvince = document.querySelector(".province-order-input");
    const clientAddress = document.querySelector(".address-order-input");
    const clientDesciption = document.querySelector(".order-description-input");

    const clientInformation = {
      name: clientNameInput.value,
      email: clientEmail.value,
      phone: clientPhone.value,
      country: clientCountry.value,
      province: clientProvince.value,
      clientAddress: clientAddress.value,
      description: clientDesciption.value,
    };
    return clientInformation;
  }
  _buildingString() {
    const userInfo = this._takingClientInformation();
    let string = `INFORMAÇÕES DO CLIENTE\n\nCliente: *${userInfo.name}*\nEmail: *${userInfo.email}*\nTelefone: *${userInfo.phone}*\nPaís: *${userInfo.name}*\nProvíncia:* ${userInfo.province}*\nResidência: *${userInfo.clientAddress}*\n\nINFORMAÇÕES DO PEDIDO\n\n`;
    this.loadedCart.forEach((product, i) => {
      string += `${(1 + i).toString().padStart(2, 0)}) ${product.quantity}X *${
        product.data.name
      }*\nPreço: *${product.data.price}*\n\n`;
    });
    return encodeURIComponent(string);
  }
  _sendingOrderToFirebase() {
    const order = {
      ...this._takingClientInformation(),
      products: this.cart,
    };
    console.log(order);
    FIREBASE.newOrder(order);
  }
  _sendingOrderToWhatsapp() {
    const whatsappUrl = `https://api.whatsapp.com/send?phone=+244940407979&text=${this._buildingString()}`;
    window.open(whatsappUrl, "_blank");
  }
  _removingCartToLocalStorage() {
    localStorage.removeItem("cartList");
  }
  _sendOrder() {
    const data = this._takingClientInformation();
    this._sendingOrderToWhatsapp();
    this._sendingOrderToFirebase();
    this._updateProductSales();
    this._removingCartToLocalStorage();
  }
}
const newOrder = new Order();

export { newOrder };
