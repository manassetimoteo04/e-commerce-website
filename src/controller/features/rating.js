const c = console.log.bind(document);
import { FORMAT_NUMBERS as format } from "./formatting.js";
class Rating {
  #COMMENTS = [];
  constructor() {
    this.btnSendComment = document.querySelector(".btn-send-comment");
    this.commentContainer = document.querySelector(".product-comment-list");
    this.ratingBtn = document.querySelector(".select-rating");
    this.btnSendComment?.addEventListener(
      "click",
      this._takingCommentContent.bind(this)
    );

    this.ratingBtn?.addEventListener("click", this._ratingSystem.bind(this));
    this._renderProductComments(this.#COMMENTS);
  }
  _ratingSystem(e) {
    e?.preventDefault();
    const target = e?.target?.closest("button");
    if (!target) return;
    const buttons = document.querySelectorAll(".select-rating button");
    const arr = [...target.parentNode.children];
    const index = arr.indexOf(target);
    c(index);
    arr.forEach((s) => (s.style.background = "none"));
    for (let i = 0; i <= index; i++) {
      arr[i].style.background = "yellow";
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
    this._renderProductComments(this.#COMMENTS);
  }
  _sendingProductComment() {}
  _renderProductComments(list) {
    if (!this.commentContainer) return;
    this.commentContainer.innerHTML = "";
    list.forEach((element) => {
      const html = `
      <div class="comment-box">
      <div>
          <span class="user-name">${element.name?.split(" ")[0]}</span>
          <span class="commented-date">${format.formatDates(
            new Date(element.date)
          )}</span>
          <div class="user-rate">
              <i data-feather="star"></i>
              <i data-feather="star"></i>
              <i data-feather="star"></i>
              <i data-feather="star"></i>
              <i data-feather="star"></i>
          </div>
      </div>
      <p class="comment-text">${element.description}</p>
      </div>
        `;
      this.commentContainer.insertAdjacentHTML("afterbegin", html);
    });
  }
  _renderProductRating() {}
}

const rating = new Rating();
export { rating };
