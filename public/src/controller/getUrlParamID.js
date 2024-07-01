import { detail } from "../view/detail.js";
import { FIREBASE } from "../model/firebase.js";
import { crawler } from "./SEO/crawler.js";
import { linkView } from "./controller.js";
class GET_PRODUCT_BY_URL {
  constructor() {
    this._gettingCurrentProductID();
  }
  _gettingCurrentProductID() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    if (id) {
      FIREBASE.getProductById(id).then((data) => {
        document.title = `${data.name} - Derby commercy`;
        detail._settingCurrentProductDetail(data);
        crawler.atualizarMetaTags(data);
        linkView._gettingRelatedProduct(data.category);
      });
    }
    if (!id) {
      FIREBASE.getProducts().then((data) => {
        id = data[0].id;
        FIREBASE.getProductById(id).then((data) => {
          document.title = `${data.name} - Derby commercy`;
          detail._settingCurrentProductDetail(data);
          crawler.atualizarMetaTags(data);
          linkView._gettingRelatedProduct(data.category);
        });
      });
    }
  }
}

const GET_URL_ID = new GET_PRODUCT_BY_URL();
export { GET_URL_ID };
