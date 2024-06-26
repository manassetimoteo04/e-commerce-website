import { FORMAT_NUMBERS } from "../controller/features/formatting.js";
class DetailApp {
  constructor() {
    this.commentContainer = document.querySelector(".product-comment-list");
    this.detailsImgs = document.querySelectorAll(".product-slide-img");
    this.next = document.querySelector(".prev");
    this.prev = document.querySelector(".next");
    this.currSlide = 0;
    this._goSLide(0);
    this.maxSlide = this.detailsImgs.length - 1;
    this.next?.addEventListener("click", this.nextSlide.bind(this));
    this.prev?.addEventListener("click", this.prevSlide.bind(this));
  }
  _goSLide(slide) {
    this.detailsImgs.forEach((d, i) => {
      d.style.transform = `translateY(${100 * (i - slide)}%)`;
    });
  }
  nextSlide() {
    this.currSlide === this.maxSlide ? (this.currSlide = 0) : this.currSlide++;
    this._goSLide(this.currSlide);
  }

  prevSlide() {
    this.currSlide === 0 ? (this.currSlide = this.maxSlide) : this.currSlide--;
    this._goSLide(this.currSlide);

    //   alert("");
  }

  _settingCurrentProductDetail(data) {
    const allImages = document.querySelectorAll(".product-slide-img");
    const productName = document.querySelector(".product-name-detail");
    const productPrice = document.querySelector(".product-curr-price");
    const productLastPrice = document.querySelector(".product-last-price");
    const productDescription = document.querySelector(
      ".product-description-detail"
    );
    const productCategory = document.querySelector(".product-category-detail");
    if (!productName) return;
    allImages.forEach((img, i) => (img.src = data.images[i]));
    productName.textContent = data.name;
    productPrice.textContent = FORMAT_NUMBERS.formatCurrency(data.price);
    productLastPrice.textContent = FORMAT_NUMBERS.formatCurrency(4353);
    productDescription.textContent = data.description;
    productCategory.textContent = data.category;
  }
  _renderProductComments(list) {
    if (!this.commentContainer) return;
    this.commentContainer.innerHTML = "";
    console.log(list);
    list.forEach((element) => {
      let star = "";
      for (let i = 1; i <= element.rating; i++) {
        star += '<i data-feather="star"></i> ';
      }
      const html = `
      <div class="comment-box">
      <div>
          <span class="user-name">${element.name?.split(" ")[0]}</span>
          <span class="commented-date">${FORMAT_NUMBERS.formatDates(
            new Date(element.date)
          )}</span>
          <div class="user-rate">
              ${star}
          </div>
      </div>
      <p class="comment-text">${element.description}</p>
      </div>
        `;
      this.commentContainer.insertAdjacentHTML("afterbegin", html);
      feather.replace();
    });
  }
  _renderRelatedProduct() {
    const html = `
    <div class="new-product-box" data-id="${item.id}">
    <div class="img-box">
    <img src="${item.data.images[0]}" alt="">
</div>
    <div class="new-product-content home-recent-product">
        <span class="category-name">${item.data.category}</span>
        <span class="product-name">${FORMAT_NUMBERS.formatDates(
          new Date(item.data.date)
        )}</span>
        <div class="product-price-div">
            <span class="current-product-price">${FORMAT_NUMBERS.formatCurrency(
              item.data.price
            )}</span>
            <span class="last-product-price">${FORMAT_NUMBERS.formatCurrency(
              45690
            )}</span>
        </div>

        <div class="product-stars-div">
            <i data-feather="star"></i>
            <i data-feather="star"></i>
            <i data-feather="star"></i>
            <i data-feather="star"></i>
            <i data-feather="star"></i>
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
  }
}

const detail = new DetailApp();
export { detail };
