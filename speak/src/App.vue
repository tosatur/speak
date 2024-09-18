<template>
  <div id="app">
    <h1>Speak</h1>
    <MessageForm @message-posted="addMessage" />
    <GraphView :messages="messages" />
  </div>
</template>

<script>
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import MessageForm from "./components/MessageForm.vue";
import GraphView from "./components/GraphView.vue";

export default {
  name: "App",
  components: {
    MessageForm,
    GraphView
  },
  data() {
    return {
      messages: []
    };
  },
  methods: {
    async addMessage(newMessage) {
      await addDoc(collection(db, "messages"), {
        ...newMessage,
        timestamp: serverTimestamp()
      });
      this.fetchMessages();
    },
    async fetchMessages() {
      const querySnapshot = await getDocs(collection(db, "messages"));
      this.messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  },
  mounted() {
    this.fetchMessages();
  }
};
</script>