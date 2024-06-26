const c = console.log.bind(document);
import { FORMAT_NUMBERS as format } from "./formatting.js";
import { detail } from "../../view/detail.js";
import { FIREBASE } from "../../model/firebase.js";
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
    this._renderProductRating();
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
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    FIREBASE._addProductComment(userComment, id);
    this._renderProductComments(this.#COMMENTS);
    this._renderProductRating();
  }
  _sendingProductComment() {}

  _renderProductRating() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    FIREBASE.getProductById(id).then((product) => {
      detail._renderProductComments(product.comments);
    });
  }
}

const rating = new Rating();
export { rating };
