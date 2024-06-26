import { FORMAT_NUMBERS } from "../controller/features/formatting.js";

class adminClass {
  constructor() {
    this.next = document.querySelector(".btn-next-product-img");
    this.previous = document.querySelector(".btn-prev-product-img");
    this.imgsSlide = document.querySelectorAll(".admin-slide-img");
    this.currSlide = 0;
    this.maxSlide = this.imgsSlide.length - 1;
    this._goToSlide(0);
    this.next?.addEventListener("click", this._nextSlide.bind(this));
    this.previous?.addEventListener("click", this._prevSlide.bind(this));
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
        <button class="copy-product"><ion-icon name="copy-outline"></ion-icon></button>
        <button class="see-product"><ion-icon name="eye-outline"></ion-icon></i></button>
        <button class="delete-product"><ion-icon name="trash-outline"></ion-icon></button>
    </div>
    </div>
    `;
      producList.insertAdjacentHTML("afterbegin", html);
    });
  }
}

const admin = new adminClass();
export { admin };
