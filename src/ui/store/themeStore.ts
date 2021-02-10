import { getAllFonts } from "@figma-plugin/helpers";
import { defineStore } from "pinia"
import { computed } from "vue";

interface ThemeItem {
    data: JSON
    errors: Array<string>
}

interface Theme {
    allSent: boolean,
    meta: ThemeItem,
    colors: ThemeItem
    overlays: ThemeItem
    fonts: ThemeItem
    typography: ThemeItem
}


export const themeStore = defineStore({
    id: "theme",
    state: (): Theme => ({
        allSent: false, //Enables export
        meta: {data: null, errors: []},
        colors: {data: null, errors: []},
        overlays: {data: null, errors: []},
        fonts: {data: null, errors: []},
        typography: {data: null, errors: []}
    }),
    actions: {
        setMeta(dat,err){
            this.meta = {data: dat, errors: err}
        },
        setColors(dat,err){
            this.colors = {data: dat, errors: err}
        },
        setOverlays(dat,err){
            this.overlays = {data: dat, errors: err}
        },
        setFonts(dat,err){
            this.fonts = {data: dat, errors: err}
        },
        setTypography(dat,err){
            this.typography = {data: dat, errors: err}
        },
        setAllSent(){
            this.allSent = true
        }
    },
    getters: {
        getAllSent(){
            return this.allSent
        },
        getMeta(){
            return this.meta
        },
        getColors(){
            return this.colors
        },
        getOverlays(){
            return this.overlays
        },
        getFonts(){
            return this.fonts
        },
        getTypography(){
            return this.typography
        },
        totalErrors(){
            computed(() => {
                let errcount = 0
                this.forEach((themeType: ThemeItem) => {
                    errcount+= themeType.errors.length;                    
                })
                return errcount
            })
        },
        getState(){
            return this.state
        }
    }
  });