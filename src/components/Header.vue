<template>
    <div class="headerSection"> 
        <div class="menuSection">
            <p class="menuTitle"> Меню </p>
        </div>
        <div class="userSection">
            <p class="corpPortal" @click="goToPortal()"> Корпоративный портал </p>
            <p class="logOut" @click="logOut()"> Выйти </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';  
import modalWindows from  '@/components/ModalWindows.js';

export default {
    name: 'Header',

    data() {
        return {
            modalWindows,
        }
    },

    props: {
        userData: {
            type: Object,
            default() { return {} }
        },
    },

    methods: {
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
        margin: 15px 5px auto 30px;

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