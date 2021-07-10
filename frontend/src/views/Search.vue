<template>
  <div id="app">
    <form>
      <input v-model="name" placeholder="Enter Name">
      <button type="submit" @click="handleSubmit">Save name</button>    </form>
      
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: ""    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
    }
  }
};
</script>