<template>
    <div class="mainSection">
        <!-- Filter menu -->
        <div id="filterMenu" class="filterMenu">
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
                <button class="filterSearch" @click="getOrders();"> Поиск </button>
                <div id="headerOrderButtons" class="orderButtons">
                    <button class="deleteButton" @click="deleteOrders()"> Удалить </button>
                    <button class="sendButton"   @click="selectAllOrders()"> Выбрать всё </button>
                    <button class="sendButton"   @click="ordersChangeStatus()" v-if="userData.role == 'globaladmin'"> Поменять статус </button>
                    <select id="headerSelectOrderStatus" class="selectOrderStatus" v-if="userData.role == 'globaladmin'">
                        <option>Обрабатывается</option>
                        <option>Обработан</option>
                        <option>Выдан</option>
                    </select>
                    <button class="sendButton"  @click="bulkOrder()"> Сводный заказ </button>
                </div>
            </div>
        </div>
        <!-- Left side -->
        <div class="ordersSection">
            <div class="searchSection">
                <input id="filterSettingSearch" v-on:keyup.enter="getOrders();" placeholder="Введите название заказа" v-model="searchOrdersInput">
                <div class="searchButton">
                    <img id="searchButtonIcon" src="../assets/icons/searchIcon.png" @click="getOrders();">
                </div>
            </div>
            <div class="ordersList">
                <div class="order" v-for="order in ordersList" :key="order" @click="selectedOrderId = order.id; getOrderByID();">
                    <div class="header">
                        <input class="selectOrderCheckbox" type="checkbox" @click="selectOrder($event);">
                        <p class="usernameTo">{{order.username}} </p>
                        <!-- <p class="date"> {{order.createdAt.slice(0,10).replace(/-/g,".")}} </p> -->
                        <p class="number"> № {{order.id}} </p>
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

        <!-- Right side -->
        <div class="editor" v-if="selectedOrderId != undefined">
            <div class="title">
                <p v-if="editing == false"> Новый товар </p>
                <p v-if="editing == true"> Номер заказа: {{order.id}} </p>
                <img class="closeEditorButton" src="icons/close.png" @click="selectedOrderId = undefined; ModalWindows.deleteModals();"/>
            </div>
            <div id="productList" class="productList">
                <form id="test" class="product" v-for="product in order.positions" :key="product">
                    <input class="name" required minlength="4" maxlength="256" placeholder="Название товара" v-model="product.name">
                    <img class="deleteProduct" src="icons/close.png" @click="deleteProduct($event);"/>
                    <div class="productInfo">
                        <input class="link" type="url" required minlength="4" maxlength="256" placeholder="Ссылка на товар" v-model="product.link">
                        <br>
                        <input class="desc" required minlength="4" maxlength="512" placeholder="Описание (не менее 4 символов)" v-model="product.description">
                        <br>
                        <input class="count" required type="number" min="1" max="1000" placeholder="Количество" v-model="product.count">
                        <input class="article" required type="number" minlength="1" maxlength="20" placeholder="Артикль" v-model="product.article">
                    </div>
                </form>
                <div class="noProducts" v-if="productExist == false"> 
                    <img src="../assets/icons/noProducts.png" width="52" height="52">
                    <p> Товары отсутствуют! </p> 
                    <p> Создайте новый, нажав на + </p>
                </div>
                <img class="addNewProduct" src="../assets/icons/add.png" @click="addNewProduct();"/>
            </div>
            <textarea id="usernameTo" class="usernameTo" v-if="productExist == true" placeholder="Для кого заказ" v-model="order.usernameTo"/>
            <p id="orderStatus" class="extendedInfo" v-if="productExist == true && editing == true"> Текущий статус: {{order.status}} </p>
            <p id="username"  class="extendedInfo" v-if="productExist == true && userData.role == 'globaladmin' && editing == true"> Пользователь: {{order.username}} </p>
            <p id="createdAt" class="extendedInfo" v-if="productExist == true && userData.role == 'globaladmin' && editing == true"> Создано в {{order.createdAt}} </p>
            <p id="updatedAt" class="extendedInfo" v-if="productExist == true && userData.role == 'globaladmin' && editing == true"> Последние обновление в {{order.updatedAt}} </p>
            <div class="buttons" v-if="productExist == true">
                <button class="saveButton" type="submit" form="test" v-if="editing == false" @click.prevent="createOrder()"> Сохранить новый заказ </button>
                <button class="sendButton"   v-if="editing == true"  @click="editOrderByID();"> Обновить </button>
                <button class="sendButton"   v-if="editing == true && userData.role == 'globaladmin'"  @click="changeOrderStatus();"> Поменять статус </button>
                <button class="deleteButton" v-if="editing == true"  @click="deleteOrderByID();"> Удалить заказ </button>
                <select id="selectOrderStatus" class="selectOrderStatus" v-if="editing == true && userData.role == 'globaladmin'">
                    <option>Обрабатывается</option>
                    <option>Обработан</option>
                    <option>Выдан</option>
                </select>
            </div>
        </div>
        
        <div class="bulkOrder" v-if="selectedOrderId == undefined && bulk == true">
            <div class="title">
                <p> Сводный заказ </p>
                <img class="closeEditorButton" src="icons/close.png" @click="bulk = false;"/>
            </div>
            <div class="content">
                <table>
                    <tr>
                        <th> № п/п </th>
                        <th> Номенклатура </th>
                        <th> Количество </th>
                        <th> Ссылка на товар </th>
                        <th> Кому требуется (Фамилия и подразделение) </th>
                        <th> Обоснование (комментарии) </th>
                    </tr>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th> 
                    </tr>
                </table>
            </div>
        </div> 

        <div class="nothingSelected" v-if="selectedOrderId == undefined && bulk == false">
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
import ModalWindows from  '@/components/ModalWindows.js';

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
            bulk: false, // If we select bulk order option
            productExist: false,

            searchOrdersInput: '',

            ModalWindows
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

            // console.log(status)
            // console.log(dateFrom)
            // console.log(dateTo)
            // console.log(sortBy)
            // console.log(search)

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
                    this.ordersList = res.data.data;
                    document.getElementById("headerOrderButtons").style.display = "none";
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
                this.order = res.data;

                if (this.order.status == "Не обработан") {
                    this.editing = true;
                }

                // Removing and replace extra characters from strings
                this.order.createdAt = this.order.createdAt.replace("-", ".");
                this.order.createdAt = this.order.createdAt.replace("-", ".");
                this.order.createdAt = this.order.createdAt.replace("T", " ");
                this.order.createdAt = this.order.createdAt.replace(".000Z", "");                

                this.order.updatedAt = this.order.updatedAt.replace("-", ".");
                this.order.updatedAt = this.order.updatedAt.replace("-", ".");
                this.order.updatedAt = this.order.updatedAt.replace("T", " ");
                this.order.updatedAt = this.order.updatedAt.replace(".000Z", "");   
            });
        },

        checkValidation() {
            let products = document.getElementsByClassName("product");
            for(let i = 0; i < products.length; i++) {
                if(!(products[i].checkValidity())) {
                    products[i].reportValidity();
                    return false;
                }
            }
            return true;
        },
    
        async createOrder() {
            if (await this.checkValidation()) {
                try {
                    await axios.post('https://auth.fisb/chancery/api/employee/orders/all', this.getProducts(), { withCredentials: true })
                    .then((res) => {
                        console.log(res);
                        ModalWindows.showModal("Заказ создан!", true);
                        this.selectedOrderId = undefined;
                        this.getOrders();
                    });
                }
                catch (e) {
                    ModalWindows.showModal(e.response.data.message, false);
                }
            }
        },

        async editOrderByID() {
            if (await this.checkValidation()) {
                try {
                    await axios.patch(this.getOrderByIdLink+this.selectedOrderId, this.getProducts(), { withCredentials: true })
                    .then(() => {
                        ModalWindows.showModal("Заказ редактирован!", true);
                        this.getOrders();
                    })
                }
                catch (e) {
                    // console.log(e.response.data.message);
                    ModalWindows.showModal(e.response.data.message, false);
                }
            }
        },

        async deleteOrderByID() {
            if (this.userData.role == 'globaladmin') {
                this.getOrderByIdLink = 'https://auth.fisb/chancery/api/manager/orders/all/';
            }

            try {
                await axios.delete(this.getOrderByIdLink+this.selectedOrderId, { withCredentials: true })
                .then((res) => {
                    ModalWindows.showModal("Заказ удалён!", true);
                    this.selectedOrderId = undefined;
                    this.order = res.data;
                    this.getOrders();
                });
            }
            catch (e) {
                ModalWindows.showModal(e.response.data.message, false);
            }
        },

        async deleteOrders() {
            console.log(this.userData.selectedOrders);
            try {
                await axios.delete('https://auth.fisb/chancery/api/manager/orders/delete-several', { "data": { "ids": this.userData.selectedOrders } }, { withCredentials: true })
                .then(() => {
                    ModalWindows.showModal("Заказы удалены!", true)
                    this.userData.selectedOrders = [];
                    this.getOrders();
                })
            }
            catch (e) {
                ModalWindows.showModal(e.response.data.message, false);
            }
        },

        async changeOrderStatus() {
            if (this.checkValidation()) {
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
                    .then(() => {
                        ModalWindows.showModal("Статус заказа обновлён!", true);
                        this.getOrders();
                    })
                }
                catch (e) {
                    ModalWindows.showModal(e.response.data.message, false);
                }
            }
        },

        async ordersChangeStatus() {
            let selectedOrderStatus = document.getElementById('headerSelectOrderStatus').value;
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
                await axios.patch(linkChangeOrderStatus, { "ids": this.userData.selectedOrders }, { withCredentials: true })
                .then(() => {
                    document.getElementById("searchButtonIcon").click();
                    ModalWindows.showModal("Статус товаров сменён!", true);
                })
            }
            catch (e) {
                ModalWindows.showModal(e.response.data.message, false);
            }
        },

        async bulkOrder() {
            try {
                this.bulk = true;
                await axios.patch('https://auth.fisb/chancery/api/manager/orders/np', { "ids": this.userData.selectedOrders }, { withCredentials: true })
                .then(async () => {
                    try {
                        await axios.get('https://auth.fisb/chancery/api/manager/orders/bulk')
                        .then((res) => {
                            console.log(res);
                        })
                    }
                    catch (e) {
                        modalWindows.showModal(e.response.data.message, false);
                    }
                })
            }
            catch (e) {
                try {
                    await axios.get('https://auth.fisb/chancery/api/manager/orders/bulk')
                    .then((res) => {
                        console.log(res);
                    })
                }
                catch (e) {
                    modalWindows.showModal(e.response.data.message, false);
                }
            }
        },

        //-------------------//
        //    Other stuff    //
        //-------------------//

        selectOrder(event) {
            event.stopPropagation(); // Prevent to call getOrderByID method

            let orders = document.getElementsByClassName("selectOrderCheckbox");

            for (let i = 0; i < orders.length; i++) {
                let orderCheckbox = orders[i].parentNode.children[0]; 
                let orderId = Number(orders[i].parentNode.children[2].textContent.substring(3)); 

                if (orderCheckbox.checked) { // is order checkbox is selected? 
                    if (!(this.userData.selectedOrders.includes(orderId))) { // orderId exist in selected orders already?
                        this.userData.selectedOrders.push(orderId) // User selected order. Added this order to array
                    }
                }
                else {
                    if (this.userData.selectedOrders.includes(orderId)) { // Same thing but unselecting order
                        for (let i = 0; i < this.userData.selectedOrders.length; i++) {
                            if (this.userData.selectedOrders[i] == orderId) {
                                this.userData.selectedOrders.splice(i, 1); // We already have this Id. User unselected this order. Deleting from array.
                            }
                        }
                    }
                }
            }      

            if (this.userData.selectedOrders.length > 0) { // Show header panel if we selected at least one order
                document.getElementById("headerOrderButtons").style.display = "grid";
            }
            else {
                document.getElementById("headerOrderButtons").style.display = "none";
            }
        },

        selectAllOrders() {
            let orders = document.getElementsByClassName("selectOrderCheckbox");
            let allSelected = true;

            for (let i = 0; i < orders.length; i++) {
                if(!(orders[i].checked)) { // At least one order not selected?
                    allSelected = false;
                    break;
                }   
            }

            this.userData.selectedOrders = [];

            for (let i = 0; i < orders.length; i++) {
                let orderId = Number(orders[i].parentNode.children[2].textContent.substring(3));

                orders[i].checked = allSelected ? false : true; // If all orders already been selected we unselect them. Otherwise we select them
                if (!allSelected) {
                    this.userData.selectedOrders.push(orderId);
                }
            }

            if (this.userData.selectedOrders.length > 0) { // Show header panel if we selected at least one order
                document.getElementById("headerOrderButtons").style.display = "grid";
            }
            else {
                document.getElementById("headerOrderButtons").style.display = "none";
            }
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

        height: 100%;
        min-width: 300px;
        
        background-color: var(--main-color);
        overflow-x: hidden;

        white-space: nowrap;

        transition: 0.3s;
        transition-timing-function: ease-in-out;
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
        font-family: var(--main-font);

        border: 1px solid #fff;

        color: var(--main-color);
        background: var(--text-color);

        cursor: pointer;
        transition: .3s;
    }
    .filterSearch:hover {
        color: var(--text-color);
        background: var(--main-color);
    }

    .filterMenu select {
        border: none;
        border-bottom: 1px solid var(--text-color);

        font-family: var(--main-font);

        color: var(--text-color);
        background: var(--main-color);
    }

    .filterMenu input {
        border: none;
        border-bottom: 1px solid #969696;

        font-family: var(--main-font);

        color: var(--text-color);
        background: var(--main-color);
    }

    .filterSettings div {
        margin-bottom: 25px;
    }

    .filterSettings select {
        height: 30px;
        font-family: var(--main-font);
    }

    .orderButtons {
        padding-top: 10px;

        justify-content: center;

        display: none;
    }

    .orderButtons button, .orderButtons select {
        margin: 8px;
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
        width: 298px;

        border: 1px solid rgba(39,103,201,.2);

        color: var(--main-color);
    }

    .searchSection input {
        all: unset;

        margin: 10px;

        width: 240px;
        height: 20px;

        border-bottom: 1px solid var(--main-color);

        font-family: var(--main-font);
        font-size: 14px;

        color: var(--main-color);
        background: transparent;
    }
    .searchSection input::placeholder {
        color: var(--main-color);
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

        border: 1px solid rgba(39,103,201,.2);

        color: var(--main-color);
        background: #fff;

        cursor: pointer;

        transition: .3s;
    }

    .order .header {
        display: flex;

        height: 40px;
        width: 270px;

        color: var(--text-color);
        background: var(--sub-color);
    }
    .order .header .date{
        margin-top: 17px;

        font-size: 10px;
    }
    .order .header p {
        margin: auto 0;

        height: 20px;

        font-family: var(--main-font);
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .order .header .number {
        width: 50px;
    }
    .order .header input {
        margin-left: 5px;
        width: 15px
    }
    .order .header .usernameTo {
        padding: 0px 0px 0px 5px;
        width: 180px;
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
        width: 215px;

        overflow-x: hidden;
        font-size: 12px;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;

        color: var(--main-color);
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

        color: var(--main-color);
    }
    .noOrders p {
        margin-top: 5px;
    }

    .createOrderButton {
        all: unset;

        padding: 5px;

        height: 30px;
        width: 250px;

        border: 1px solid;

        font-family: var(--main-font);

        color: var(--text-color);
        background: var(--sub-color);

        cursor: pointer;

        transition: .3s;
    }
    .createOrderButton:hover {
        color: var(--sub-color);
        background: var(--text-color);
    }

    /*---------------------*/
    /* Center, right side */
    /*--------------------*/

    .mainSection .editor, .mainSection .bulkOrder {
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

    .mainSection .bulkOrder .content {
        justify-content: center;
        display : flex;
    }

    .editor .title, .bulkOrder .title {
        display: flex;

        color: var(--main-color);
    }
    .editor .title .closeEditorButton, .bulkOrder .title .closeEditorButton {
        margin-top: 20px;
        right: 30px;

        position: absolute;
    
        height: 30px;
        width: 30px;

        border: 0;

        cursor: pointer;

        transition: 0.3s;
    }
    .editor .title p, .bulkOrder .title p {
        margin: 30px;

        font-family: var(--main-font);
        font-size: 24px;

        color: var(--main-color);
    }

    .bulkOrder .content table {
        width: 1200px;

        font-family: var(--main-font);

        color: var(--main-color);
    }

    .bulkOrder .content tr {
        height: 30px;
    }

    .bulkOrder .content th {
        background-color: #fff;

        border: 1px solid rgba(39,103,201,.2);
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

        background-color: #fff;
        border: 1px solid rgba(39,103,201,.2);
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

        cursor: pointer;

        transition: 0.3s;
    }
    .productList .product input {
        all: unset;

        margin: 20px 0px 0px 20px;

        resize: none;

        height: 22px;

        border: none;
        border-bottom: 1px solid rgb(150, 150, 150);

        font-family: var(--main-font);
        font-size: 16px;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;

        color: var(--main-color);
        background: transparent;
    }
    .productList .product input::placeholder {
        color: var(--main-color);
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

        color: var(--main-color);
    }

    .productList .addNewProduct {
        height: 30px;
        width: 30px;

        border: 0;

        cursor: pointer;

        transition: 0.3s;
    }

    .editor .usernameTo {
        all: unset;

        margin: 20px 0px 40px 30px;

        resize: none;

        height: 28px;
        width: 970px;

        border: none;
        border-bottom: 1px solid rgb(150, 150, 150);

        overflow-y: hidden;
        font-family: var(--main-font);
        font-size: 22px;

        color: var(--main-color);
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

        color: var(--main-color);
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

    .sendButton {
        all: unset;

        margin-left: 30px;

        height: 30px;
        width: 200px;

        border: 1px solid;

        font-family: var(--main-font);
        font-size: 15px;
        text-align: center;

        color: var(--text-color);
        background: var(--sub-color);

        cursor: pointer;

        transition: .3s;
    }
    .sendButton:hover {
        color: var(--main-color);
        background: var(--main-background);
    }

    .buttons .saveButton {
        all: unset;

        margin-left: 30px;
        padding: 5px;

        height: 30px;
        width: 200px;

        font-family: var(--main-font);
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

    .deleteButton {
        all: unset;

        margin-left: 30px;

        height: 30px;
        width: 200px;

        border: 1px solid;

        font-family: var(--main-font);
        font-size: 15px;
        text-align: center;

        color: var(--text-color);
        background: var(--deleteButton-background);

        cursor: pointer;

        transition: .3s;
    }
    .deleteButton:hover {
        color: var(--deleteButton-background);
        background: var(--text-color);
    }

    .selectOrderStatus {
        transform: translateY(1px);
        margin-left: 30px;

        height: 32px;
        width: 200px;

        border: 1px solid white;

        font-family: var(--main-font);
        font-size: 16px;
        text-align: center;

        color: var(--text-color);
        background: var(--sub-color);
    }
    .selectOrderStatus:focus {
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

        color: var(--main-color);
    }
    .nothingSelected .textAndImage {
        margin-top: 70px;
    }

    /*-------*/
    /* Other */
    /*-------*/

    .modalWindow {
        right: 16px;
        top: 16px;

        padding: 8px;

        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;

        min-height: 48px;
        width: 384px;

        font-size: 17px;
        font-family: var(--main-font);

        color: var(--text-color);
        opacity: 1;

        z-index: 2000;

        animation-duration: 0.3s;
        animation-name: modalOpen
    }
    @keyframes modalOpen {
        from {
            opacity: 0;
            transform: translateY(100%);
        }
        to {
            opacity: 1;
            transform: translateY(0%);
        }
    }

    .modalWindow.remove {
        opacity: 0;
        animation-name: modalClose
    }
    @keyframes modalClose {
        from {
            opacity: 1;
            transform: translateY(0%);
        }
        to {
            opacity: 0;
            transform: translateY(100%);
        }
    }

    .modalWindow.Error {
        background: var(--error-background);
    }

    .modalWindow.Success {
        background: var(--success-background);
    }

</style>