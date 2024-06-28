import { FORMAT_NUMBERS } from "../controller/features/formatting.js";
import { FIREBASE } from "../model/firebase.js";
class OrderView {
  constructor() {
    this.orderList = document.querySelector(".order-list");
    // this.orderList?.addEventListener(
    //   "click",
    //   this._settingOrderDetail.bind(this)
    // );
  }
  _renderOrderList(list) {
    if (!this.orderList) return;
    this.orderList.innerHTML = "";
    list.forEach((element) => {
      console.log(element);
      const html = `
      <div class="order-box" data-id="${element.id}">
     <span class="client-initial">${element.data.name[0]}</span>
     <div class="order-content-box">
         <div class="header-box">
             <span class="client-name">${element.data.name}</span>
             <span class="order-date">10/07/2024</span>
         </div>
         <div class="header-box">
             <span class="total-articles">Artigos <span>(${element.data.products.length})</span></span>

         </div>
         </div>
         </div>`;
      this.orderList.insertAdjacentHTML("afterbegin", html);
    });
  }
  _settingOrderDetail(data) {
    console.log(data);
    const name = document.querySelector(".cliente-name");
    const email = document.querySelector(".cliente-email");
    const phone = document.querySelector(".cliente-phone");
    const address = document.querySelector(".cliente-address");
    const totalProducts = document.querySelector(".total-product");
    name.textContent = data.name;
    email.textContent = data.email;
    phone.textContent = data.phone;
    address.textContent = data.address;
    totalProducts.textContent = data.products.length;
    this._renderOrdeProducts(data.products);
  }
  _renderOrdeProducts(list) {
    const productsContainer = document.querySelector(".order-products-list");
    productsContainer.innerHTML = "";
    list.forEach((data) => {
      FIREBASE.getProductById(data.id).then((d) => {
        const html = `
        <div class="order-product">
        <img src="${d.images[0]}" alt="${d.name}" class="order-product-img">
        <div class="order-product-content">
            <div><span class="product-name">${d.name}</span> <span
                    class="product-price">${FORMAT_NUMBERS.formatCurrency(
                      d.price
                    )}</span></div>
            <div>
                <span class="product-qty">Quantidade <span>(${
                  data.quantity
                })</span></span>
                <span class="total-amount-product">${FORMAT_NUMBERS.formatCurrency(
                  d.price * data.quantity
                )}</span>
            </div>
        </div>
     </div>
        `;
        productsContainer.insertAdjacentHTML("afterbegin", html);
      });
    });
  }
}
const order = new OrderView();
export { order };
