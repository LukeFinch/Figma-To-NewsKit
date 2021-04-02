<template>
<div class="theme__nav"  v-if="store.name && store.avatar">

<router-link to="/theme/foo">Theme</router-link>
<router-link to="/theme/foo/colors"       :class="{error: theme.getColors.errors.length > 0}"       >    Colors</router-link>
<router-link to="/theme/foo/overlays"     :class="{error: theme.getOverlays.errors.length > 0}"     >    Overlays</router-link>
<router-link to="/theme/foo/fonts"        :class="{error: theme.getFonts.errors.length > 0}"        >    Fonts</router-link>
<router-link to="/theme/foo/typography"   :class="{error: theme.getTypography.errors.length > 0}"   >    Typography</router-link>


</div>
</template>


<script>
import { useStore } from '../store/store'
import { themeStore } from '../store/themeStore'

export default {
props: {
    canExport: Boolean
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
.theme__nav{
    padding: 8px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    width: 100%;
    height: 40px;

    background: #FFFFFF;
    box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.15);
    a {
        font-family: var(--font-stack);
        font-size: var( --font-size-small);
        font-weight: var(--font-weight-medium);
        color: var(--black8);
        text-decoration: none;
        padding: 4px;
        
    }
    .router-link-exact-active{
        opacity: 50%;
    }
    .error {
        color: var(--red)
    }
}
</style>