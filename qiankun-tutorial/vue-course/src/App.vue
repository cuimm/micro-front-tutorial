<template>
  <div id="app">
    <div id="app__nav">
      <router-link to="/">Course-Home</router-link> |
      <router-link to="/about">Course-About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#app__nav {
  padding: 30px;
}

#app__nav a {
  font-weight: bold;
  color: #2c3e50;
}

#app__nav a.router-link-exact-active {
  color: #42b983;
}
</style>
