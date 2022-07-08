<template>
  <Header></Header>
  <Main></Main>
  <Footer></Footer>
</template>

<script>
import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Main,
    Footer
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

    --main-color: #273a52;
    --sub-color: #324a6a;
    --main-background: #0e1722;
    --sub-background: #172230;

    --left-side-background: #060a10;
    --left-side-scrollbar-track: #273a52;
    --left-side-scrollbar-thumb: #9b9b9b;

    --deleteButton-background: #781c1c;
  }

  body {
    margin: 0;

    overflow-x: hidden;

    background: var(--main-background);
  }

</style>
