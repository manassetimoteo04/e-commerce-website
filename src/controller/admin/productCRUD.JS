import { FIREBASE } from "../../model/firebase.js";
import { admin } from "../../view/admin.js";
import { FORMAT_NUMBERS } from "../features/formatting.js";
class PRODUCT_CRUD {
  constructor() {
    this.btnConfirmAddNewProduct = document.querySelector(
      ".btn-confirm-add-product"
    );
    this.newProductFormContainer = document.querySelector(
      ".add-new-product-container"
    );
    this.newProductForm = document.querySelector(".add-new-product-form");
    this.updateProductForm = document.querySelector(".update-product-form");
    this.btnUpdateProduct = document.querySelector(".btn-update-product");
    this._bindEventListeners();
  }
  _bindEventListeners() {
    this.btnConfirmAddNewProduct?.addEventListener(
      "click",
      this._addNewProduct.bind(this)
    );
    this.btnUpdateProduct?.addEventListener(
      "click",
      this._updateProductById.bind(this)
    );
  }
  //ADICIONAR NOVO PRODUCTO
  _addNewProduct(e) {
    e.preventDefault();
    const productName = document.querySelector(".input-product-name").value;
    const productCategory = document.querySelector(
      ".input-product-category"
    ).value;
    const productPrice = document.querySelector(".input-product-price").value;
    const productDescription = document.querySelector(
      ".input-product-description"
    ).value;

    const img1 = document.querySelector(".img-1");
    const img2 = document.querySelector(".img-2");
    const img3 = document.querySelector(".img-3");

    const files = [img1.files[0], img2.files[0], img3.files[0]];
    if (productName && productCategory && productPrice && productDescription) {
      FIREBASE.addProduct(
        productName,
        productDescription,
        +productPrice,
        productCategory,
        files
      );
      this.newProductFormContainer.classList.add("hidden");
      FIREBASE.getProducts().then((data) => {
        admin._renderAdminProduct(data);
      });
    } else alert("preenche todos os campos");
  }
  _deleteProduct(e) {
    const element = e.closest(".product-box-admin");
    const id = element.dataset.id;
    console.log(id);
    FIREBASE.deleteProduct(id);
    FIREBASE.getProducts().then((pt) => {
      admin._renderAdminProduct(pt);
    });
  }
  _copyToClipBoard(e) {
    const element = e.closest(".product-box-admin");
    const id = element.dataset.id;
    const textToCopy = `http://127.0.0.1:8080/detail.html?id=${id}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then((text) => {
        console.log("Texto copiado para o clipboard!", text);
        alert("link copiado");
      })
      .catch(function (error) {
        console.error("Erro ao copiar o texto: ", error);
      });
  }
  // MANIPULANDO O INPUT PARA UPLOAD DE IMAGENS
  uploadProductImgPreview() {
    const inputFile = document.querySelectorAll(".upload-img input");
    inputFile.forEach((inpt) =>
      inpt.addEventListener("change", function (e) {
        const files = e.target.files;
        if (files.length > 0) {
          const file = files[0];
          const reader = new FileReader();

          reader.onload = function (event) {
            const imgElement = e.target.previousElementSibling;
            imgElement.src = event.target.result;
            imgElement.style.opacity = 1;
          };

          reader.readAsDataURL(file);
        }
      })
    );
  }

  _updateProductById(e) {
    e.preventDefault();

    const productName = document.querySelector(".input-update-name").value;
    const productCategory = document.querySelector(
      ".input-update-category"
    ).value;
    const productDescription = document.querySelector(
      ".input-update-description"
    ).value;
    const productPrice = document.querySelector(".input-update-price").value;

    const data = {
      name: productName,
      description: productDescription,
      price: productPrice,
      category: productCategory,
    };

    FIREBASE.updateProduct(this.currentProductId, data);
    FIREBASE.getProducts().then((data) => {
      admin._renderAdminProduct(data);
    });
    this.newProductFormContainer.classList.add("hidden");
  }
}

class AdminController extends PRODUCT_CRUD {
  currentProductId;
  constructor() {
    super();
    this.btnShowOrders = document.querySelector(".all-orders");
    this.adminOrderContainer = document.querySelector(".orders-container");
    this.orderList = document.querySelector(".order-list-box");
    this.btnShowNewProductForm = document.querySelector(
      ".register-new-product"
    );

    this.adminProductListContainer = document.querySelector(".admin-grid");
    this.productDetailContainer = document.querySelector(
      ".product-detail-admin-container"
    );

    this.newProductForm = document.querySelector(".add-new-product-form");
    this.updateProductForm = document.querySelector(".update-product-form");
    this.btnUpdateProduct = document.querySelector(".btn-update-product");
    this.btnShowOrders?.addEventListener(
      "click",
      this._shorOrdersContainer.bind(this)
    );
    FIREBASE.getProducts().then((pt) => {
      //   this._gettingRecentProducts(pt);
      //   this._gettingMostSelledProducts(pt);
      admin._paginationAdmin(pt);
    });
    this.uploadProductImgPreview();
    this._bindEventListeners();
  }
  _bindEventListeners() {
    //EVENT LISTENERS
    this.btnShowNewProductForm?.addEventListener(
      "click",
      this._showNewProductForm.bind(this)
    );
    this.newProductFormContainer?.addEventListener(
      "click",
      this._closeNewProductForm.bind(this)
    );
    this.adminProductListContainer?.addEventListener(
      "click",
      this._seeProductDetail.bind(this)
    );
    this.productDetailContainer?.addEventListener(
      "click",
      this._closeProductDetail.bind(this)
    );
  }
  _shorOrdersContainer() {
    this.adminOrderContainer.classList.remove("hidden");
  }
  //MOSTRANDO O FORMULÁRIO PARA ADICIONAR NOVO PRODUCTO
  _showNewProductForm() {
    this.newProductFormContainer.classList.remove("hidden");
    this.newProductForm.classList.remove("hidden");
    this.updateProductForm.classList.add("hidden");
  }

  //FECHAR O FORM PARA ADICIONAR NOVO PRODUCTO
  _closeNewProductForm(e) {
    const target = e.target;
    if (target.closest(".new-product-form-overlay"))
      this.newProductFormContainer.classList.add("hidden");
    if (target.closest(".close-form")) {
      this.newProductFormContainer.classList.add("hidden");
    }
  }
  _seeProductDetail(e) {
    const target = e.target;
    if (target.closest(".copy-link")) {
      this._copyToClipBoard(target);
    }
    if (target.closest(".see-product")) {
      this.productDetailContainer.classList.remove("hidden");
      this._adminProductDetail(target);
    }
    if (target.closest(".edit-product")) {
      this._showNewProductForm();
      this.newProductForm.classList.add("hidden");
      this.updateProductForm.classList.remove("hidden");
      this._updateProduct(target);
    }
    if (target.closest(".delete-product")) {
      this._deleteProduct(target);
    }
  }
  _closeProductDetail(e) {
    const target = e.target;
    if (target.closest(".overlay-product-detail")) {
      this.productDetailContainer.classList.add("hidden");
    }
    if (target.closest(".btn-close-product-detail")) {
      this.productDetailContainer.classList.add("hidden");
    }
  }

  // MANIPULANDO O INPUT PARA UPLOAD DE IMAGENS
  uploadProductImgPreview() {
    const inputFile = document.querySelectorAll(".upload-img input");
    inputFile.forEach((inpt) =>
      inpt.addEventListener("change", function (e) {
        const files = e.target.files;
        if (files.length > 0) {
          const file = files[0];
          const reader = new FileReader();

          reader.onload = function (event) {
            const imgElement = e.target.previousElementSibling;
            imgElement.src = event.target.result;
            imgElement.style.opacity = 1;
          };

          reader.readAsDataURL(file);
        }
      })
    );
  }
  _adminProductDetail(target) {
    const targetId = target.closest(".product-box-admin").dataset.id;
    const productName = document.querySelector(".product-detail-name-admin");
    const productPrice = document.querySelector(".product-price-admin-detail");
    const productDescription = document.querySelector(
      ".product-description-admin"
    );
    const productLast = document.querySelector(".product-admin-last");
    console.log(productName, productPrice);
    const productImg = document.querySelectorAll(".admin-slide-img");
    let datat;
    FIREBASE.getProductById(targetId).then((data) => {
      datat = data;
      productImg.forEach((img, i) => {
        img.src = data.images[i];
        console.log(img);
      });
      productLast.textContent = FORMAT_NUMBERS.formatCurrency(56756);
      productPrice.textContent = FORMAT_NUMBERS.formatCurrency(data.price);
      productName.textContent = data.name;
      productDescription.textContent = data.description;
    });
  }
  _updateProduct(target) {
    const targetId = target.closest(".product-box-admin").dataset.id;
    this.currentProductId = targetId;
    const productName = document.querySelector(".input-update-name");
    const productCategory = document.querySelector(".input-update-category");
    const productDescription = document.querySelector(
      ".input-update-description"
    );
    const productPrice = document.querySelector(".input-update-price");
    FIREBASE.getProductById(targetId).then((data) => {
      productName.value = data.name;
      productCategory.value = data.category;
      productDescription.value = data.description;
      productPrice.value = data.price;
    });
  }
}
const adminController = new AdminController();
export { adminController };

const CRUD = new PRODUCT_CRUD();
export { CRUD };
