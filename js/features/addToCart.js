class Cart {
  constructor() {
    this.cartArray = [];
    this._getToLocalStorage();
  }
  _addProduct(productID, quantity) {
    const product = {
      id: productID,
      quantity: quantity,
    };
    this.cartArray.push(product);
    this._setToLocalStorage();
  }
  _setToLocalStorage() {
    localStorage.setItem("cartList", JSON.stringify(this.cartArray));
  }
  _getToLocalStorage() {
    const cart = JSON.parse(localStorage.getItem("cartList"));
    console.log(cart);
    this._renderCartList(cart);
  }
  _renderCartList(list) {
    console.log(list);
  }
}

const addToCart = new Cart();
addToCart._addProduct("123", 12);
addToCart._addProduct("12", 12);
addToCart._addProduct("13", 12);

export { addToCart };
