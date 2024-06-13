feather.replace();
// import { admin } from "admin.js";

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
