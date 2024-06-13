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
    //
    this.uploadProductImgPreview();
  }

  //MOSTRANDO O FORMULÁRIO PARA ADICIONAR NOVO PRODUCTO
  _showNewProductForm() {
    this.newProductFormContainer.classList.remove("hidden");
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
}

const admin = new adminClass();
export { admin };
