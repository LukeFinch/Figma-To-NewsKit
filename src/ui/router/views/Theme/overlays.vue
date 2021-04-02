<template>
<json-view :data="theme.getOverlays.data" :errors="theme.getOverlays.errors" />
</template>

<script>
import { useStore } from '../../../store/store'
import { themeStore } from '../../../store/themeStore'


import JsonView from '../../../components/JsonView.vue'
export default {
props: {
    canExport: Boolean
},
components: {
    JsonView
},
setup(props){
const store = useStore();
const theme = themeStore();

return {
    store,theme
}
}
}
</script>

<style scoped lang=scss>

</style>