import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { admin } from "../admin.js";

class endpointsApp {
  #firebaseConfig = {
    apiKey: "AIzaSyA39Lu3_WJYF3iEif-sSY_o0ZShP81OdI4",
    authDomain: "e-commerce-app-b80be.firebaseapp.com",
    projectId: "e-commerce-app-b80be",
    storageBucket: "e-commerce-app-b80be.appspot.com",
    messagingSenderId: "177596628529",
    appId: "1:177596628529:web:80879359e963aeedd59f10",
    measurementId: "G-N8480TVMN1",
  };
  constructor() {
    // Inicializa o Firebase
    this.app = initializeApp(this.#firebaseConfig);
    // Inicializa o Firestore
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
    // this.addProduct("Produto 1", "Descrição do Produto 1", 100.0);
    this.deleteProduct("H3CZ0DLOcv1QSXRUA3Rg");
    // this.getProducts();
  }

  // upload de imagens
  async uploadImages(files) {
    const promises = files.map(async (file, index) => {
      const storageRef = ref(this.storage, `productos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    });

    return Promise.all(promises);
  }
  // Função para adicionar um novo produto
  async addProduct(name, description, price, category, files) {
    try {
      const imageUrls = await this.uploadImages(files);
      const docRef = await addDoc(collection(this.db, "productos"), {
        name: name,
        description: description,
        price: price,
        category: category,
        images: imageUrls,
      });
      console.log("Produto adicionado com ID:", docRef.id);
    } catch (error) {
      console.error("Erro ao adicionar produto: ", error);
    }
  }

  // Função para obter todos os produtos
  async getProducts() {
    try {
      const querySnapshot = await getDocs(collection(this.db, "productos"));
      let list = [];
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        const value = {
          id: doc.id,
          data: doc.data(),
        };
        list.push(value);
      });
      //   console.log(`${doc.id} =>`, doc.data());
      return list;
    } catch (e) {
      console.error("Erro ao obter produtos: ", e);
    }
  }

  // Função para atualizar um produto
  async updateProduct(productId, updatedData) {
    try {
      const productRef = doc(this.db, "productos", productId);
      await updateDoc(productRef, updatedData);
      console.log("Produto atualizado com sucesso!");
    } catch (e) {
      console.error("Erro ao atualizar produto: ", e);
    }
  }

  // Função para excluir um produto
  async deleteProduct(productId) {
    try {
      const productDoc = await getDoc(doc(this.db, "productos", productId));
      const productData = productDoc.data();

      if (productData && productData.images) {
        const deletePromises = productData.images.map(async (url) => {
          const storageRef = ref(this.storage, url);
          await deleteObject(storageRef);
        });
        await Promise.all(deletePromises);

        await deleteDoc(doc(this.db, "productos", productId));

        console.log("Produto e imagens excluídos com sucesso");
        this.getProducts();
      } else {
        console.error("Imagens não encontradas no produto");
      }
    } catch (e) {
      console.error("Erro ao excluir produto: ", e);
    }
  }
}

// // Exemplos de uso das funções CRUD
// (async call () {
//   await addProduct("Produto 1", "Descrição do Produto 1", 100.0);
//   await getProducts();
//   // Use IDs de produtos válidos para as operações abaixo
//   // await updateProduct('produto_id_1', { price: 120.00 });
//   // await deleteProduct('produto_id_1');
// })();

const endpoint = new endpointsApp();
export { endpoint };