<template>
    <div id="app">
        <CalculateDistance/>
    </div>
</template>

<script>
  import CalculateDistance from './components/CalculateDistance'

  export default {
    name: 'app',
    components: {
      CalculateDistance
    }
  }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*text-align: center;*/
        color: #2c3e50;
        /*margin-top: 60px;*/
    }
</style>
