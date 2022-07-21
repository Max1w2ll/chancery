<template>
  <Header
    :userData="userData"
  />
  <Main
    :userData="userData"
  />
  <Footer/>
</template>

<script>
import axios from 'axios';

import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Main,
    Footer
  },

  data() {
    return {
      // Authentication
      authLink: 'http://localhost:3000/auth/ldapauth',

      username: "",
      password: "",

      // User information
      getUserLink: 'http://localhost:3001/user',

      userData: {
        department: 'department',
        displayName: 'Фамилия Имя Отчество',
        email: 'email',
        role: 'role',
        title: 'title',
      },
    }
  },

  methods: {
    logIn() {
      axios.post(this.authLink, 
      {
          "username": this.username,
          "password": this.password
      },
      {
          'Content-Type': 'application/json',
          withCredentials: true 
      })
      .then(res => (console.log(res)));
    },
  },

  mounted() {  
    axios.get(this.getUserLink, { withCredentials: true })
    .then((res) => {
        this.userData.department = res.data.department;
        this.userData.displayName = res.data.displayName;
        this.userData.email = res.data.email;
        this.userData.role = res.data.role;
        this.userData.title = res.data.title;
    }, 
    res => {
      if (res.response.status == 401) {
        let darkLayer = document.createElement('div');
        darkLayer.className = 'darkLayer';
        document.body.appendChild(darkLayer);

        let popUpLoginSection = document.createElement('div');
        popUpLoginSection.className = 'popUpLoginSection';
        darkLayer.appendChild(popUpLoginSection);

        let popUpLoginUserImg = document.createElement('img');
        popUpLoginUserImg.className = 'popUpLoginUserImg';
        popUpLoginUserImg.src =  "../userIcon.png";
        popUpLoginSection.appendChild(popUpLoginUserImg);

        let popUpLoginTitle = document.createElement('p');
        popUpLoginTitle.className = 'popUpLoginTitle';
        popUpLoginTitle.innerText = 'Вы не авторизованы \n Введите имя пользователя и пароль';
        popUpLoginSection.appendChild(popUpLoginTitle);

        let popUpLoginInputsSection = document.createElement('div');
        popUpLoginInputsSection.className = 'popUpLoginInputsSection';
        popUpLoginSection.appendChild(popUpLoginInputsSection);

        let popUpLoginInputLogin = document.createElement('input');
        popUpLoginInputLogin.placeholder = 'Имя пользователя';
        popUpLoginInputsSection.appendChild(popUpLoginInputLogin);

        let popUpLoginInputPassword = document.createElement('input');
        popUpLoginInputPassword.type = 'password';
        popUpLoginInputPassword.placeholder = 'Пароль';
        popUpLoginInputsSection.appendChild(popUpLoginInputPassword);

        let popUpLoginSumbit = document.createElement('button');
        popUpLoginSumbit.className = 'popUpLoginSumbit';
        popUpLoginSumbit.innerText = 'Войти';
        popUpLoginInputsSection.appendChild(popUpLoginSumbit);
        popUpLoginSumbit.onclick = () => {
          this.username = popUpLoginInputLogin.value;
          this.password = popUpLoginInputPassword.value;
          this.logIn();
          window.setTimeout(function() {
            window.location.reload();
          }, 1000);
        }
      }
      else (alert(res));
    });
  }

}
</script>

<style>
  @font-face {
    font-family: "Roboto";
    src: url("assets/fonts/roboto/Roboto-Regular.ttf");
  }

  :root {
    --main-font: "Roboto";
    --sub-font: monospace;
    --text-color: #ffffff;
    --text-color-hover: #d2d2d2;
    --text-color-active: #999999;

    --main-color: #273a52;
    --sub-color: #324a6a;
    --main-background: #0e1722;
    --sub-background: #172230;

    --left-side-background: #060a10;
    --left-side-scrollbar-track: #273a52;
    --left-side-scrollbar-thumb: #9b9b9b;

    --nav-menu-background: #18273a;

    --deleteButton-background: #781c1c;
  }

  body {
    margin: 0;

    overflow-x: hidden;

    background: var(--main-background);
  }

  .darkLayer { 
    top: 0;

    position: absolute;
    display: flex;
    align-items: center;  

    width: 100%;
    height: 100%;

    background: var(--main-background);

    z-index: 1;
  }

  .popUpLoginSection {
    margin: auto;

    display: table-cell;
    vertical-align: middle;

    width: 450px;
    height: 450px;

    background: var(--sub-color);

    font-family: var(--main-font);
    font-size: 18px;
    text-align: center;

    color: var(--text-color);
  }

  .popUpLoginUserImg {
    margin-top: 30px;

    width: 96px;
    height: 96px;
  }

  .popUpLoginTitle {
    margin-top: 0px;
    margin-bottom: 25px;

    line-height: 28px;
  }

  .popUpLoginInputsSection {
    margin-top: 15px;
    display: inline-grid;
  }

  .popUpLoginInputsSection input {
    all: unset;

    margin: 10px;
    padding-left: 20px;

    width: 300px;
    height: 20px;

    border-bottom: 1px solid white;

    font-family: var(--main-font);
    font-size: 14px;
    text-align: left;

    color: var(--text-color);
    background: transparent;
  }
  .popUpLoginInputsSection input::placeholder {
    color: var(--text-color-hover);
  }

  .popUpLoginSumbit {
    margin-top: 40px;
    margin-left: auto;
    margin-right: auto;

    height: 30px;
    width: 200px;

    border: 2px solid var(--text-color);;

    color: var(--text-color);
    background: transparent;

    transition: .2s;
  }
  .popUpLoginSumbit:hover {
    border: 2px solid var(--text-color-hover);
    color: var(--text-color-hover);
  }
  .popUpLoginSumbit:active {
    border: 2px solid var(--text-color-active);
    color: var(--text-color-active);

    transition: 0s;
  }

</style>
