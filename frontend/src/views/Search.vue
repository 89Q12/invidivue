<template>
  <div id="app">
    <form v-on:submit.prevent="noop">
      <input name="query" v-model="name" v-on:keydown="validateInput" placeholder="">
      <button type="submit" @click="handleSubmit">Search</button>    
      </form>
      <p>{{ log }}</p>
  </div>
    
</template>

<script>
export default {
  data() {
    return {
      name: ""    ,
      log:""
      };  
  },
  watch: {
    // call again the method if the route changes
    '$route': 'search'
  },
  methods: {

    validateInput: function(e) {
      if (e.keyCode === 13) {
        this.handleSubmit();
      }     
    },
    
    handleSubmit: function() {
      
        this.log =this.name  ;
    },
    noop () {
      // do nothing ?
    }
  }
};
</script>