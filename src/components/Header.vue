<template>
    <div class="headerSection"> 
        <div class="ordersSection">
            <div id="navMenu" class="navMenu">
                <div class="header">
                    <img class="leftArrow" @click="closeNavMenu()" src="../assets/icons/leftArrow.png">
                    <p id="titleOrdersStatusList" class="titleOrdersStatusList"> {{selectedOrderStatusList}} </p>
                </div>
                <div class="ordersStatuses">
                    <p @click="changeSelectedOrderStatus($event);"> Мои заказы </p>
                    <p @click="changeSelectedOrderStatus($event);"> Необработанные </p>
                    <p @click="changeSelectedOrderStatus($event);"> Обрабатываются </p>
                    <p @click="changeSelectedOrderStatus($event);"> Обработаны </p>
                </div>
            </div>
            <img class="threeLineIcon" @click="openNavMenu()" src="../assets/icons/threeLineIcon.png">
            <p class="titleOrdersStatusList"> {{selectedOrderStatusList}} </p>
        </div>

        <div class="userSection">
            <p id="username" class="username"> {{userData.displayName}} ({{userData.role}})</p>
            <p class="logOut"> Выйти </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',

    props: {
        userData: {
            type: Object,
            default() { return {} }
        },
    },

    data() {
        return {
            selectedOrderStatusList: 'Мои заказы'
        }
    },

    methods: {
        openNavMenu() {
            document.getElementById('navMenu').style.width = '300px';
        },
        closeNavMenu() {
            document.getElementById('navMenu').style.width = '0px';
        },
        changeSelectedOrderStatus(event) {
            this.selectedOrderStatusList = event.path[0].innerText;
            this.closeNavMenu()
        }
    },
}

</script>

<style>
    .headerSection {
        display: flex;

        height: 50px;
        width: 100%;
        
        background: var(--main-color);
    }

    /* Left up corner */
    .headerSection .ordersSection {
        left: 0;

        display: flex;

        height: 50px;
        width: 300px;

        background: var(--sub-color);
    }

    .ordersSection .threeLineIcon {
        margin: 10px;

        height: 30px;
        width: 30px;

        cursor: pointer;
    }
    .ordersSection .threeLineIcon:hover {
        filter: invert(0.2);
    }

    .ordersSection .titleOrdersStatusList {
        margin: 15px 5px auto 5px;

        height: 25px;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);
    }

    .navMenu {
    top: 0;
    left: 0;

    z-index: 1;
    position: absolute;

    height: 100%;
    width: 0;
    
    background-color: var(--nav-menu-background);
    overflow-x: hidden;

    transition: 0.5s;
    }

    .navMenu .header {
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

    .header .titleOrdersStatusList {
        margin: 15px 5px auto 5px;

        height: 25px;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);
    }

    .navMenu .ordersStatuses {
        margin-left: 55px;

        font-family: var(--main-font);
        font-size: 16px;
        line-height: 20px;
        white-space: nowrap;

        color: var(--text-color);
    }

    .navMenu .ordersStatuses p {
        cursor: pointer;

        transition: .2s;
    }
    .navMenu .ordersStatuses p:hover {
        color: var(--text-color-hover);
    }


    /* Right up corner */
    .headerSection .userSection {
        right: 0;

        position: absolute;

        display: flex;

        height: 50px;
        width: 600px;

        background: var(--sub-color);
    }

    .userSection .username {
        margin: auto 10px auto 10px;

        font-family: var(--main-font);
        font-size: 16px;

        color: var(--text-color);
    }
    
    .userSection .logOut {
        right: 10px;

        margin: 12.5px 10px 12.5px 10px;

        position: absolute;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);

        cursor: pointer;
    }
    .userSection .logOut:hover {
        color: var(--text-color-hover);
    }
</style>