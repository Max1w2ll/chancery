<template>
    <div class="headerSection"> 
        <div class="menuSection">
            <p class="menuTitle"> Меню </p>
        </div>
        <div class="userSection">
            <p class="corpPortal" @click="goToPortal()"> Корпоративный портал </p>
        </div>
    </div>
</template>

<script>
// import axios from 'axios';  
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
        justify-content: center;

        display: flex;

        height: 50px;
        width: fit-content;

        background: var(--sub-color);
    }
    
    .userSection p {
        margin: 0;
        padding-right: 30px;
        padding-left: 30px;

        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);

        cursor: pointer;

        transition: all .3s ease-in-out;
    }
    .userSection p:hover {
        background: var(--text-color);
        color: var(--main-color);
    }
</style>