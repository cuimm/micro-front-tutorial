<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/img.jpg">
    <!--<checkbox-group-->
      <!--v-model="name"-->
      <!--:options="options"-->
    <!--/>-->
  </div>
</template>

<script>
  // @ is an alias to /src
  import HelloWorld from '@/components/HelloWorld.vue'

  export default {
    name: 'Home',
    components: {
      HelloWorld
    },
    data() {
      return {
        name: [],
        options: [{
          id: 1,
          text: 'apple'
        },{
          id: 2,
          text: 'banana'
        },{
          id: 3,
          text: 'orange'
        }],
      }
    },
  }
</script>
