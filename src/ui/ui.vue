<template>
  <!-- <div id="nav">
      <router-link to="/">Authenticate</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/main">Main</router-link>
  </div> -->
  <Toolbar/>
  <router-view />
</template>

<script>
import styles from 'figma-plugin-ds/dist/figma-plugin-ds.css'

import {
  dispatch,
  handleEvent
} from "./uiMessageHandler";
import {
  onMounted,
  ref
} from 'vue';
import Toolbar from './components/Toolbar.vue';
export default {
  components: { Toolbar },
  setup() {
    const message = ref("")
    function createNode() {
      // This shows how the UI code can send messages to the main code.
      dispatch("createNode");
    }
    onMounted(() => {
      // The following shows how messages from the main code can be handled in the UI code.
      handleEvent("nodeCreated", nodeID => {
        message.value = `Node ${nodeID} was created!`;
      });
    })
    return {
      message,
      createNode
    };
  }
};
</script>

<style scoped>
#ui{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-medium);
}
</style>