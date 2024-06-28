import { FORMAT_NUMBERS } from "../controller/features/formatting.js";
import { FIREBASE } from "../model/firebase.js";
import { order } from "./orderView.js";

class adminClass {
  constructor() {
    this.btnShowCategoryForm = document.querySelector(".create-category");
    this.categoryFormContainer = document.querySelector(
      ".create-category-container "
    );
    this.btnCreateCategory = document.querySelector(".btn-create-category");
    this.orderList = document.querySelector(".order-list");
    this.btnShowCategoryForm?.addEventListener(
      "click",
      this._showCategoryForm.bind(this)
    );
    this.categoryFormContainer?.addEventListener(
      "click",
      this._closeCategoryForm.bind(this)
    );
    this.btnCreateCategory?.addEventListener(
      "click",
      this._sendCategoryToDatabase.bind(this)
    );
    this.next = document.querySelector(".btn-next-product-img");
    this.previous = document.querySelector(".btn-prev-product-img");
    this.imgsSlide = document.querySelectorAll(".admin-slide-img");
    this.currSlide = 0;
    this.maxSlide = this.imgsSlide.length - 1;
    this._goToSlide(0);
    this.next?.addEventListener("click", this._nextSlide.bind(this));
    this.previous?.addEventListener("click", this._prevSlide.bind(this));
    this.orderList?.addEventListener("click", this._getOrderID.bind(this));
    //PAGINAÇÃO
    this.btnPrevAdmin = document.querySelector(".btn-prev-admin");
    this.btnNextAdmin = document.querySelector(".btn-next-admin");
    this.adminCurrPage = document.querySelector(".current-page");

    this.btnPrevAdmin?.addEventListener(
      "click",
      this.goToPreviousPage.bind(this)
    );
    this.btnNextAdmin?.addEventListener("click", this.goToNextPage.bind(this));
    this._gettingOrder();
    this._backToOrderList();
  }
  _showCategoryForm() {
    this.categoryFormContainer.classList.remove("hidden");
  }
  _closeCategoryForm(e) {
    const target = e.target;
    const input = document.querySelector(".category-input-create");
    if (target.closest(".overlay-category")) {
      this.categoryFormContainer.classList.add("hidden");
      input.value = "";
    }
    if (target.closest(".btn-close-category-form")) {
      this.categoryFormContainer.classList.add("hidden");
      input.value = "";
    }
  }
  _sendCategoryToDatabase(e) {
    e.preventDefault();
    const input = document.querySelector(".category-input-create");
    if (input.value) {
      FIREBASE.newCategory(input.value);
      this.categoryFormContainer.classList.add("hidden");
      FIREBASE.getCategories().then((data) => {
        console.log(data);
      });
    } else alert("Preencha o campo");
  }
  _goToSlide = function (slide) {
    this.imgsSlide.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  _nextSlide() {
    this.currSlide === this.maxSlide ? (this.currSlide = 0) : this.currSlide++;
    this._goToSlide(this.currSlide);
  }

  _prevSlide() {
    this.currSlide === 0 ? (this.currSlide = this.maxSlide) : this.currSlide--;
    this._goToSlide(this.currSlide);
    //   alert("");
  }

  _renderAdminProduct(list) {
    const producList = document.querySelector(".admin-grid");
    if (!producList) return;
    console.log(list);
    producList.innerHTML = "";
    list.forEach((item) => {
      console.log(item.data);
      const html = `
    <div class="product-box-admin" data-id="${item.id}">
    <img src="${item.data.images[0]}" alt="">
    <div class="product-admin-content">
        <span class="product-admin-name">${item.data.name}</span>
        <span class="product-admin-price">${FORMAT_NUMBERS.formatCurrency(
          item.data.price
        )}</span>
    </div>
    <div class="admin-product-action">
        <button class="edit-product"><ion-icon name="create-outline"></ion-icon></button>
        <button class="copy-link"><ion-icon name="copy-outline"></ion-icon></button>
        <button class="see-product"><ion-icon name="eye-outline"></ion-icon></i></button>
        <button class="delete-product"><ion-icon name="trash-outline"></ion-icon></button>
    </div>
    </div>
    `;
      producList.insertAdjacentHTML("afterbegin", html);
    });
  }

  // PAGINAÇÃO DA LISTA DE PRODUCTOS
  _paginationAdmin(productList) {
    this.productList = productList;
    this.productsPerPage = 8;
    this.currentPage = 1;
    this.totalPages = Math.ceil(productList.length / this.productsPerPage);
    this.renderCurrentPage(this.currentPage, productList);
    if (!this.adminCurrPage) return;
    this.adminCurrPage.textContent = this.currentPage;
  }

  // CONFIGURARA  PÁGINA A SER RENDERIZADA
  renderPage(page, list) {
    this.startIndex = (page - 1) * this.productsPerPage;
    this.endIndex = this.startIndex + this.productsPerPage;

    //LISTA  A SER RENDERIZADO
    this.productsToRender = list.slice(this.startIndex, this.endIndex);
    this._renderAdminProduct(this.productsToRender);
  }
  renderCurrentPage(currentPage, list) {
    this.renderPage(currentPage, list);
  }

  // FUNÇÃO PARA IR NA PÁGINA ANTERIOR
  goToPreviousPage = function () {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderCurrentPage(this.currentPage, this.productList);
      console.log(this.productsToRender);
    }
    this.adminCurrPage.textContent = this.currentPage;
  };

  // FUNÇÃO PARA IR NA PÁGINA POSTERIOR
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderCurrentPage(this.currentPage, this.productList);
    }
    this.adminCurrPage.textContent = this.currentPage;
  }

  _gettingOrder() {
    FIREBASE.getOrders().then((list) => {
      order._renderOrderList(list);
    });
  }
  _getOrderID(e) {
    const orderDetail = document.querySelector(".order-detail-box");
    const orderBox = document.querySelector(".order-list-box");
    const target = e.target.closest(".order-box");
    if (!target) return;
    orderBox.classList.toggle("mobile-hidden");
    orderDetail.classList.toggle("mobile-hidden");
    const id = target.dataset.id;
    FIREBASE.getOrderById(id).then((data) => {
      order._settingOrderDetail(data);
    });
  }
  _backToOrderList() {
    const orderDetail = document.querySelector(".order-detail-box");
    const orderBox = document.querySelector(".order-list-box");
    const btnBack = document.querySelector(".back-to-list-order");
    btnBack?.addEventListener("click", () => {
      orderBox.classList.toggle("mobile-hidden");
      orderDetail.classList.toggle("mobile-hidden");
    });
  }
}

const admin = new adminClass();
export { admin };
