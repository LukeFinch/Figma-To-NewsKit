<template>
<div id="ui">
  <!-- <textarea v-if="colorsJson" class="textarea" v-model="colorsJson" :disabled=true rows=10></textarea> -->
    <Disclosure :expanded="false" :section="true">
    <template v-slot:heading>meta.json</template>
    <template v-slot:content>
      <vue-json-pretty v-if="metaJson" :data="metaJson" :deep="2" :virtual="true"
        style="height: 200px; width: 400px;"></vue-json-pretty>
      <div v-else class="icon icon--spinner icon--spin" />
    </template>
  </Disclosure>
  <Disclosure :expanded="false" :section="true">
    <template v-slot:heading>colors.json</template>
    <template v-slot:content>
      <vue-json-pretty v-if="colorsJson" :data="colorsJson" :deep="2" :virtual="true"
        style="height: 200px; width: 400px;"></vue-json-pretty>
      <div v-else class="icon icon--spinner icon--spin" />
    </template>
  </Disclosure>
  <Disclosure v-if="colorsErr.length > 0">
    <template v-slot:heading>
      <div class="icon icon--noticeinfo icon--red"></div><div class="type type-bold type-red">{{colorsErr.length}} Errors</div>
    </template>
    <template v-slot:content>
      <ul>
        <li v-for="(err, index) in colorsErr" :key="index">{{err}}</li>
      </ul>
    </template>
  </Disclosure>
  <Disclosure :expanded="false" :section="true" :heading="'fonts.json'">
    <template v-slot:content>
    <vue-json-pretty v-if="fontsJson" :data="fontsJson" :deep="2" :virtual="true" style="height: 200px; width: 400px;">
    </vue-json-pretty>
    <div v-else class="icon icon--spinner icon--spin"></div>
    </template> 
  </Disclosure>
  <Disclosure v-if="fontsErr.length > 0">
    <template v-slot:heading>
      <div class="icon icon--noticeinfo icon--red"></div><div class="type type-bold type-red">{{fontsErr.length}} Errors</div>
    </template>
    <template v-slot:content>
      <ul>
        <li v-for="(err, index) in fontsErr" :key="index">{{err}}</li>
      </ul>
    </template>
  </Disclosure>
  <Disclosure :expanded="false" :section="true" :heading="'typographyPresets.json'">
    <template v-slot:content>
    <vue-json-pretty v-if="typographyJson" :data="typographyJson" :deep="2" :virtual="true"
      style="height: 200px; width: 400px;"> </vue-json-pretty>
    <div v-else class="icon icon--spinner icon--spin"></div>
    </template>
  </Disclosure>
  <Disclosure v-if="typographyErr.length > 0">
      <template v-slot:heading>
      <div class="icon icon--noticeinfo icon--red"></div><div class="type type-bold type-red">{{typographyErr.length}} Errors</div>
    </template>
    <template v-slot:content>
      <ul>
        <li v-for="(err, index) in typographyErr" :key="index">{{err}}</li>
      </ul>
    </template>
  </Disclosure>


  <button class='button button--primary' :disabled="!allLoaded" @click="saveFiles">Save Files</button>
</div>

</template>

<script>
import JSZip from 'jszip'

import VueJsonPretty from 'vue-json-pretty';
import Disclosure from './components/Disclosure.vue'
//import 'vue-json-pretty/lib/styles.css';
import './json-style.css'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import '@lukefinch/figmaicons/dist/figmaicons.css'
import {
  dispatch,
  handleEvent
} from "./uiMessageHandler";
import {
  computed,
  onMounted,
  ref,
} from 'vue';

export default {
  components: {
    VueJsonPretty,
    Disclosure
  },
  setup() {
    
  const metaJson = ref()
  const typographyJson = ref()
  const fontsJson = ref()
  const colorsJson = ref()
  const typographyErr = ref([])
  const fontsErr = ref([])
  const colorsErr = ref([])

  const allLoaded = computed(() => {
    let val = typographyJson.value && fontsJson.value && colorsJson.value && metaJson.value ? true : false
    return val
  })


    function saveFiles(){
    const zip = new JSZip();
    zip.file('meta.json', JSON.stringify(metaJson.value,null,2))
    zip.file('colors.json', JSON.stringify(colorsJson.value,null,2))
    zip.file('fonts.json', JSON.stringify(fontsJson.value,null,2))
    zip.file('typographyJson.json', JSON.stringify(typographyJson.value,null,2))
    zip.generateAsync({type:"blob"})
    .then(function(content) {
    // Force down of the Zip file
    saveAs(content, "archive.zip");
});
    }
    function saveAs(blob, filename) {
  if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
    return navigator.msSaveOrOpenBlob(blob, fileName);
  } else if (typeof navigator.msSaveBlob !== 'undefined') {
    return navigator.msSaveBlob(blob, fileName);
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    elem.style = 'display:none;opacity:0;color:transparent;';
    (document.body || document.documentElement).appendChild(elem);
    if (typeof elem.click === 'function') {
      elem.click();
    } else {
      elem.target = '_blank';
      elem.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }
    URL.revokeObjectURL(elem.href);
  }
}
  
    onMounted(() => {
      console.log('The Doc is mounted')

      dispatch('UIReady')

      const app = document.getElementById('app')
      const resizeObserver = new ResizeObserver(function () {
         dispatch('resizeUI', [app.scrollWidth, app.scrollHeight])
      });
      resizeObserver.observe(app)
    



      

      handleEvent('fetch', async data => {
          let returnData = await fetch(data.url, data.options)
          .then(response => {            
            return response.json()
            }).then(res => {
              dispatch(data.time,res)
            }
            )
       
        })

      handleEvent('fetchTextStyles', async data => {
          await fetch(data.url, data.options)
          .then(response => {            
            return response.json()
            }).then(res => {
              var returnData = res.meta.styles.filter(style => style.style_type == "TEXT")
              
              dispatch(data.time,returnData)
            }
            )       
        })
       
       handleEvent("metaJson",data => {
         console.log('got meta json',data)
         metaJson.value = data
       });

      handleEvent("colorsJson", data => {  
        console.log('colorsJson', data.data)     
        colorsJson.value = data.data
        colorsErr.value = data.errors
      });

      handleEvent("fontsJson", data => {       
        fontsJson.value = data.data
        fontsErr.value = data.errors
      });
      handleEvent("typographyJson", data => {        
        typographyJson.value = data.data
        typographyErr.value = data.errors
      });


    })

    return {
      metaJson,
      typographyJson,
      fontsJson,
      colorsJson,
      typographyErr,
      fontsErr,
      colorsErr,
      allLoaded,
      saveFiles
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

.icon{
  background-position: 0 0;
}

.type-red{
  color: var(--red)
}
</style>