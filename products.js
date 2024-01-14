import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const url = "https://vue3-course-api.hexschool.io/v2"; // 請加入站點
const path = "jeremychan"; //請加入個人 API Path

let productModal = "";
let deleteProductModal = "";

const App = {
  setup() {
    const isEdit = ref(false);
    const products = ref([]);

    const inputPic = ref("");
    const addProductInfo = ref({
      imageUrl: "",
      imagesUrl: [],
    });
    const targetProductId = ref("");

    const getProducts = () => {
      axios
        .get(`${url}/api/${path}/admin/products`)
        .then((res) => {
          console.log(res.data.products);
          products.value = res.data.products;
        })
        .catch((error) => console.log(error));
    };

    const checkAuth = () => {
      axios
        .post(`${url}/api/user/check`)
        .then(() => {
          getProducts();
        })
        .catch((error) => {
          console.log(error);
          window.location = "index.html";
        });
    };

    const openModal = (action, id) => {
      if (action === "addProduct") {
        isEdit.value = false;
        productModal.show();
      }
      if (action === "editProduct") {
        isEdit.value = true;
        targetProductId.value = id;
        productModal.show();
      }
      if (action === "deleteProduct") {
        deleteProductModal.show();
        targetProductId.value = id;
      }
    };

    const addPicToProductInfo = () => {
      if (addProductInfo.value.imageUrl === "") {
        addProductInfo.value.imageUrl = inputPic.value;
      } else {
        addProductInfo.value.imagesUrl.push(inputPic.value);
      }

      inputPic.value = "";
    };

    const removePics = () => {
      addProductInfo.value.imageUrl = "";
      addProductInfo.value.imagesUrl = [];
    };

    const addProduct = () => {
      if (!isEdit.value) {
        axios
          .post(`${url}/api/${path}/admin/product`, {
            data: addProductInfo.value,
          })
          .then((res) => {
            alert(res.data.message);
            productModal.hide();
            getProducts();
          });
      }

      if (isEdit.value) {
        axios
          .put(`${url}/api/${path}/admin/product/${targetProductId.value}`, {
            data: addProductInfo.value,
          })
          .then((res) => {
            isEdit.value = false;
            alert(res.data.message);
            productModal.hide();
            getProducts();
          });
      }
    };

    const deleteProductById = () => {
      axios
        .delete(`${url}/api/${path}/admin/product/${targetProductId.value}`)
        .then((res) => {
          alert(res.data.message);
          deleteProductModal.hide();
          getProducts();
        });
    };

    onMounted(() => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      axios.defaults.headers.common["Authorization"] = token;

      checkAuth();
    });

    onMounted(() => {
      productModal = new bootstrap.Modal(
        document.querySelector("#productModal")
      );

      deleteProductModal = new bootstrap.Modal(
        document.querySelector("#delProductModal")
      );
    });

    return {
      removePics,
      addPicToProductInfo,
      addProductInfo,
      inputPic,
      products,
      openModal,
      addProduct,
      deleteProductById,
    };
  },
};

const app = createApp(App);
app.mount("#app");
