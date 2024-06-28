import { FORMAT_NUMBERS } from "../controller/features/formatting.js";
class DetailApp {
  constructor() {
    this.commentContainer = document.querySelector(".product-comment-list");
    this.relatedProductContainer = document.querySelector(
      ".related-product-grid"
    );
    this.detailsImgs = document.querySelectorAll(".product-slide-img");
    this.next = document.querySelector(".prev");
    this.prev = document.querySelector(".next");
    this.currSlide = 0;
    this._goSLide(0);
    this.maxSlide = this.detailsImgs.length - 1;
    this.next?.addEventListener("click", this.nextSlide.bind(this));
    this.prev?.addEventListener("click", this.prevSlide.bind(this));

    //paginação
    this.nextCom = document.querySelector(".btn-next-comm");
    this.prevCom = document.querySelector(".btn-prev-comm");
    this.currentCommPagesL = document.querySelector(".current-comment-page");

    this.nextCom?.addEventListener("click", this.goToNextPage.bind(this));
    this.prevCom?.addEventListener("click", this.goToPreviousPage.bind(this));
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
  _renderRelatedProduct(list) {
    if (!this.relatedProductContainer) return;
    this.relatedProductContainer.innerHTML = "";
    list.forEach((item) => {
      const star = this._renderStars(this._gettingProductStars(item));
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
           ${star}
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
      this.relatedProductContainer.insertAdjacentHTML("beforeend", html);
      feather.replace();
    });
  }

  // PAGINAÇÃO DA LISTA DE PRODUCTOS
  _paginationComments(productList) {
    this.productList = productList;
    this.productsPerPage = 3;
    this.currentPage = 1;
    this.totalPages = Math.ceil(productList.length / this.productsPerPage);
    this.renderCurrentPage(this.currentPage, productList);
    this.currentCommPagesL.textContent = this.currentPage;
  }

  // CONFIGURARA  PÁGINA A SER RENDERIZADA
  renderPage(page, list) {
    this.startIndex = (page - 1) * this.productsPerPage;
    this.endIndex = this.startIndex + this.productsPerPage;

    //LISTA  A SER RENDERIZADO
    this.commentToRender = list.slice(this.startIndex, this.endIndex);
    this._renderProductComments(this.commentToRender);
    // this._renderProductList(this.productsToRender);
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
    this.currentCommPagesL.textContent = this.currentPage;
  };

  // FUNÇÃO PARA IR NA PÁGINA POSTERIOR
  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.renderCurrentPage(this.currentPage, this.productList);
    }
    this.currentCommPagesL.textContent = this.currentPage;
  }
}

const detail = new DetailApp();
export { detail };
