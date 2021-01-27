<template>
<div id="ui">
<!-- <textarea v-if="colorsJson" class="textarea" v-model="colorsJson" :disabled=true rows=10></textarea> -->
<Disclosure :expanded="false" :section="true" :heading="'colors.json'">
<vue-json-pretty  v-if="colorsJson" :data="colorsJson" :deep="2" :virtual="true" style="height: 200px; width: 400px;"> </vue-json-pretty>
<div v-else class="icon icon--spinner icon--spin"></div>
</Disclosure>
<Disclosure :expanded="false" :section="true" :heading="'fonts.json'">
<vue-json-pretty  v-if="fontsJson" :data="fontsJson" :deep="2" :virtual="true" style="height: 200px; width: 400px;"> </vue-json-pretty>
<div v-else class="icon icon--spinner icon--spin"></div>
</Disclosure>
<Disclosure :expanded="false" :section="true" :heading="'typographyPresets.json'">
<vue-json-pretty  v-if="typographyJson" :data="typographyJson" :deep="2" :virtual="true" style="height: 200px; width: 400px;"> </vue-json-pretty>
<div v-else class="icon icon--spinner icon--spin"></div>
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

  const typographyJson = ref()
  const fontsJson = ref()
  const colorsJson = ref()

  const allLoaded = computed(() => {
    let val = typographyJson.value && fontsJson.value && colorsJson.value ? true : false
    return val
  })


    function saveFiles(){
    const zip = new JSZip();
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
        
      handleEvent("colors", data => {
       
        colorsJson.value = data
      });

      handleEvent("fontsJson", data => {
       
        fontsJson.value = data
      });
      handleEvent("typographyJson", data => {
        
        typographyJson.value = data
      });


    })

    return {
      typographyJson,
      fontsJson,
      colorsJson,
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
</style>