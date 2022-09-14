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

</style>
