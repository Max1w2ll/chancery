<template>
    <div class="headerSection"> 
        <div class="menuSection">
            <img class="threeLineIcon" @click="openFilterMenu()" src="../assets/icons/threeLineIcon.png">
            <p class="menuTitle"> Меню </p>
        </div>
        <div id="headerOrderButtons" class="orderButtons">
            <button class="deleteButton" @click="deleteOrders()" style="width: 100px;"> Удалить </button>
            <button class="sendButton"   @click="selectAllOrders()"> Выбрать всё </button>
            <button class="sendButton"   @click="ordersChangeStatus()" v-if="userData.role == 'globaladmin'"> Поменять статус </button>
            <select id="headerSelectOrderStatus" class="selectOrderStatus" v-if="userData.role == 'globaladmin'">
                <option>Обрабатывается</option>
                <option>Обработан</option>
                <option>Выдан</option>
            </select>
        </div>
        <div class="userSection">
            <p class="corpPortal" @click="goToPortal()"> Корпоративный портал </p>
            <p class="logOut" @click="logOut()"> Выйти </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';  

export default {
    name: 'Header',

    props: {
        userData: {
            type: Object,
            default() { return {} }
        },
    },

    methods: {
        openFilterMenu() {
            document.getElementById('filterMenu').style.width = '300px';
        },

        async deleteOrders() {
            console.log(this.userData.selectedOrders);
            try {
                await axios.delete('https://auth.fisb/chancery/api/manager/orders/delete-several', { "ids": this.userData.selectedOrders }, { withCredentials: true })
                .then((res) => {
                    console.log(res);
                })
            }
            catch (e) {
                console.log(e.response);
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
                document.getElementById("headerOrderButtons").style.display = "block";
            }
            else {
                document.getElementById("headerOrderButtons").style.display = "none";
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
                .then((res) => {
                    console.log(res);
                })
            }
            catch (e) {
                console.log(e.response);
            }
        },

        goToPortal() {
            location.href = "https://auth.fisb/";
        },

        logOut() {
            axios.get('https://auth.fisb/auth/api/logout')
            .then((res) => {
                console.log(res);
                location.reload();
            });
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
    .headerSection .menuSection {
        left: 0;

        display: flex;

        height: 50px;
        width: 300px;

        background: var(--sub-color);
    }

    .menuSection .threeLineIcon {
        margin: 10px;

        height: 30px;
        width: 30px;

        cursor: pointer;
    }
    .menuSection .threeLineIcon:hover {
        filter: invert(0.2);
    }

    .menuSection .menuTitle {
        margin: 15px 5px auto 5px;

        height: 25px;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);
    }

    .header .menuTitle {
        margin: 15px 5px auto 5px;

        height: 25px;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);
    }

    .headerSection .orderButtons {
        display: none;
    }

    .orderButtons button, .orderButtons select {
        margin: 9px;
    }

    /* Right up corner */
    .headerSection .userSection {
        right: 0;

        position: absolute;

        display: flex;

        height: 50px;
        width: 400px;

        background: var(--sub-color);
    }

    .userSection .username {
        margin: auto 10px auto 10px;

        font-family: var(--main-font);
        font-size: 16px;

        color: var(--text-color);
    }
    
    .userSection p {
        margin: 12.5px 10px 12.5px 10px;

        position: absolute;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);

        cursor: pointer;
    }
    .userSection .corpPortal {
        right: 90px;
    }
    .userSection .logOut {
        right: 10px;
    }
    .userSection p:hover {
        color: var(--text-color-hover);
    }
</style>