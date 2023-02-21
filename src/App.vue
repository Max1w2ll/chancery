<template>
  <Header
    :userData="userData"
  />
  <Main
    :userData="userData"
  />
</template>

<script>
import axios from 'axios';

import Header from './components/Header.vue'
import Main from './components/Main.vue'
import ModalWindows from '@/components/ModalWindows.js';

export default {
  name: 'App',
  components: {
    Header,
    Main,
  },

  data() {
    return {
      // Authorization 
      authLink: 'https://auth.fisb/auth/api/ldapauth',

      // User information
      getUserLink: 'https://auth.fisb/chancery/api/auth/userinfo',

      userData: {
        department: 'department',
        displayName: 'FIO',
        email: 'email',
        role: 'role',
        title: 'title',
        selectedOrders: [],

        ModalWindows,
      },
    }
  },

  methods: {
    getUserInfo() {
      axios.get(this.getUserLink)
      .then((res) => {
        // console.log(res);
        this.userData.department  = res.data.department;
        this.userData.displayName = res.data.displayName;
        this.userData.email = res.data.email;
        this.userData.role = res.data.role;
        this.userData.title = res.data.title;
      },
      () => {
        this.createAuthWindow();
      });   
    },

    getCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },

    createAuthWindow() {
      let darkLayer = document.createElement('div');
      darkLayer.className = 'darkLayer';
      document.body.appendChild(darkLayer);

      let authSection = document.createElement('div');
      authSection.className = 'authSection';
      darkLayer.appendChild(authSection);

      let userIcon = document.createElement('img');
      userIcon.src = require('./assets/icons/logo.png');
      userIcon.className = 'userIcon';
      authSection.appendChild(userIcon);

      let title = document.createElement('p');
      title.textContent = 'ВОЙДИТЕ В СИСТЕМУ';
      title.className = 'title';
      authSection.appendChild(title);

      let inputsForm = document.createElement('form');
      inputsForm.className = 'inputsForm';
      authSection.appendChild(inputsForm);

      let usernameSection = document.createElement('div');
      usernameSection.className = 'usernameSection';
      inputsForm.appendChild(usernameSection);

      let usernameLabel = document.createElement('label');
      usernameLabel.textContent = "Почта"
      usernameSection.appendChild(usernameLabel);

      let username = document.createElement('input');
      username.required = true
      usernameSection.appendChild(username);

      let usernameIcon = document.createElement('img');
      usernameIcon.className = "usernameIcon";
      usernameIcon.src = require('./assets/icons/usernameIcon.png');
      usernameSection.appendChild(usernameIcon);

      let passwordSection = document.createElement('div');
      passwordSection.className = 'passwordSection';
      inputsForm.appendChild(passwordSection);

      let passwordLabel = document.createElement('label');
      passwordLabel.textContent = "Пароль"
      passwordSection.appendChild(passwordLabel);

      let password = document.createElement('input');
      password.type = 'password'
      password.className = 'password';
      password.required = true;
      passwordSection.appendChild(password);

      let passwordIcon = document.createElement('img');
      passwordIcon.className = "passwordIcon";
      passwordIcon.src = require('./assets/icons/passwordIcon.png');
      passwordSection.appendChild(passwordIcon);

      let submitButton = document.createElement('button');
      submitButton.textContent = 'Войти';
      submitButton.className = 'submitButton';
      inputsForm.appendChild(submitButton);

      inputsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        axios.post(this.authLink, { "username": username.value, "password": password.value }, { withCredentials: true })
        .then((res) => {
          ModalWindows.showModal(res.data.message, true);
          setTimeout(() => { location.reload() }, 1000);
        },
        () => {
          ModalWindows.showModal("Вы ввели неправильную почту или пароль!", false);
        });
      })
    }
  },

  mounted() {  
    this.getUserInfo();
  }
}
</script>

<style>
  @font-face {
    font-family: "Roboto";
    src: url("assets/fonts/roboto/Roboto-Regular.ttf");
  }

  :root {
    --main-font: "Open Sans", "Segoe UI", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;;
    --text-color: #ffffff;
    --text-color-hover: #d2d2d2;
    --text-color-active: #999999;

    --button-idle: #456ead;
    --button-hover: #405c91;
    --button-active: #7d98c9;

    --main-color: #2767c9;
    --sub-color: #2767c9;
    --main-background: #f1f8ff;
    --sub-background: #182D57;

    --left-side-background: #f1f8ff;
    --left-side-scrollbar-track: #d3e0ed;
    --left-side-scrollbar-thumb: #2767c9;

    --deleteButton-background: #f44336;

    --success-background: #429974;
    --error-background: #f44336;
  }

  body {
    margin: 0;

    overflow-y: hidden;
    overflow-x: hidden;

    background: var(--main-background);
  }

  .darkLayer {
    position: fixed;
    left: 0;
    top: 0;

    display: flex;
    align-items: center;

    height: 100%;
    width: 100%;
    z-index: 2;

    background-color: var(--main-background);
  }

  .authSection {
    margin: auto;
    padding: 32px;

    display: flex;
    flex-direction: column;
    align-items: center;

    height: 434px;
    width: 334px;

    border: 1px solid var(--main-color);

    justify-content: start;
    background-color: #fff;
  }

  .authSection .userIcon {
    margin: 0 0 32px;

    height: 160px;
    width: 200px;
  }

  .authSection p {
    font-family: var(--main-font);

    color: var(--main-color);
  }

  .authSection .title {
    margin-top: 0;

    font-size: 25px;
    margin-bottom: 32px;

    text-transform: uppercase; 
  }

  .authSection .description {
    margin: 20px auto;

    width: 250px;

    line-height: 22px;

    font-size: 14px;
  }

  .authSection .inputsForm {
    height: 200px;
    width: -webkit-fill-available;
  }  

  .authSection .inputsForm input {
    padding: 15px 0 4px 8px;

    outline: none;
    border: none;

    width: 280px;

    font-family: var(--main-font);
    font-size: 17px;

    color: var(--main-color);
    background: transparent;
  }

  .authSection .inputsForm label {
    margin-left: 7px;

    position: absolute;

    font-family: var(--main-font);

    opacity: 0.7;
    color: var(--main-color);

    font-size: 13px;
  }

  .authSection .inputsForm .usernameIcon {
    margin-left: 11px;

    transform: translateY(1px);

    height: 22px;
    width: 20px;
  }

  .authSection .inputsForm .passwordIcon {
    margin-left: 13px;

    height: 20px;
    width: 16px;
  }

  .usernameSection {
    margin-bottom: 8px;

    height: 46px;

    border: 1px solid var(--main-color);
  }
  .passwordSection {
    margin-bottom: 8px;

    height: 46px;

    border: 1px solid var(--main-color);
  }

  .authSection .inputsForm button {
    align-items: center;

    display: flex;
    flex-direction: row;
    justify-content: center;

    height: 40px;
    width: 100%;

    background-color: var(--main-color);
    color: var(--text-color);

    border: none;

    transition: all 0.01s ease-in-out 0s;
  }
  
</style>
