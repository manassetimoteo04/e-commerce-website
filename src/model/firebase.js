import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  FieldValue,
  deleteDoc,
  arrayUnion,
  runTransaction,
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
    this.getProductById("pYrvCxSeOfVqyrnZ7QSj");
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
      document.querySelector("#spinner").classList.remove("hidden");
      const imageUrls = await this.uploadImages(files);
      const docRef = await addDoc(collection(this.db, "productos"), {
        name: name,
        description: description,
        price: price,
        category: category,
        images: imageUrls,
        date: new Date().toISOString(),
        rating: 0,
        sales: Math.trunc(Math.random() * 20) + 1,
        comments: [],
      });
      document.querySelector("#spinner").classList.add("hidden");
    } catch (error) {
      console.error("Erro ao adicionar produto: ", error);
    }
  }

  // Função para obter todos os produtos
  async getProducts() {
    try {
      document.querySelector("#spinner").classList.remove("hidden");
      const querySnapshot = await getDocs(collection(this.db, "productos"));
      document.querySelector("#spinner").classList.add("hidden");
      let list = [];
      querySnapshot.forEach((doc) => {
        const value = {
          id: doc.id,
          data: doc.data(),
        };
        list.push(value);
      });
      feather.replace();

      //   console.log(`${doc.id} =>`, doc.data());
      return list;
    } catch (e) {
      console.error("Erro ao obter produtos: ", e);
    }
  }

  // Função para pegar o producto pelo ID
  async getProductById(productId) {
    try {
      document.querySelector("#spinner").classList.remove("hidden");
      const productRef = doc(this.db, "productos", productId);
      const productDoc = await getDoc(productRef);
      document.querySelector("#spinner").classList.add("hidden");
      if (productDoc.exists()) {
        return productDoc.data();
      } else {
        return null;
      }
    } catch (e) {
      console.error("Erro ao obter produtos: ", e);
    }
  }
  // Função para atualizar um produto
  async updateProduct(productId, updatedData) {
    try {
      document.querySelector("#spinner").classList.remove("hidden");
      const productRef = doc(this.db, "productos", productId);
      await updateDoc(productRef, updatedData);
      document.querySelector("#spinner").classList.add("hidden");
    } catch (e) {
      console.error("Erro ao atualizar produto: ", e);
    }
  }

  // Função para excluir um produto
  async deleteProduct(productId) {
    try {
      document.querySelector("#spinner").classList.remove("hidden");

      await runTransaction(this.db, async (transaction) => {
        const productRef = doc(this.db, "productos", productId);
        const productDoc = await getDoc(productRef, { transaction });
        document.querySelector("#spinner").classList.add("hidden");

        if (!productDoc.exists()) {
          console.error("Produto não encontrado.");
          return;
        }

        const images = productDoc.data().images || [];

        transaction.delete(productRef);
        // if (images.length > 0) {
        //   const deletePromises = images.map(async (url) => {
        //     const storageRef = ref(this.storage, url);
        //     await deleteObject(storageRef);
        //     console.log(storageRef);
        //     console.log(`Imagem ${url} excluída.`);
        //   });
        //   await Promise.all(deletePromises);
        // }
        // if (images.length === 0) return;
      });
    } catch (error) {
      console.error("Erro ao excluir produto e imagens:", error);
    }
  }
  async _addProductComment(data, productId) {
    try {
      const productRef = doc(this.db, "productos", productId);
      // Atualizar o documento usando arrayUnion
      await updateDoc(productRef, {
        comments: arrayUnion(data),
      });

      console.log("Comentário adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  }
  async newOrder(data) {
    try {
      document.querySelector("#spinner").classList.remove("hidden");
      const docRef = await addDoc(collection(this.db, "orders"), data);
      document.querySelector("#spinner").classList.add("hidden");
      console.log("Produto Enviado com ID:", docRef.id);
    } catch (error) {
      console.error("Erro ao adicionar produto: ", error);
    }
  }
}

const FIREBASE = new endpointsApp();
export { FIREBASE };
