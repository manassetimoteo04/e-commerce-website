// import { admin } from "./admin.js";
// import { detail } from "./detail.js";
// import { product } from "./product.js";
import { FORMAT_NUMBERS } from "../controller/features/formatting.js";
feather.replace();

class MainView {
  constructor() {
    this.recentPRoductGrid = document.querySelector(".grid-4-columns");
    this.cartlistContainer = document.querySelector(".cart-list");
    document.addEventListener("DOMContentLoaded", () => feather.replace());
  }
  _gettingProductStars(data) {
    const star_5 = data.data.comments
      .filter((rate) => rate.rating === 5)
      .reduce((acc, arr) => acc + 1, 0);
    const star_4 = data.data.comments
      .filter((rate) => rate.rating === 4)
      .reduce((acc, arr) => acc + 1, 0);
    const star_3 = data.data.comments
      .filter((rate) => rate.rating === 3)
      .reduce((acc, arr) => acc + 1, 0);
    const star_2 = data.data.comments
      .filter((rate) => rate.rating === 2)
      .reduce((acc, arr) => acc + 1, 0);

    const star_1 = data.data.comments
      .filter((rate) => rate.rating === 1)
      .reduce((acc, arr) => acc + 1, 0);
    const totalRating = star_1 + star_2 + star_3 + star_4 + star_5;
    console.log(totalRating);
    const returned = {
      star_1: { rate: star_1, stars: 1 },
      star_2: { rate: star_2, stars: 2 },
      star_3: { rate: star_3, stars: 3 },
      star_4: { rate: star_4, stars: 4 },
      star_5: { rate: star_5, stars: 5 },
      totalRating: totalRating,
    };

    let maxRate = -Infinity;
    let acc = 0;
    for (const key in returned) {
      if (key !== "totalRating" && returned[key].rate > maxRate) {
        maxRate = returned[key].rate;
        acc = returned[key].stars;
      }
    }

    return acc;
  }
  _renderStars(s) {
    let star = "";
    for (let i = 1; i <= s; i++) {
      star += '<i data-feather="star"></i> ';
    }
    return star;
  }
  _renderRecentProduct(list) {
    if (!this.recentPRoductGrid) return;
    this.recentPRoductGrid.innerHTML = "";

    list.forEach((item) => {
      const stars = this._renderStars(this._gettingProductStars(item));
      const html = `
          <div class="new-product-box" data-id="${item.id}">
          <div class="img-box">
          <img src="${item.data.images[0]}" alt="">
      </div>
          <div class="new-product-content home-recent-product">
              <span class="category-name">${item.data.category}</span>
              <span class="product-name">${item.data.name}</span>
              <div class="product-price-div">
                  <span class="current-product-price">${FORMAT_NUMBERS.formatCurrency(
                    item.data.price
                  )}</span>
                  <span class="last-product-price">${FORMAT_NUMBERS.formatCurrency(
                    1290
                  )}</span>
              </div>
    
              <div class="product-stars-div">
                 ${stars}
              </div>
              <div class="see-product-details">
                  <a href="detail.html?id=${item.id}&category=${
        item.data.category
      }&name=${item.data.name}"> <i data-feather="eye"></i></a>
    
              </div>
    
          </div>
          <div class="add-product-to-cart-div">
          <div class="increase-quantity-box">
          <span class="decrease-quantity"><i data-feather="minus"></i></span>
          <span class="quantity-label">1</span>
          <span class="increase-quantity"><i data-feather="plus"></i></span>
      </div>
              <button class="add-to-cart">Adicionar<i data-feather="shopping-cart"></i></button>
          </div>
      </div>
            `;

      this.recentPRoductGrid.insertAdjacentHTML("beforeend", html);
      feather.replace();
    });
  }

  _renderMostSelledProduct(list) {
    const topSellingGri = document.querySelector(".top-selling-products-grid");
    if (!topSellingGri) return;
    topSellingGri.innerHTML = "";
    list.forEach((item) => {
      let star = "";

      const html = `
          <div class="top-sell-product-box ">
          <a href="detail.html?id=${item.id}&category=${item.data.category}&name=${item.data.name}" class="most-selled-link"></a>
          <img src="${item.data.images[0]}" alt="" >
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
      topSellingGri.insertAdjacentHTML("beforeend", html);
      feather.replace();
    });
  }

  _renderCartList(item, id, qty) {
    console.log(item);

    if (!item) return;
    const html = `
    <div class="product-cart" data-id="${id}"><img src="${
      item.images[0]
    }" alt="" class="product-img">
    <div class="product-cart-content">
        <div class="cart-flex"><span class="product-cart-name">${
          item.name
        }</span>
            <span class="product-cart-price">${FORMAT_NUMBERS.formatCurrency(
              item.price
            )}</span>
        </div>
        <div class="cart-flex">
            <div class="increase-quantity-box">
                <span class="decrease-quantity">-</span>
                <span class="quantity-label">${qty}</span>
                <span class="increase-quantity">+</span>
            </div>
            <span class="total-amount-product">${FORMAT_NUMBERS.formatCurrency(
              qty * item.price
            )}</span>
        </div>
    </div>
</div>
    `;
    this.cartlistContainer.insertAdjacentHTML("afterbegin", html);
  }
}
const view = new MainView();

export { view };
