import { endpoint } from "./data/endpoints.js";
class DetailApp {
  constructor() {
    this.detailsImgs = document.querySelectorAll(".product-slide-img");
    this.next = document.querySelector(".prev");
    this.prev = document.querySelector(".next");
    this.currSlide = 0;

    this._goSLide(0);
    this.maxSlide = this.detailsImgs.length - 1;

    this.next?.addEventListener("click", this.nextSlide.bind(this));
    this.prev?.addEventListener("click", this.prevSlide.bind(this));
    this._gettingCurrentProductID();
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
  _gettingCurrentProductID() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) return;
    endpoint.getProductById(id).then((data) => {
      document.title = `${data.name} - Derby commercy`;
      console.log(data);
      this._settingCurrentProductDetail(data);
    });
  }
  _settingCurrentProductDetail(data) {
    const allImages = document.querySelectorAll(".product-slide-img");
    const productName = document.querySelector(".product-name-detail");
    const productPrice = document.querySelector(".product-curr-price");
    const productDescription = document.querySelector(
      ".product-description-detail"
    );
    const productCategory = document.querySelector(".product-category-detail");
    if (!productName) return;
    allImages.forEach((img, i) => (img.src = data.images[i]));
    productName.textContent = data.name;
    productPrice.textContent = data.price;
    productDescription.textContent = data.description;
    productCategory.textContent = data.category;
  }
}

const detail = new DetailApp();
export { detail };
