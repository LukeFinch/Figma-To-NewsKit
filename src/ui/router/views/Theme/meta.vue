<template>
  <main>
    <!-- <pre>{{theme.getMeta}}</pre> -->
    <form>
  <div class="input">
    <label for="themeName">Theme Name</label>
    <input id="themeName"  type="input" class="input__field" v-model="theme.getMeta.data.document_name">
  </div>
   <div class="input">
    <label for="themeName">Team</label>
    <input id="teamName"  type="input" class="input__field" placeholder="Team">
  </div>
    <div class="input">
    <label for="themeName">Description</label>
    <input id="themeDescription"  type="input" class="input__field" placeholder="Description">
  </div>
    <div class="input">
    <label>Exporter</label>
    <div class="flex-column">
    <input id="exporterName"  v-model="theme.getMeta.data.exporter_name" type="input" class="input__field" disabled>
    <input id="exporterEmail" v-model="theme.getMeta.data.exporter_email" type="input" class="input__field" disabled>
    </div>
  </div>
  </form>
  </main>
</template>

<script>
import { useStore } from '../../../store/store'
import { themeStore } from '../../../store/themeStore'
import {ref } from 'vue'
export default {
props: {
    canExport: Boolean
},
setup(props){
const store = useStore();
const theme = themeStore();
const themeName =  ref(theme.getMeta.data.document_name)
const exporterName = ref(theme.getMeta.data.exporter_name)
const exporterEmail = ref(theme.getMeta.data.exporter_email)
return {
    store,theme,themeName,exporterName,exporterEmail
}
}
}
</script>

<style scoped lang=scss>
main{
  display: flex;
  flex-direction: column;
  align-items: center;
  form{
    margin-top: var(--size-medium);
  .input {
    display: flex;
    flex-direction: row;
    input, div input{
      min-width: 200px;
      max-width: 200px;
    };
    label {
        font-size: var(--font-size-xsmall);
  font-weight: var(--font-weight-normal);
  letter-spacing: var(--font-letter-spacing-pos-xsmall);
  line-height: var(--line-height);
  color: var(--black8);
  height: var(--size-medium);
  min-width: 128px;
  max-width: 128px;
  display: flex;
  align-items: center;
  cursor: default;
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  padding: 0 var(--size-xxxsmall) 0 var(--size-xxsmall);
    };
  };
  };
}
</style>