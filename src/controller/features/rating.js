const c = console.log.bind(document);
import { FORMAT_NUMBERS as format } from "./formatting.js";
import { detail } from "../../view/detail.js";
import { FIREBASE } from "../../model/firebase.js";
import { product } from "../../view/product.js";
class Rating {
  #COMMENTS = [];
  constructor() {
    this.btnSendComment = document.querySelector(".btn-send-comment");

    this.ratingBtn = document.querySelector(".select-rating");
    this.btnSendComment?.addEventListener(
      "click",
      this._takingCommentContent.bind(this)
    );

    this.ratingBtn?.addEventListener("click", this._ratingSystem.bind(this));
    this._gettingProductComment();
    this._settingTotalRating();
  }
  _gettURLProductID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }
  _ratingSystem(e) {
    e.preventDefault();
    const target = e?.target?.closest("svg");
    c();
    if (!target) return;
    const buttons = document.querySelectorAll(".select-rating svg");
    const arr = [...target.parentNode.children];
    const index = arr.indexOf(target);
    c(arr);
    arr.forEach((s) => (s.style.fill = "none"));
    for (let i = 0; i <= index; i++) {
      arr[i].style.fill = "#000";
    }
    this.currentRate = index + 1;
  }
  _takingCommentContent(e) {
    e.preventDefault();
    const commentName = document.querySelector(".input-comment-name");
    const commentEmail = document.querySelector(".input-comment-email");
    const commentDescription = document.querySelector(".input-comment");
    const userComment = {
      name: commentName.value,
      email: commentEmail.value,
      description: commentDescription.value,
      date: new Date().toISOString(),
      rating: this.currentRate,
    };
    this.#COMMENTS.push(userComment);
    c(this.#COMMENTS);

    FIREBASE._addProductComment(userComment, this._gettURLProductID());
    this._gettingProductComment();
  }
  _settingTotalRating() {
    if (!this._gettURLProductID()) return;
    FIREBASE.getProductById(this._gettURLProductID()).then((data) => {
      const star_5 = data.comments
        .filter((rate) => rate.rating === 5)
        .reduce((acc, arr) => acc + 1, 0);
      const star_4 = data.comments
        .filter((rate) => rate.rating === 4)
        .reduce((acc, arr) => acc + 1, 0);
      const star_3 = data.comments
        .filter((rate) => rate.rating === 3)
        .reduce((acc, arr) => acc + 1, 0);
      const star_2 = data.comments
        .filter((rate) => rate.rating === 2)
        .reduce((acc, arr) => acc + 1, 0);

      const star_1 = data.comments
        .filter((rate) => rate.rating === 1)
        .reduce((acc, arr) => acc + 1, 0);
      const totalRating = star_1 + star_2 + star_3 + star_4 + star_5;
      console.log(totalRating);
      this.returned = {
        star_1: { rate: star_1, stars: 1 },
        star_2: { rate: star_2, stars: 2 },
        star_3: { rate: star_3, stars: 3 },
        star_4: { rate: star_4, stars: 4 },
        star_5: { rate: star_5, stars: 5 },
        totalRating: totalRating,
      };
      this._renderRatingProgress(this.returned);
    });
  }
  _renderRatingProgress(returned) {
    const rated = returned;
    const bar1 = document.querySelector(".progress_1");
    const bar2 = document.querySelector(".progress_2");
    const bar3 = document.querySelector(".progress_3");
    const bar4 = document.querySelector(".progress_4");
    const bar5 = document.querySelector(".progress_5");
    const totalRateLabel = document.querySelector(".total-rate");
    bar1.style.width = `${(rated.star_1.rate / rated.totalRating) * 100}%`;
    bar2.style.width = `${(rated.star_2.rate / rated.totalRating) * 100}%`;
    bar3.style.width = `${(rated.star_3.rate / rated.totalRating) * 100}%`;
    bar4.style.width = `${(rated.star_4.rate / rated.totalRating) * 100}%`;
    bar5.style.width = `${(rated.star_5.rate / rated.totalRating) * 100}%`;

    let maxRate = -Infinity;
    let acc = 0;
    for (const key in rated) {
      if (key !== "totalRating" && rated[key].rate > maxRate) {
        maxRate = rated[key].rate;
        acc = rated[key].stars;
      }
    }
    totalRateLabel.textContent = acc.toFixed(1);
    this._settingStars(acc);
  }
  _settingStars(s) {
    let star = "";
    for (let i = 1; i <= s; i++) {
      star += '<i data-feather="star"></i> ';
    }
    const totalStarContainer = document.querySelectorAll(
      ".product-star-rating"
    );
    totalStarContainer.forEach((cont) => {
      cont.innerHTML = "";
      cont.insertAdjacentHTML("afterbegin", star);
    });
  }

  _gettingProductComment() {
    if (!this._gettURLProductID()) return;
    FIREBASE.getProductById(this._gettURLProductID()).then((product) => {
      detail._paginationComments(product.comments);
    });
  }
}

const rating = new Rating();
export { rating };
