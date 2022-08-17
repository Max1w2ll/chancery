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
      // User information
      getUserLink: 'http://chancery.fisb/api/auth/userinfo',

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
        if (window.location.pathname.length > 1) {
          window.location.href = "http://chancery.fisb/";
        }
        this.userData.department  = res.data.department;
        this.userData.displayName = res.data.displayName;
        this.userData.email = res.data.email;
        this.userData.role = res.data.role;
        this.userData.title = res.data.title;
      },
      reason => {
        console.log(reason);
      });   
    },

    getCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
  },

  mounted() {  
    var authKey = window.location.pathname; // Get key from link (https://chancery.fisb/[key])
    if(authKey.length <= 1) { // If there is no key, check cookies for it
      if(this.getCookie('auth')) {
        authKey = this.getCookie('auth')
      }
      else {
        window.location.href = "http://auth.fisb/" // No key from link and cookies - go to auth.fisb
      }
    }
    else {
      authKey = authKey.substr(1);
      document.cookie = "auth="+authKey
    }
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

    overflow-x: hidden;

    background: var(--main-background);
  }
  
</style>
