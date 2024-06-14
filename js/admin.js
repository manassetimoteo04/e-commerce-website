import { endpoint } from "./data/endpoints.js";
class adminClass {
  currentProductId;
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
    this.newProductForm = document.querySelector(".add-new-product-form");
    this.updateProductForm = document.querySelector(".update-product-form");
    this.btnUpdateProduct = document.querySelector(".btn-update-product");
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
    this.btnUpdateProduct?.addEventListener(
      "click",
      this._updateProductById.bind(this)
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
    this.newProductForm.classList.remove("hidden");
    this.updateProductForm.classList.add("hidden");
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
      await endpoint.getProducts().then((pt) => {
        this._renderAdminProduct(pt);
      });
    } else alert("preenche todos os campos");
  }
  async _deleteProduct(e) {
    const element = e.closest(".product-box-admin");
    const id = element.dataset.id;
    console.log(id);
    endpoint.deleteProduct(id);
    await endpoint.getProducts().then((pt) => {
      this._renderAdminProduct(pt);
    });
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
    const productName = document.querySelector(".product-admin-name");
    const productPrice = document.querySelector(".product-admin-price");
    const productDescription = document.querySelector(
      ".product-description-admin"
    );
    console.log(productName, productPrice);
    const productImg = document.querySelector(".product-img-box img");
    let datat;
    endpoint.getProductById(targetId).then((data) => {
      datat = data;
      productImg.src = data.images[0];
      productPrice.textContent = data.price;
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
    endpoint.getProductById(targetId).then((data) => {
      productName.value = data.name;
      productCategory.value = data.category;
      productDescription.value = data.description;
      productPrice.value = data.price;
    });
  }
  async _updateProductById(e) {
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
    console.log(data, this.targetId);

    await endpoint.updateProduct(this.currentProductId, data);
    await endpoint.getProducts().then((pt) => {
      this._renderAdminProduct(pt);
    });
    this.newProductFormContainer.classList.add("hidden");
  }
  _renderAdminProduct(list) {
    const producList = document.querySelector(".admin-grid");
    if (!producList) return;
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
        <button class="edit-product"><ion-icon name="create-outline"></ion-icon></button>
        <button class="copy-product"><ion-icon name="copy-outline"></ion-icon></button>
        <button class="see-product"><ion-icon name="eye-outline"></ion-icon></i></button>
        <button class="delete-product"><ion-icon name="trash-outline"></ion-icon></button>
    </div>
    </div>
    `;
      producList.insertAdjacentHTML("afterbegin", html);
    });
  }
}

const admin = new adminClass();
export { admin };

const next = document.querySelector(".btn-next-product-img");
const previous = document.querySelector(".btn-prev-product-img");
const imgsSlide = document.querySelectorAll(".admin-slide-img");
let currSlide = 0;

// imgsSlide.forEach((img, i) => {
//   img.style.transform = `translateX(${i * 100}%)`;
// });

const goToSlide = function (slide) {
  imgsSlide.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlide(0);
const maxSlide = imgsSlide.length - 1;

const nextSlide = function () {
  currSlide === maxSlide ? (currSlide = 0) : currSlide++;
  goToSlide(currSlide);
};

const prevSlide = function () {
  currSlide === 0 ? (currSlide = maxSlide) : currSlide--;
  goToSlide(currSlide);
  //   alert("");
};

next?.addEventListener("click", nextSlide);
previous?.addEventListener("click", prevSlide);
