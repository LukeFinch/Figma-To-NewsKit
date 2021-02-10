import { defineStore } from "pinia"

interface Store {
    figma: string,
    github: string,
    name: string,
    avatar: string,
    isLoggedIn: boolean
}


export const useStore = defineStore({
    id: "store",
    state: (): Store => ({
      figma: null,
      github: null,
      name: null,
      avatar: null,
      isLoggedIn: false,
    }),
    actions: {
      setFigmaKey(value: string) {
       
        this.figma = value;
      },
      setGithubKey(value: string) {
        this.github = value;
      },
      setUser(name: string, avatar: string){
        this.name = name
        this.avatar = avatar
        this.isLoggedIn = true
      }

    },
    getters: {
      getFigmaKey() {
        return this.figma;
      },
      getGithubKey(){
          return this.github
      },
      getUser(){
          return {name: this.name, avatar: this.avatar, isLoggedIn: this.isLoggedIn}
      },
     }
  });