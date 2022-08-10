<template>
    <div class="mainSection">
        <!-- Left side -->
        <div class="ordersSection">
            <div class="searchSection">
                <input @input='filterOrder' placeholder="Введите название заказа" v-model="searchOrdersInput">
                <div class="searchButton">
                    <img src="../assets/icons/searchIcon.png">
                </div>
            </div>
            <div class="ordersList">
                <div class="order" v-for="order in ordersList" :key="order" @click="selectedOrderId = order.id; getOrderByID();">
                    <div class="header">
                        <p class="number"> Заказ ID: {{order.id}} </p>
                        <p class="date"> {{order.createdAt.slice(0,10).replace(/-/g,".")}} </p>
                    </div>
                    <div class="productsAndStatus">
                        <div class="productsList"> 
                            <p class="productsName" v-for="product in order.positions" :key="product"> {{product.name}} </p>
                        </div>
                        <p class="status"> {{order.status}} </p>
                    </div>
                </div>
                <div class="noOrders" v-if="ordersList.length == 0">
                    <img src="../assets/icons/noOrders.png" width="74" height="74"> 
                    <p> Заказов нет! </p>
                    <p> Cоздайте новый по кнопке ниже </p>
                </div>
            </div>
            <button class="createOrderButton" @click="newOrder();"> Новый заказ </button>
        </div>

        <!-- Center, right side -->
        <div class="editor" v-if="selectedOrderId != undefined">
            <div class="title">
                <p v-if="editing == false"> Новый товар </p>
                <p v-if="editing == true"> Заказ ID: {{order.id}} </p>
                <button class="closeEditorButton" @click="selectedOrderId = undefined"> ✖ </button>
            </div>
            <div id="productList" class="productList">
                <div class="product" v-for="product in order.positions" :key="product">
                    <textarea class="name" placeholder="Название товара" v-model="product.name"></textarea>
                    <button class="deleteProduct" @click="deleteProduct($event);"> ✖ </button>
                    <div class="productInfo">
                        <textarea class="link"    placeholder="Ссылка на товар" v-model="product.link"></textarea>
                        <br>
                        <textarea class="desc"    placeholder="Описание (не менее 4 символов)" v-model="product.description"></textarea>
                        <br>
                        <textarea class="count"   placeholder="Количество" v-model="product.count"></textarea>
                        <textarea class="article" placeholder="Артикль" v-model="product.article"></textarea>
                    </div>
                </div>
                <div class="noProducts" v-if="productExist == false"> 
                    <img src="../assets/icons/noProducts.png" width="52" height="52">
                    <p> Товары отсутствуют! </p> 
                    <p> Создайте новый, нажав на + </p>
                </div>
                <button class="addNewProduct" @click="addNewProduct();"> + </button>
            </div>
            <textarea id="usernameTo" class="usernameTo" v-if="productExist == true" placeholder="Для кого заказ" v-model="order.usernameTo"/>
            <p id="username" class="username" v-if="productExist == true && userData.role == 'globaladmin'"> Пользователь: {{order.username}} </p>

            <div class="buttons" v-if="productExist == true">
                <button class="saveButton"   v-if="editing == false" @click="createOrder()"> Сохранить новый заказ </button>
                <button class="sendButton"   v-if="editing == true"  @click="editOrderByID()"> Обновить </button>
                <button class="deleteButton" v-if="editing == true"  @click="deleteOrderByID();"> Удалить заказ </button>
                <select class="selectOrderCategory" v-if="editing == true">
                    <option value="value1">Обрабатывается</option>
                    <option value="value2">Обработан</option>
                </select>
            </div>
        </div>
        <div class="nothingSelected" v-if="selectedOrderId == undefined">
            <div class="textAndImage">
                <img src="../assets/icons/nothingSelected.png" width="64" height="64">
                <p> Заказ не выбран! </p>
                <p> Выберите товар из списка, или создайте новый. </p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';  

