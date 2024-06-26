class OrderView {
  constructor() {
    this.orderList = document.querySelector(".order-list");
    this.orderList?.addEventListener(
      "click",
      this._settingOrderDetail.bind(this)
    );
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
    const totalProducts = document.querySelector("total-product");
    name.textContent = data.name;
    email.textContent = data.email;
    phone.textContent = data.phone;
    address.textContent = data.address;
    totalProducts.textContent = data.products.length;
    this._renderOrdeProducts(data.products);
  }
  _renderOrdeProducts(list) {
    const productsContainer = document.querySelector(".order-products-list");
    list.forEach((data) => {});
  }
}
const order = new OrderView();
export { order };
