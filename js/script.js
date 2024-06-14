import { admin } from "./admin.js";
import { detail } from "./detail.js";
import { endpoint } from "./data/endpoints.js";
feather.replace();

class mainApp {
  constructor() {
    this.btnToggleMenu = document.querySelector(".btn-toggle-menu");
    this.btnToggleMenu?.addEventListener("click", this._toggleMenu.bind(this));
    this.header = document.querySelector(".logo-heading");
    this.recentPRoductGrid = document.querySelector(".grid-4-columns");

    console.log(this.header);
    this._obserserAddSticky();
    endpoint.getProducts().then((pt) => {
      this._renderRecentProduct(pt);
    });
    endpoint.getProducts().then((pt) => {
      this._renderMostSelledProduct(pt);
    });
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
      <img src="${item.data.images[0]}" alt="">
      <div class="new-product-content">
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
              <a href=""> <i data-feather="star"></i></a>
              <a href="detail.html?id=${item.id}&category=${item.data.category}&name=${item.data.name}"> <i data-feather="eye"></i></a>

          </div>

      </div>
      <div class="add-product-to-cart-div">

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
      <div class="top-sell-product-box">
      <img src="${item.data.images[0]}" alt="">
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
}
const app = new mainApp();

// const detailsImgs = document.querySelectorAll(".product-slide-img");
// const next = document.querySelector(".prev");
// const prev = document.querySelector(".next");
// let currSlide = 0;

// const goSLide = function (slide) {
//   detailsImgs.forEach((d, i) => {
//     console.log(d);
//     d.style.transform = `translateY(${100 * (i - slide)}%)`;
//   });
// };

// goSLide(0);
// const maxSlide = detailsImgs.length - 1;

// const nextSlide = function () {
//   currSlide === maxSlide ? (currSlide = 0) : currSlide++;
//   goSLide(currSlide);
// };

// const prevSlide = function () {
//   currSlide === 0 ? (currSlide = maxSlide) : currSlide--;
//   goSLide(currSlide);

//   //   alert("");
// };

// next?.addEventListener("click", nextSlide);
// prev?.addEventListener("click", prevSlide);
