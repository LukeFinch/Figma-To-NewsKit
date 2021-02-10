import { createWebHashHistory, createRouter } from "vue-router";
import Splash from "./views/Splash.vue";
import About from "./views/About.vue";
import Authenticate from "./views/Authenticate.vue"
import Main from "./views/Main.vue"
import {useStore} from "../store/store"


const routes = [
  {
    path: "",
    name: "Splash",
    component: Splash
  },
  {
    path: "/authenticate",
    name: "Authenticate",
    component: Authenticate,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
    meta: {requiresAuth: true}
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];


const router = createRouter({
 history: createWebHashHistory(),
  routes
});

router.beforeEach((to,from,next) => {
  const store = useStore()
if(to.meta.requiresAuth){
  console.log(store.getUser)
  if(store.getUser.isLoggedIn){
    next()
  } else {
    router.push('/Authenticate')
  }
} else {
  next()
}
})

export default router;