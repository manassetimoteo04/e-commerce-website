import { endpoint } from "./data/endpoints.js";
class adminClass {
  constructor() {
    this.btnShowNewProductForm = document.querySelector(
      ".register-new-product"
    );
    this.newProductFormContainer = document.querySelector(
      ".add-new-product-container"
    );
    this.adminProductListContainer = document.querySelector(".admin-grid");
    this.productDetailContainer = document.querySelector(
      ".product-detail-admin-container"
    );
    this.btnConfirmAddNewProduct = document.querySelector(
      ".btn-confirm-add-product"
    );

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
    this.btnConfirmAddNewProduct?.addEventListener(
      "click",
      this._addNewProduct.bind(this)
    );

    //
    endpoint.getProducts().then((pt) => {
      this._renderAdminProduct(pt);
    });
    this.uploadProductImgPreview();
  }

  //MOSTRANDO O FORMULÁRIO PARA ADICIONAR NOVO PRODUCTO
  _showNewProductForm() {
    this.newProductFormContainer.classList.remove("hidden");
  }

  //ADICIONAR NOVO PRODUCTO
  async _addNewProduct(e) {
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
      await endpoint.addProduct(
        productName,
        productDescription,
        +productPrice,
        productCategory,
        files
      );
      this.newProductFormContainer.classList.add("hidden");
    } else alert("preenche todos os campos");
  }
  async _deleteProduct(e) {
    const element = e.closest(".product-box-admin");
    const id = element.dataset.id;
    console.log(id);
    endpoint.deleteProduct(id);
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
    if (target.closest(".see-product")) {
      this.productDetailContainer.classList.remove("hidden");
    }
    if (target.closest(".edit-product")) {
      this._showNewProductForm();
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

  _renderAdminProduct(list) {
    const producList = document.querySelector(".admin-grid");
    producList.innerHTML = "";
    list.forEach((item) => {
      console.log(item.data);
      const html = `
    <div class="product-box-admin" data-id="${item.id}">
    <img src="${item.data.images[0]}" alt="">
    <div class="product-admin-content">
        <span class="product-admin-name">${item.data.name}</span>
        <span class="product-admin-price">${item.data.price}</span>
    </div>
    <div class="admin-product-action">
        <button class="edit-product">edit<i data-feather="edit"></i></button>
        <button class="copy-product">copy<i data-feather="copy"></i></button>
        <button class="see-product">see<i data-feather="eye"></i></button>
        <button class="delete-product">delete<i data-feather="trash-2"></i></button>
    </div>
    </div>
    `;
      producList.insertAdjacentHTML("afterbegin", html);
    });
  }
}

const admin = new adminClass();
export { admin };
