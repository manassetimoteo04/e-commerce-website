import { FIREBASE } from "../../model/firebase.js";
import { admin } from "../../view/admin.js";
import { view } from "../../view/view.js";
class Search {
  constructor() {
    this.inputSearch = document.querySelector(".search-product-input");
    this.inputSearchAdmin = document.querySelector(".search-input-admin");
    this.btnSearch = document.querySelector(".search-product-btn");
    this.adminForm = document.querySelector(".search-input-div-admin");
    this.adminForm?.addEventListener(
      "submit",
      this._adminFilterProducts.bind(this)
    );
    this.btnSearch?.addEventListener("click", this._filterProducts.bind(this));
  }
  _normalizeText(text) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
  _filterProducts(e) {
    e.preventDefault();
    const text = document.querySelector(".searched");
    text.textContent = this._normalizeText(this.inputSearch.value.trim());
    const searchText = this.inputSearch.value.trim().toLowerCase();
    FIREBASE.getProducts().then((data) => {
      const filtered = data.filter((product) => {
        if (
          !this._normalizeText(product.data.name).includes(searchText) &&
          !this._normalizeText(product.data.category).includes(searchText)
        ) {
          return false;
        }
        return true;
      });

      view._renderSearchResults(filtered, this.inputSearch.value);
    });
  }

  _adminFilterProducts(e) {
    e.preventDefault();
    const text = document.querySelector(".searched");
    const searchText = this.inputSearchAdmin.value.trim().toLowerCase();
    FIREBASE.getProducts().then((data) => {
      const filtered = data.filter((product) => {
        if (
          !this._normalizeText(product.data.name).includes(searchText) &&
          !this._normalizeText(product.data.category).includes(searchText)
        ) {
          return false;
        }
        return true;
      });
      admin._paginationAdmin(filtered, this.inputSearchAdmin.value);
    });
  }
}

const SEARCH = new Search();
export { SEARCH };