export default {
    name: 'Main',

    props: {
        userData: {
            type: Object,
            default() { return {} }
        },
    },
    
    data() {
        return {
            // Get all orders
            getOrdersLink: 'http://chancery.fisb/api/employee/orders',
            selectedOrderStatusList: 'Мои заказы',

            ordersList: () => [],

            // Get one order by ID
            getOrderByIdLink: 'http://localhost:3001/employee/orders/',

            selectedOrderId: undefined,
            order: [{}],

            editing: true, // editing EXISTING order. Not new.
            productExist: false,

            searchOrdersInput: '',
        }
    },

    methods: {
        //------------------//
        // Editor functions //
        //------------------//

        newOrder() {
            // Clear all areas and variables
            this.editing = false;
            this.selectedOrderId = 0;

            this.order.positions = [{
                name: "",
                link: "https://link.ru",
                description: "",
                count: "",
                article: ""
            }]
            this.order.username = this.userData.email;
            this.order.usernameTo = this.userData.displayName;

            console.log(this.order);
        },

        addNewProduct() {
            this.order.positions.push({
                name: "",
                link: "https://link.ru",
                description: "",
                count: "",
                article: ""
            })
        },

        deleteProduct(element) {
            element.path[1].remove();
        },

        getProducts() {
            let positions = [];

            // We count the number of products in the order
            let productList = document.getElementsByClassName('product'); 
            
            // Loop through the elements and take the values from each product elemnt
            for (let productCounter = 0; productCounter < productList.length; productCounter++) {
                let product = {
                    "name":        productList[productCounter].childNodes[0].value.toString(),              // Product name
                    "link":        productList[productCounter].childNodes[2].childNodes[0].value,           // Product link
                    "description": productList[productCounter].childNodes[2].childNodes[2].value,           // Product description
                    "count":       parseInt(productList[productCounter].childNodes[2].childNodes[4].value), // Product count
                    "article":     productList[productCounter].childNodes[2].childNodes[5].value            // Product count
                }
                positions.push(product);
            }
            let usernameTo = document.getElementById('usernameTo').value;

            let data = { positions, usernameTo };

            return data;
        },

        //-------------------//
        // Database requests //
        //-------------------//

        getOrders() {
            axios.get(this.getOrdersLink, { withCredentials: true })
            .then((res) => {
                console.log(res);
                this.ordersList = res.data.orders;
                console.log(this.ordersList);
            });
        },

        getOrderByID() {
            this.editing = true;

            if (this.userData.role == 'globaladmin') {
                this.getOrderByIdLink = 'http://localhost:3001/manager/orders/'
            }
            axios.get(this.getOrderByIdLink+this.selectedOrderId, { withCredentials: true })
            .then((res) => {
                console.log(res);
                this.order = res.data;
                console.log(this.order.positions);

                if (this.order.status == "Не обработан") {
                    this.editing = true;
                }
            });
        },

        createOrder() {
            axios.post(this.getOrdersLink, this.getProducts(), { withCredentials: true })
            .then((res) => {
                console.log(res);
                this.getOrders();
            });
        },

        editOrderByID() {
            axios.patch(this.getOrderByIdLink+this.selectedOrderId, this.getProducts(), { withCredentials: true })
            .then((res) => {
                console.log(res);
                this.getOrders();
            });
        },

        deleteOrderByID() {
            axios.delete(this.getOrderByIdLink+this.selectedOrderId, { withCredentials: true })
            .then((res) => {
                console.log(res);
                this.selectedOrderId = undefined;
                this.order = res.data;
                this.getOrders();
            });
        },

        //-------------------//
        //       Other       //
        //-------------------//

        newGetOrdersLink() {
            switch(this.selectedOrderStatusList) {
                case "Мои заказы":
                    this.getOrdersLink='http://localhost:3001/employee/orders';
                break;
                case "Необработанные":
                    this.getOrdersLink='http://localhost:3001/manager/orders/np';
                break;
                case "Обрабатываются":
                    this.getOrdersLink='http://localhost:3001/manager/orders/ip';
                break;
                case "Обработаны":
                    this.getOrdersLink='http://localhost:3001/manager/orders/p';
                break;
            }
            this.getOrders();
        },

        filterOrder() {
            let searchInput = this.searchOrdersInput;
            this.ordersList = this.ordersList.filter(function callbackFn(ordersList)  {
                console.log(ordersList);
                console.log("SEARCH: " + searchInput);
                if(ordersList.username.includes(searchInput)) {
                    return ordersList
                }
            })
        }
    },

    mounted() {
        this.getOrders();
    
        setInterval(() => {
            if (this.selectedOrderStatusList != document.getElementById("titleOrdersStatusList").innerText) {
                this.selectedOrderStatusList = document.getElementById("titleOrdersStatusList").innerText;
                this.newGetOrdersLink();
            }
        }, 10);
        
        setInterval(() => {
            if (document.getElementsByClassName('product').length > 0) {
                this.productExist = true;
            }
            else {
                this.productExist = false;
            }
        }, 10);
    }
}
</script>

