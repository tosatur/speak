<template>
    <form @submit.prevent="submitMessage">
      <input v-model="name" placeholder="Your Name" required />
      <input v-model="message" placeholder="Your Message" required />
      <button type="submit">Post Message</button>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        message: ''
      };
    },
    methods: {
      submitMessage() {
        this.$emit('message-posted', {
          name: this.name,
          message: this.message,
          links: []
        });
        this.name = '';
        this.message = '';
      }
    }
  };
  </script>  