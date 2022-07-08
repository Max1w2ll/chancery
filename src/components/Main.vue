<template>
    <div class="mainSection">
        <!-- Left side -->
        <div class="ordersSection">
            <div class="searchSection">
                <input placeholder="Введите название заказа">
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
            </div>
            <button class="createOrderButton"> Новый заказ + </button>
        </div>

        <!-- Center, right side -->
        <div class="editor" v-if="selectedOrderId != undefined">
            <div class="title">
                <p> Заказ ID: {{order.id}} </p>
                <button class="closeEditorButton" @click="selectedOrderId = undefined"> ✖ </button>
            </div>
            <div class="productList">
                <div class="product" v-for="product in order.positions" :key="product">
                    <textarea class="name" placeholder="Название товара" v-model="product.name"></textarea>
                    <div class="productInfo">
                        <textarea class="link"    placeholder="Ссылка на товар" v-model="product.link"></textarea>
                        <br>
                        <textarea class="desc"    placeholder="Описание"        v-model="product.description"></textarea>
                        <br>
                        <textarea class="count"   placeholder="Количество"      v-model="product.count"></textarea>
                        <textarea class="article" placeholder="Артикль"         v-model="product.article"></textarea>
                    </div>
                </div>
            </div>
            <textarea id="usernameTo" class="usernameTo" placeholder="Для кого заказ (если не будет заполнено, будет введено ваше имя)"></textarea>
            <div class="buttons">
                <button class="sendButton" @click="EditOrderByID()"> Обновить </button>
                <button class="deleteButton" @click="DeleteOrderByID();"> Удалить заказ </button>
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
    
    data() {
        return {
            // Get all orders
            getOrdersLink: 'http://localhost:3001/api/user/orders',

            ordersList: () => [],

            // Get one order by ID
            getOrderByIdLink: 'http://localhost:3001/api/user/orders/',

            selectedOrderId: undefined,
            order: () => [],
        }
    },

    methods: {
        getOrders() {
            axios.get(this.getOrdersLink, { withCredentials: true })
            .then((res) => {
                this.ordersList = res.data.orders;
                console.log(this.ordersList);
            });
        },

        getOrderByID() {
            axios.get(this.getOrderByIdLink+this.selectedOrderId, { withCredentials: true })
            .then((res) => {
                this.order = res.data;
                console.log(res);
            });
        },

        EditOrderByID() {
            let positions = [];
            positions.name = "positions"

            // We count the number of products in the order
            let productList = document.getElementsByClassName('product'); 
            
            // Loop through the elements and take the values from each product elemnt
            for (let productCounter = 0; productCounter < productList.length; productCounter++) {
                let product = {
                    "name":        productList[productCounter].childNodes[0].value,                // Product name
                    "link":        productList[productCounter].childNodes[1].childNodes[0].value,  // Product link
                    "description": productList[productCounter].childNodes[1].childNodes[2].value,  // Product description
                    "article":     productList[productCounter].childNodes[1].childNodes[4].value,  // Product count
                    "count":       productList[productCounter].childNodes[1].childNodes[5].value   // Product count
                }
                positions.push(product);
            }

            let usernameTo = document.getElementById('usernameTo').value;
            if (usernameTo == "") {
                usernameTo = document.getElementById('username').innerHTML;
            }

            let data = {positions, usernameTo};
            console.log(JSON.stringify(data));

            axios.patch(this.getOrderByIdLink+this.selectedOrderId, JSON.stringify(data), { withCredentials: true })
            .then((res) => {
                console.log(res);
            });
        },

        DeleteOrderByID() {
            axios.delete(this.getOrderByIdLink+this.selectedOrderId, { withCredentials: true })
            .then((res) => {
                this.selectedOrderId = undefined;

                this.order = res.data;
                console.log(res);

                this.getOrders();
            });
        }
    },

    mounted() {
        this.getOrders();
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

        overflow-x: hidden;

        min-height: 60px;
        width: 95%;

        background: var(--left-side-background);
    }
    .productList .product .productInfo{
        margin-left: 50px;
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
        width: 900px;
    }
    .productList .product .desc {
        width: 900px;
    }
    .productList .product .count {
        width: 100px;
    }
    .productList .product .article {
        width: 100px;
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

    .editor .sendButton {
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
    .editor .sendButton:hover {
        -webkit-transform: scale(1.1);
    }

    .editor .deleteButton {
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
    .editor .deleteButton:hover {
        -webkit-transform: scale(1.1);
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