<style>
    .mainSection {
        display: flex;

        height: 950px;
        width: 100%;

        background: var(--main-background);
    }

    /*------------*/
    /* Left side */
    /*------------*/

    .mainSection .ordersSection {
        height: 950px;
        width: 300px;

        background: var(--left-side-background);
    }

    .ordersSection .searchSection {
        display: flex;

        height: 40px;
        width: 300px;

        background: var(--sub-background);
    }

    .searchSection input {
        all: unset;

        margin: 10px;

        width: 240px;
        height: 20px;

        border-bottom: 1px solid white;

        font-family: var(--main-font);
        font-size: 14px;

        color: var(--text-color);
        background: transparent;
    }

    .searchSection .searchButton {
        margin-top: 12px;
    }
    .searchSection .searchButton img { 
        height: 20px;
        width: 20px;

        cursor: pointer;
    }

    .searchSection .searchButton img:hover  {
        filter: invert(0.2);
    }

    .ordersSection .ordersList {
        overflow-y: scroll;
        overflow-x: hidden;

        height: 800px;
        width: 300px;
    }
    .ordersList::-webkit-scrollbar-track {
        background-color: var(--left-side-scrollbar-track);
    }
    .ordersList::-webkit-scrollbar {
        width: 10px;

        background-color: var(--left-side-scrollbar-track);
    }
    .ordersList::-webkit-scrollbar-thumb {
        background-color: var(--left-side-scrollbar-thumb);
    }

    .ordersList .order {
        margin: 30px auto;

        height: 100px;
        width: 270px;

        font-family: var(--main-font);

        color: var(--text-color);
        background: var(--sub-background);

        cursor: pointer;

        transition: .3s;
    }
    .ordersList .order:hover {
        -webkit-transform: scale(1.1);
    }

    .order .header {
        display: flex;

        height: 40px;
        width: 270px;

        background: var(--sub-color);
    }
    .order .header .date{
        margin-top: 17px;

        font-size: 10px;
    }
    .order .header p {
        padding: 0px 0px 0px 20px;

        font-family: var(--main-font);
        font-size: 14px;
    }

    .order .productsAndStatus {
        height: 60px;
        width: 270px;
    }
    .productsAndStatus .productsList {
        margin: 0;
        padding: 0px 20px 0px 20px;

        display: flex;

        height: 38px;

        font-size: 12px;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;

        color: var(--text-color-hover);
    }
    .productsAndStatus .productsName {
        margin-right: 10px;
    } 
    .productsAndStatus .status {
        padding: 0px 20px 0px 20px;

        margin: 0;

        font-size: 12px;
    }

    .ordersList .noOrders {
        margin-top: 28px;

        font-family: var(--main-font);
        font-size: 16px;
        text-align: center;

        color: var(--text-color);
    }
    .noOrders p {
        margin-top: 5px;
    }

    .ordersSection .createOrderButton {
        all: unset;

        margin: 20px 0px 0px 15px;
        padding: 0px 0px 0px 20px;

        height: 30px;
        width: 250px;

        font-family: var(--sub-font);

        color: var(--text-color);
        background: var(--sub-background);

        cursor: pointer;

        transition: .3s;
    }
    .ordersSection .createOrderButton:hover {
        -webkit-transform: scale(1.1);
    }

    /*---------------------*/
    /* Center, right side */
    /*--------------------*/

    .mainSection .editor {
        overflow-y: scroll;
        overflow-x: hidden;

        height: 100%;
        width: 100%;
    }
    .mainSection .editor::-webkit-scrollbar-track {
        background-color: var(--left-side-scrollbar-track);
    }
    .mainSection .editor::-webkit-scrollbar {
        width: 10px;

        background-color: var(--left-side-scrollbar-track);
    }
    .mainSection .editor::-webkit-scrollbar-thumb {
        background-color: var(--left-side-scrollbar-thumb);
    }

    .editor .title {
        display: flex;

        color: var(--text-color);
    }
    .editor .title .closeEditorButton {
        margin-top: 20px;
        right: 30px;

        position: absolute;
    
        height: 30px;
        width: 30px;

        border: 0;

        font-size: 18px;

        color: var(--text-color);
        background: none;

        cursor: pointer;

        transition: .3s;
    }
    .editor .title .closeEditorButton:hover {
        color: var(--text-color-hover);
    }
    .editor .title p {
        margin: 30px;

        font-family: var(--main-font);
        font-size: 24px;
    }

    .editor .productList {
        margin: 30px;

        height: fit-content;
        width: 100%;
    }
    .productList .product {
        margin-bottom: 20px;
        padding-bottom: 20px;

        position: relative;

        overflow-x: hidden;

        min-height: 60px;
        width: 95%;
        min-width: 950px;

        background: var(--left-side-background);
    }
    .productList .product .productInfo{
        margin-left: 50px;
    }
    .productList .product .deleteProduct {
        all: unset;

        top: 10px;
        right: 10px;

        position: absolute;

        height: 20px;
        width: 20px;

        border: 0;

        font-size: 18px;

        color: var(--text-color);
        background: none;

        cursor: pointer;

        transition: .3s;
    }
    .productList .product .deleteProduct:hover {
        color: var(--text-color-hover);
    }
    .productList .product textarea {
        all: unset;

        margin: 20px 0px 0px 20px;

        resize: none;

        height: 20px;

        border: none;
        border-bottom: 1px solid rgb(150, 150, 150);

        font-family: var(--main-font);
        font-size: 16px;

        color: var(--text-color);
        background: transparent;
    }
    .productList .product .name {
        margin-bottom: 5px;

        height: 28px;
        width: 500px;

        font-size: 22px;
    }
    .productList .product .link {
        width: 600px;
    }
    .productList .product .desc {
        width: 800px;
    }
    .productList .product .count {
        width: 100px;
    }
    .productList .product .article {
        width: 100px;
    }

    .productList .noProducts {
        margin: auto;

        font-family: var(--main-font);
        font-size: 18px;
        text-align: center;

        color: var(--text-color);
    }

    .productList .addNewProduct {
        height: 20px;
        width: 20px;

        border: 0;

        font-size: 32px;

        color: var(--text-color);
        background: none;

        cursor: pointer;

        transition: .3s;
    }
    .productList .addNewProduct:hover {
        color: var(--text-color-hover);
    }

    .editor .usernameTo {
        all: unset;

        margin: 20px 0px 40px 30px;

        resize: none;

        height: 28px;
        width: 970px;

        border: none;
        border-bottom: 1px solid rgb(150, 150, 150);

        font-family: var(--main-font);
        font-size: 22px;

        color: var(--text-color);
        background: transparent;
    }

    .editor .username {
        margin: 0px 0px 40px 30px;

        resize: none;

        height: 28px;
        width: 970px;

        border: none;

        font-family: var(--main-font);
        font-size: 22px;

        color: var(--text-color);
        background: transparent;
    }

    .buttons {
        min-width: 950px;
    }

    .buttons .sendButton {
        all: unset;

        margin-left: 30px;

        height: 30px;
        width: 200px;

        font-family: var(--sub-font);
        font-size: 16px;
        text-align: center;

        color: var(--text-color);
        background: var(--sub-color);

        cursor: pointer;

        transition: .3s;
    }
    .buttons .sendButton:hover {
        -webkit-transform: scale(1.1);
    }

    .buttons .saveButton {
        all: unset;

        margin-left: 30px;
        padding: 5px;

        height: 30px;
        width: 200px;

        font-family: var(--sub-font);
        font-size: 16px;
        text-align: center;

        color: var(--text-color);
        background: var(--sub-color);

        cursor: pointer;

        transition: .3s;
    }
    .buttons .saveButton:hover {
        -webkit-transform: scale(1.1);
    }

    .buttons .deleteButton {
        all: unset;

        margin-left: 30px;

        height: 30px;
        width: 200px;

        font-family: var(--sub-font);
        font-size: 16px;
        text-align: center;

        color: var(--text-color);
        background: var(--deleteButton-background);

        cursor: pointer;

        transition: .3s;
    }
    .buttons .deleteButton:hover {
        -webkit-transform: scale(1.1);
    }

    .buttons .selectOrderCategory {
        margin-left: 30px;

        height: 30px;
        width: 200px;

        border: none;

        font-family: var(--sub-font);
        font-size: 16px;
        text-align: center;

        color: var(--text-color);
        background: var(--sub-color);
    }
    .buttons .selectOrderCategory:focus {
        outline: none;
    }

    .mainSection .nothingSelected {
        overflow-y: hidden;
        overflow-x: hidden;

        height: 100%;
        width: 100%;

        font-family: var(--main-font);
        font-size: 18px;
        text-align: center;

        color: var(--text-color);
    }
    .nothingSelected .textAndImage {
        margin-top: 70px;
    }

</style>