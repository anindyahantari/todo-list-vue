<template>
  <div id="app">
    <Navbar />

    <b-container>
      <RouterView />
    </b-container>

  </div>
</template>

<script>
import Navbar from "./components/DefaultNavbar.vue"

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>

button {
    border: unset !important;
    border-radius: 45px !important;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    padding: 13.5px 29px !important; 
}

a {
    text-decoration: none !important;
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px !important;
  }
}

</style>
