<template>
<div class="toolbar" v-if="store.name && store.avatar">
    <p>{{$route.path}}</p>
  <router-link class="user" name="" to="/Authenticate">
      <img class="avatar" :src="store.avatar"><span class="type type--inverse type--small">{{store.name}}</span>
  </router-link>
  </div>
</template>

<script>
import { useStore } from '../store/store'

export default {
props: {
    canExport: Boolean
},
setup(props){
const store = useStore();

return {
    store,
}
}
}
</script>

<style lang="scss" scoped>
.toolbar{
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: var(--size-xsmall);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--black8);
    color: white;
    .user{
        display: flex;
        flex-direction: row;
        align-items: center;
        color: white;
     .avatar{
        border-radius: 50%;
        width: 24px;
        height: 24px;
        margin-right: 8px;
     }
    }
}
</style>

