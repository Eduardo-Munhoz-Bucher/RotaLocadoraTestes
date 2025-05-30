<template>
  <v-app class="app">
    <div>
      <img src="../assets/img/Gif.gif" alt="Gif" height="300px">
      <h1>Opss... página não encontrada.</h1>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
}
</script>

<style scoped>
::v-deep .v-application--wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

img {
  width: 100%;
}

h1 {
  font-size: 24px;
  color: #5e5e5e;
}
</style>
