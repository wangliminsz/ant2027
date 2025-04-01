<template>
  
  <div>

    <NavBar />
    <router-view></router-view>
    
  </div>

</template>

<script>
import NavBar from "./components/NavBar.vue"
// import mySpinner from "./components/Spinner.vue"

export default {
    name: 'App',
    components: {
      NavBar,
      // mySpinner
    }
  }
</script>

<style></style>