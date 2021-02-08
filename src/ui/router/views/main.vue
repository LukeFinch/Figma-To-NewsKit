<template>
<div id="ui">

  <json-data title="Theme"      :jsonData="metaJson"        :errors="metaErr"       />
  <json-data title="Colors"     :jsonData="colorsJson"      :errors="colorsErr"     />
  <json-data title="Overlays"   :jsonData="overlaysJson"    :errors="overlaysErr"   />
  <json-data title="Font"       :jsonData="fontsJson"       :errors="fontsErr"      />
  <json-data title="Typography" :jsonData="typographyJson"  :errors="typographyErr" />
  <!-- <json-data title="Borders"    :jsonData="bordersJson"     :errors="bordersErr"    /> -->

  <button class='button button--primary' :disabled="!allLoaded" @click="saveFiles">Save Files</button>
</div>

</template>

<script>
import JSZip from 'jszip'

import Disclosure from '../../components/Disclosure.vue'
import jsonData from '../../components/jsondata.vue'
//import 'vue-json-pretty/lib/styles.css';
import '../../json-style.css'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import '@lukefinch/figmaicons/dist/figmaicons.css'
import {
  dispatch,
  handleEvent
} from "../../uiMessageHandler";
import {
  computed,
  onMounted,
  ref,
} from 'vue';

export default {
  components: {
    Disclosure,
    jsonData
  },
  setup() {
    
  const metaJson = ref()
  const metaErr = ref([])
  
  const colorsJson = ref()
  const colorsErr = ref([])

  const overlaysJson = ref()
  const overlaysErr = ref([])

  const fontsJson = ref()
  const fontsErr = ref([])

  const typographyJson = ref()
  const typographyErr = ref([])

  

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

          handleEvent("overlaysJson", data => {  
            console.log('overlaysJson', data.data)     
            overlaysJson.value = data.data
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
      metaErr,
      colorsJson,
      colorsErr,
      overlaysJson,
      overlaysErr,
      fontsJson,
      fontsErr,
      typographyJson,
      typographyErr,
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