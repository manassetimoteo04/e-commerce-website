class IsAuth {
  constructor() {}
  _authentication() {
    const token = localStorage.getItem("userToken");
    if (token) window.location.href = "./admin.html";
  }
}
const authT = new IsAuth();
export { authT };
