<template>
<main >
  <img src="../../assets/newskitglyph.svg" class="mb-medium" />
  <h2 class="capsizedText type type--xxlarge type--bold mb-xsmall">Authentication required</h2>
  <p class="capsizedText type mb-xsmall">
    NewsKit Theme Manager needs your
    <br>
    Personal Access Token in order to continue.
    <br>
    This lets the plugin view the contents of your files, but can’t edit them
  </p>
  <form id="figmaKey" @submit.prevent="doAuth(figmaKey)" novalidate>
  <div class="input-with-button">
      <div class="input input--with-icon">
        <div class="icon icon--key"></div>
      <input type="input" @input="checkInvalid" class="input__field" spellcheck="false" v-model="figmaKey" placeholder="Figma API Key">
      </div>
<button class="button button--primary" :disabled="!isFormValid">Save</button>
</div>
</form>
<p v-if="keyErr.length > 0" class="capsizedText type color-red">{{keyErr}}</p>
<a class="capsizedText type" href="http://figma.com/settings#:~:text=Create a new personal access token" target="#">Get Access Token</a>

  </main>
</template>

<script>
import { useStore } from '../../store/store'
import router from '../index.js'
import { onMounted, ref } from 'vue';
import { handleEvent, dispatch } from '../../uiMessageHandler'
var figmaKey = ref('')
var isFormValid = ref(false)
var keyErr = ref('')

export default {


  setup(){
  var regex = /[a-zA-Z0-9]{6}-[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/
  const store = useStore()
  figmaKey.value = store.getFigmaKey
  if(figmaKey.value){
    isFormValid.value = figmaKey.value.match(regex)
  }
  function checkInvalid(event){
    isFormValid.value = event.target.value.match(regex) 
    // isFormValid.value = event.target.reportValidity()
  }




    function doAuth(key) {   
      let url = 'https://api.figma.com/v1/me'
      fetch(url,{'headers': {'X-Figma-Token': key}})
      .then(
        response => response.json().then(data => {handleResponse(data)}),
        rejected => handleRejection(rejected)
      );
     

    function handleResponse(data){
      console.log(data)
      if(data.status){
        keyErr.value = data.err
        console.log(data)
      } else {
        keyErr.value = ''
        store.setFigmaKey(key)
        store.setUser(data.handle, data.img_url, true)
        router.push({path: '/theme/foo'})
        dispatch('saveFigmaKey', key)
      }
     
    };
    function handleRejection(rejected){
        keyErr.value = rejectedErr.err
    }

    }
    onMounted(() => {
        
    handleEvent('figmaKey', key => {
    figmaKey.value = key
    doAuth()
  })
    })
    return {
      store,
      figmaKey,
      doAuth,
      isFormValid,
      checkInvalid,
      keyErr
          }
  },
}
</script>

<style lang="scss" scoped>
main{
  max-width: 280px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: calc(100%);
}
h2{
  font-family: var(--font-stack);
  font-size: 18px;
  line-height: 24px;
}
.input-with-button{
  width: 100%;
  display: flex;
  flex-direction: row;
  .input{
    margin-right: var(--size-xxsmall);
    flex-grow: 1;
  }

}
a{
  color: var(--blue);
  width: 100%;
  padding: var(--size-xxsmall);
  text-decoration: none;
}
form#figmaKey{
  width: 100%;
}

</style>
