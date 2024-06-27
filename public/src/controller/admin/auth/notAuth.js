class NotAuth {
  constructor() {
    this._authentication();
  }
  _authentication() {
    const token = localStorage.getItem("userToken");
    if (!token) window.location.href = "./index.html";
  }
}
const authNot = new NotAuth();
