<template>
  <Disclosure :expanded="false" :section="true">
    <template v-slot:heading>{{title}}</template>
    <template v-slot:content>
      <vue-json-pretty v-if="jsonData" :data="jsonData" :deep="2" :virtual="true"
        style="height: 200px; width: 400px;"></vue-json-pretty>
      <div v-else class="icon icon--spinner icon--spin" />
    </template>
  </Disclosure>
  <Disclosure v-if="errors.length > 0">
    <template v-slot:heading>
      <div class="icon icon--noticeinfo icon--red"></div><div class="type type-bold type-red">{{errors.length}} Errors</div>
    </template>
    <template v-slot:content>
      <ul>
        <li v-for="(err, index) in errors" :key="index">{{err}}</li>
      </ul>
    </template>
  </Disclosure>
</template>

<script>
import Disclosure from './Disclosure.vue'
import VueJsonPretty from 'vue-json-pretty'
import {onMounted, ref, watchEffect} from 'vue'



// const jsonData = ref({})
// const errors = ref([])

export default {
    props: {
        title: String,
        jsonData: Object,
        errors: Array,
    },    
    components: { 
         Disclosure,
         VueJsonPretty
    },
    setup(props, ){
      onMounted(() => {
 
      })
  
      return{
        props,
    
      }
    }
    
}
</script>

<style>

</style>