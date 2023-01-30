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
        displayName: 'Фамилия Имя Отчество',
        email: 'email',
        role: 'role',
        title: 'title',
      },
    }
  },

  methods: {
    getUserInfo() {
      axios.get(this.getUserLink)
      .then((res) => {
        console.log(res);
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

    createAuthWindow(event) {
      let darkLayer = document.createElement('div');
      darkLayer.className = 'darkLayer';
      document.body.appendChild(darkLayer);

      let authSection = document.createElement('div');
      authSection.className = 'authSection';
      darkLayer.appendChild(authSection);

      let userIcon = document.createElement('img');
      userIcon.src = require('./assets/icons/userIcon.png');
      userIcon.className = 'userIcon';
      authSection.appendChild(userIcon);

      let title = document.createElement('p');
      title.textContent = 'Вы не авторизованы';
      title.className = 'title';
      authSection.appendChild(title);

      let description = document.createElement('p');
      description.textContent = 'Введите данные для входа в учётную запись.';
      description.className = 'description';
      authSection.appendChild(description);

      let inputsForm = document.createElement('form');
      inputsForm.className = 'inputsForm';
      authSection.appendChild(inputsForm);

      let username = document.createElement('input');
      username.placeholder = "Имя пользователя"
      inputsForm.appendChild(username);

      let passwordSection = document.createElement('div');
      passwordSection.className = 'passwordSection';
      inputsForm.appendChild(passwordSection);

      let password = document.createElement('input');
      password.placeholder = "Пароль"
      password.type = 'password'
      password.className = 'password';
      passwordSection.appendChild(password);

      let eyeIcon = document.createElement('img');
      eyeIcon.src = require('./assets/icons/eyeIconClosed.png');
      eyeIcon.className = 'eyeIcon';  
      passwordSection.appendChild(eyeIcon);

      eyeIcon.addEventListener("click", function () {
        eyeIcon.src = 'eyeIcon.png';
        if (password.getAttribute('type') == 'password') {
          password.type = 'text';
          eyeIcon.src = require('./assets/icons/eyeIcon.png');
        }
        else {
          password.type = 'password';
          eyeIcon.src = require('./assets/icons/eyeIconClosed.png');
        }
      });

      let submitButton = document.createElement('button');
      submitButton.textContent = 'Войти';
      submitButton.className = 'submitButton';
      inputsForm.appendChild(submitButton);

      inputsForm.addEventListener('submit', (event) => {
        event.preventDefault();

        axios.post(this.authLink, 
        {
            "username": username.value,
            "password": password.value
        },
        {
          'Content-Type': 'application/json',
          withCredentials: true 
        })
        .then((res) => {
          console.log(res);
          location.reload()
        },
        reason => {
          console.log(reason);
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
    --main-font: "Roboto";
    --sub-font: monospace;
    --text-color: #ffffff;
    --text-color-hover: #d2d2d2;
    --text-color-active: #999999;

    --button-idle: #456ead;
    --button-hover: #405c91;
    --button-active: #7d98c9;

    --main-color: #273a52;
    --sub-color: #324a6a;
    --main-background: #0e1722;
    --sub-background: #172230;

    --left-side-background: #060a10;
    --left-side-scrollbar-track: #273a52;
    --left-side-scrollbar-thumb: #9b9b9b;

    --filter-menu-background: #18273a;

    --deleteButton-background: #781c1c;
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

    display: table-cell;
    vertical-align: middle;

    height: 500px;
    width: 350px;

    border-radius: 5px;

    text-align: center;

    background-color: var(--sub-color)
  }

  .authSection .userIcon {
    margin-top: 30px;

    height: 96px;
    width: 96px;
  }

  .authSection p {
    font-family: var(--main-font);

    color: var(--text-color);
  }

  .authSection .title {
    margin-top: 15px;

    font-size: 20px; 
  }

  .authSection .description {
    margin: 20px auto;

    width: 250px;

    line-height: 22px;

    font-size: 14px;
  }

  .authSection .inputsForm {
    margin: auto;

    height: 200px;
    width: 300px;
  }  

  .authSection .inputsForm input {
    padding-left: 10px;
    margin-bottom: 10px;

    height: 40px;
    width: 270px;

    border: 1px solid #adadad;
    border-radius: 2px;
    outline: none;

    font-family: var(--main-font);

    color: var(--text-color);
    background: transparent;

    transition: 0.2s;
  }
  .authSection .inputsForm input:focus-visible {
    border: 1px solid #e0e0e0;
  }
  .authSection .inputsForm input::placeholder {
    color: var(--text-color);
  }

  .authSection .inputsForm .eyeIcon {
    position: absolute;
    transform: translate(-40px, 10px);

    height: 24px;
    width: 24px;

    cursor: pointer;
  }
  .authSection .inputsForm .eyeIcon:hover {
    filter: invert(0.1);
  }

  .authSection .inputsForm button {
    all: unset;

    margin-top: 30px;

    height: 40px;
    width: 285px;

    border-radius: 2px;

    font-family: var(--main-font);
    font-size: 14px;

    color: var(--text-color);

    background: var(--button-idle);

    transition: 0.4s;
  }
  .authSection .inputsForm button:hover {
    cursor: pointer;

    background: var(--button-hover);
  }
  .authSection .inputsForm button:active {
    background: var(--button-active);
  }
  
</style>
