// Custom wrapper to show json data in the theme
<template>
  <main>
    <!-- <pre>{{theme.getMeta}}</pre> -->
      <Disclosure v-if="errors.length > 0">
    <template v-slot:heading>
      <div class="icon icon--warning icon--red"></div><div class="type type-bold type-red">{{errors.length}} Errors</div>
    </template>
    <template v-slot:content>
      <ul>
        <li v-for="(err, index) in errors" :key="index">{{err}}</li>
      </ul>
    </template>
  </Disclosure>
  <div class="jsonContainer">
    <vue-json-pretty :data="data" :deep="2" ></vue-json-pretty>
    </div>
  </main>
</template>

<script>
import { useStore } from '../store/store'
import { themeStore } from '../store/themeStore'
import VueJsonPretty from 'vue-json-pretty'

import Disclosure from './Disclosure.vue'
export default {
props: {
    canExport: Boolean,
    data: String,
    errors: Array
},
components: {
  VueJsonPretty,
  Disclosure
},
setup(props){
const store = useStore();
const theme = themeStore();

return {
    props
}
}
}
</script>

<style scoped lang=scss>
.disclosure__item {
    border: none;
}
.ThemeContentView {
    height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
}

.jsonContainer{
  flex: 1;
  overflow: scroll;
  padding: 8px;
}
</style>