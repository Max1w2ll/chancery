<template>
    <div class="headerSection"> 
        <div class="ordersSection">
            <img class="threeLineIcon" src="../assets/icons/threeLineIcon.png">
            <p class="title"> Заказы </p>
        </div>

        <div class="userSection">
            <p class="userName"> Фамилия И.О. </p>
            <p class="logOut"> Выйти </p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Header',
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

    .ordersSection .title {
        margin: auto 10px auto 10px;

        height: 25px;

        font-family: var(--main-font);
        font-size: 18px;

        color: var(--text-color);

        cursor: pointer;
    }
    .ordersSection .title:hover {
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

    .userSection .userName {
        margin: auto 10px auto 10px;

        font-family: var(--main-font);
        font-size: 14px;

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