<template>
    <div class="mainSection">
        <!-- Filter menu -->
        <div id="filterMenu" class="filterMenu">
            <div class="header">
                <img class="leftArrow" @click="closeFilterMenu()" src="../assets/icons/leftArrow.png">
                <p id="menuTitle" class="menuTitle"> Меню </p>
            </div>
            <p class="filterTitle"> Фильтры поиска: </p>
            <div class="filterSettings"> 
                <div>
                    <p> Статус заказа: </p>
                    <select id="filterSettingStatus">
                        <option> Любой </option>
                        <option> Не обработан </option>
                        <option> Обрабатывается </option>
                        <option> Обработан </option>
                        <option> Выдан </option>
                    </select>
                </div>
                <div>
                    <p> Период создания: </p>
                    <table>
                        <tr>
                            <td> От: </td>
                            <td> <input id="filterSettingDateFrom" type="date"> </td>
                        </tr>
                        <tr>
                            <td> До: </td>
                            <td> <input id="filterSettingDateTo" type="date"> </td>
                        </tr>
                    </table>
                </div>
                <div>
                    <p> Сортировка по дате: </p>
                    <select class="filterSettingSortBy" id="filterSettingSortBy">
                        <option> Сначала новые </option>
                        <option> Сначала старые </option>
                    </select>
                </div>
                <button class="filterSearch" @click="closeFilterMenu(); getOrders();"> Поиск </button>
            </div>
        </div>
        <!-- Left side -->
        <div class="ordersSection">
            <div class="searchSection">
                <input id="filterSettingSearch" v-on:keyup.enter="getOrders();" placeholder="Введите название заказа" v-model="searchOrdersInput">
                <div class="searchButton">
                    <img src="../assets/icons/searchIcon.png" @click="getOrders();">
                </div>
            </div>
            <div class="ordersList">
                <div class="order" v-for="order in ordersList" :key="order" @click="selectedOrderId = order.id; getOrderByID();">
                    <div class="header">
                        <p class="number"> Номер заказа: {{order.id}} </p>
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
        </div>

        <!-- Center, right side -->
        <div class="editor" v-if="selectedOrderId != undefined">
            <div class="title">
                <p v-if="editing == false"> Новый товар </p>
                <p v-if="editing == true"> Номер заказа: {{order.id}} </p>
                <button class="closeEditorButton" @click="selectedOrderId = undefined"> ✖ </button>
            </div>
            <div id="productList" class="productList">
                <div class="product" v-for="product in order.positions" :key="product">
                    <input class="name" placeholder="Название товара" v-model="product.name">
                    <button class="deleteProduct" @click="deleteProduct($event);"> ✖ </button>
                    <div class="productInfo">
                        <input class="link" placeholder="Ссылка на товар" v-model="product.link">
                        <br>
                        <input class="desc" placeholder="Описание (не менее 4 символов)" v-model="product.description">
                        <br>
                        <input class="count" placeholder="Количество" v-model="product.count">
                        <input class="article" placeholder="Артикль" v-model="product.article">
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
            <p id="orderStatus" class="extendedInfo" v-if="productExist == true && editing == true"> Текущий статус: {{order.status}} </p>
            <p id="username"  class="extendedInfo" v-if="productExist == true && userData.role == 'globaladmin' && editing == true"> Пользователь: {{order.username}} </p>
            <p id="createdAt" class="extendedInfo" v-if="productExist == true && userData.role == 'globaladmin' && editing == true"> Создано в {{order.createdAt}} </p>
            <p id="updatedAt" class="extendedInfo" v-if="productExist == true && userData.role == 'globaladmin' && editing == true"> Последние обновление в {{order.updatedAt}} </p>
            <div class="buttons" v-if="productExist == true">
                <button class="saveButton"   v-if="editing == false" @click="createOrder()"> Сохранить новый заказ </button>
                <button class="sendButton"   v-if="editing == true"  @click="editOrderByID(); orderChangeStatus();"> Обновить </button>
                <button class="deleteButton" v-if="editing == true"  @click="deleteOrderByID();"> Удалить заказ </button>
                <select id="selectOrderStatus" class="selectOrderStatus" v-if="editing == true && userData.role == 'globaladmin'">
                    <option>Обрабатывается</option>
                    <option>Обработан</option>
                    <option>Выдан</option>
                </select>
            </div>
        </div>
        <div class="nothingSelected" v-if="selectedOrderId == undefined">
            <div class="textAndImage">
                <img src="../assets/icons/nothingSelected.png" width="64" height="64">
                <p> Заказ не выбран! </p>
                <p> Выберите товар из списка, или создайте новый. </p>
                <button class="createOrderButton" @click="newOrder();"> Новый заказ </button>
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
            getOrdersLink: 'https://auth.fisb/chancery/api/employee/orders/all',
            selectedOrderStatusList: 'Мои заказы',

            ordersList: () => [],

            // Get one order by ID
            getOrderByIdLink: 'https://auth.fisb/chancery/api/employee/orders/all/',

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
            this.order.usernameTo = this.userData.email;

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

        deleteProduct(event) {
            event.target.offsetParent.remove();
            // element.path[1].remove();
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
            let status = document.getElementById('filterSettingStatus').value
            let dateFrom = document.getElementById('filterSettingDateFrom').value
            let dateTo = document.getElementById('filterSettingDateTo').value
            let sortBy = document.getElementById('filterSettingSortBy').value
            let search = document.getElementById('filterSettingSearch').value

            console.log(status)
            console.log(dateFrom)
            console.log(dateTo)
            console.log(sortBy)
            console.log(search)

            if (status != 'Любой') {
                status = 'filter.status=%24eq%3A'+status;
            }
            else {
                status = '';
            }

            let dateForm;
            if (dateFrom.length == 0 && dateTo.length == 0) {
                dateForm = ''
            }
            else {
                dateForm = '&filter.createdAt=%24btw%3A' + dateFrom + '%2C' + dateTo; // '%2C' = ','
            }

            if (sortBy == "Сначала новые") {
                sortBy = '&sortBy=createdAt:DESC'
            }
            else {
                sortBy = '&sortBy=createdAt:ASC'
            }

            if (search.length > 0) {
                search = '&search='+search
            }
            else {
                search = '';
            }

            if (this.userData.role == 'globaladmin') {
                this.getOrdersLink = 'https://auth.fisb/chancery/api/manager/orders/all'
            }

            setTimeout(() => {
                axios.get(this.getOrdersLink+'?'+status+dateForm+sortBy+search, { withCredentials: true })
                .then((res) => {
                    console.log(res);
                    this.ordersList = res.data.data;
                    console.log(this.ordersList);
                });
            }, 500);
        },

        getOrderByID() {
            this.editing = true;

            if (this.userData.role == 'globaladmin') {
                this.getOrderByIdLink = 'https://auth.fisb/chancery/api/manager/orders/all/'
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
            axios.post('https://auth.fisb/chancery/api/employee/orders/all', this.getProducts(), { withCredentials: true })
            .then((res) => {
                console.log(res);
                this.getOrders();
            });
        },

        async editOrderByID() {
            try {
                await axios.patch(this.getOrderByIdLink+this.selectedOrderId, this.getProducts(), { withCredentials: true })
            }
            catch (e) {
                console.log(e.response.data.message);
                alert(e.response.data.message);
            }
        },

        deleteOrderByID() {
            if (this.userData.role == 'globaladmin') {
                this.getOrderByIdLink = 'https://auth.fisb/chancery/api/manager/orders/all/';
            }

            axios.delete(this.getOrderByIdLink+this.selectedOrderId, { withCredentials: true })
            .then((res) => {
                console.log(res);
                this.selectedOrderId = undefined;
                this.order = res.data;
                this.getOrders();
            });
        },

        async orderChangeStatus() {
            let selectedOrderStatus = document.getElementById('selectOrderStatus').value;
            let linkChangeOrderStatus = '';
            switch (selectedOrderStatus) {
                case "Обрабатывается":
                    linkChangeOrderStatus = 'https://auth.fisb/chancery/api/manager/orders/np';
                    break;
                case "Обработан":
                    linkChangeOrderStatus = 'https://auth.fisb/chancery/api/manager/orders/ip';
                    break;
                case "Выдан":
                    linkChangeOrderStatus = 'https://auth.fisb/chancery/api/manager/orders/p';
                    break;
            }

            try {
                await axios.patch(linkChangeOrderStatus, { "ids": [ this.selectedOrderId ] }, { withCredentials: true })
            }
            catch (e) {
                console.log(e.response.data.message);
                alert(e.response.data.message);
            }
        },

        //-------------------//
        //    Other stuff    //
        //-------------------//

        closeFilterMenu() { // openFilterMenu -> Header.vue
            document.getElementById('filterMenu').style.width = '0px';
        },
    },

    mounted() {
        setTimeout(() => {
            this.getOrders();
        }, 100);
           
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

        height: 915px;
        width: 100%;
        
        overflow-y: hidden;

        background: var(--main-background);
    }

    /*-------------------------*/
    /* Left side - filter menu */
    /*-------------------------*/
    .filterMenu {
        top: 0;
        left: 0;

        z-index: 1;
        position: absolute;

        height: 100%;
        width: 0;
        
        background-color: var(--filter-menu-background);
        overflow-x: hidden;

        white-space: nowrap;

        transition: 0.5s;
    }

    .filterMenu .header {
        display: flex;
        
        height: 50px;
        width: 300px;
    }

    .header .leftArrow {
        margin: 10px;

        height: 30px;
        width: 30px;

        cursor: pointer;
    }
    .header .leftArrow:hover {
        filter: invert(0.2);
    }

    .filterTitle {
        padding-left: 30px;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);
    }

    .filterSettings {
        margin-top: 25px;
        padding-left: 30px;
        padding-right: 30px;

        font-family: var(--main-font);
        font-size: 16px;

        color: var(--text-color);
    }

    .filterSearch {
        all: unset;
        padding: 5px;

        height: 30px;
        width: -webkit-fill-available;

        text-align: center;
        font-family: var(--sub-font);

        color: var(--text-color);
        background: var(--sub-color);

        cursor: pointer;
        transition: .3s;
    }
    .filterSearch:hover {
        -webkit-transform: scale(1.1);
    }

    .filterMenu select {
        border: none;
        border-bottom: 1px solid #969696;

        font-family: var(--main-font);

        color: var(--text-color);
        background: var(--filter-menu-background);
    }

    .filterMenu input {
        border: none;
        border-bottom: 1px solid #969696;

        font-family: var(--main-font);

        color: var(--text-color);
        background: var(--filter-menu-background);
    }

    .filterSettings div {
        margin-bottom: 25px;
    }

    .filterSettings select {
        height: 30px;
        font-family: var(--main-font);
    }

    /*-----------*/
    /* Left side */
    /*-----------*/

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

        height: 875px;
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

    .createOrderButton {
        all: unset;

        padding: 5px;

        height: 30px;
        width: 250px;

        font-family: var(--sub-font);

        color: var(--text-color);
        background: var(--sub-color);

        cursor: pointer;

        transition: .3s;
    }
    .createOrderButton:hover {
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
    .productList .product input {
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

    .editor .extendedInfo {
        margin: 0px 0px 40px 30px;

        resize: none;

        height: 10px;
        width: 970px;

        border: none;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);
        background: transparent;
    }

    .editor .createdAt {
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

    .editor .updatedAt {
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
        padding-bottom: 30px;

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

    .buttons .selectOrderStatus {
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
    .buttons .selectOrderStatus:focus {
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