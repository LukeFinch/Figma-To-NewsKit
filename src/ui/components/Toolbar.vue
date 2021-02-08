<template>
<div class="toolbar">
  <div class="user">
      <img class="avatar" :src="img"><span class="type type--pos-small">{{name}}</span>
  </div>
  </div>
</template>

<script>
export default {
props: {
    name: String,
    img: String,
    canExport: Boolean
},
setup(props){
}
}
</script>

<style lang="scss" scoped>
.toolbar{
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: var(--black8);
    .user{
        border-radius: 50%;
        width: 24px;
        height: 24px;
    }
}
</style>

