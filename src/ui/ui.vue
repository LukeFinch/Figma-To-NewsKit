<template>
  <Toolbar/>
    <router-view v-slot="{ Component }" class="contentView">
      <transition name="fade">
      <component :is="Component"/>
      </transition>
  </router-view>
  <!-- <transition      name="fade"
        mode="out-in">
 
  </transition> -->
  <!-- <div id="nav">
      <router-link to="/">Authenticate</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/main">Main</router-link>
  </div> -->
</template>

<script>
import 'figma-plugin-ds/dist/figma-plugin-ds.css'

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

<style>
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
</style>

<style lang=scss>
.capsizedText {
  padding: 0.05px 0;
}

.capsizedText::before {	
  content: "";	
  margin-top: -0.1826em;	
  display: block;	
  height: 0;	
}

.capsizedText::after {	
  content: "";	
  margin-bottom: -0.1826em;	
  display: block;	
  height: 0;	
}

input:placeholder-shown{
  border-color: var(--black1);
}

#app{
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  .contentView{
    flex-grow: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>