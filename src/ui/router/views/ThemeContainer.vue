<template>
      <div class="Theme">
      <router-view v-slot="{ Component }" class="ThemeContentView">

      <component :is="Component"/>

  </router-view>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.ThemeContentView{
  height: calc(100vh - 80px)
}
</style>