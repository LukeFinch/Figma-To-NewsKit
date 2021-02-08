import { createWebHashHistory, createRouter } from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Authenticate from "./views/Authenticate.vue"
import Main from "./views/Main.vue"

const routes = [
  {
    path: "",
    name: "Authenticate",
    component: Authenticate,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
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

export default router;