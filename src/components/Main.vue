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
                <div class="order">
                    <div class="header">
                        <p class="number"> Заказ #[0000] </p>
                        <p class="date"> 7 июня 12:12 </p>
                    </div>
                    <div class="productsAndStatus">
                        <p class="products"> Товар #1, Товар #2, Товар #3, Товар #4, Товар #5,  Товар #6, Товар #7 </p>
                        <p class="status"> Ожидает одобрения </p>
                    </div>
                </div>
            </div>
            <button class="createOrderButton"> Новый заказ +</button>
        </div>

        <!-- Center, right side -->
        <div class="editor">
            <div class="title">
                <p> Заказ #[0000] </p>
            </div>
            <div class="productList">
                <div class="product">
                    <input class="name" placeholder="Название товара">
                    <input class="link" placeholder="Ссылка на товар">
                </div>
            </div>
            <button class="sendButton"> Оформить заказ</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Main',
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

        font-family: var(--sub-font);
        font-size: 14px;
    }

    .order .productsAndStatus {
        height: 60px;
        width: 270px;
    }
    .productsAndStatus .products {
        margin: 0;
        padding: 10px 20px 0px 20px;

        height: 14px;

        font-size: 12px;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;

        color: var(--text-color-hover);
    } 
    .productsAndStatus .status {
        padding: 10px 20px 0px 20px;

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
        color: var(--text-color);
    }
    .editor .title p {
        margin: 30px;

        font-family: var(--main-font);
        font-size: 18px;
    }

    .editor .productList {
        margin: 30px;

        height: fit-content;
        width: 100%;
    }
    .productList .product {
        overflow-x: hidden;

        min-height: 60px;
        width: 95%;

        background: var(--left-side-background);
    }
    .productList .product input {
        all: unset;

        margin: 20px;

        border-bottom: 1px solid white;

        font-family: var(--main-font);
        font-size: 16px;

        color: var(--text-color);
        background: transparent;
    }
    .productList .product .name {
        width: 500px;
    }
    .productList .product .link {
        width: 900px;
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


</style>