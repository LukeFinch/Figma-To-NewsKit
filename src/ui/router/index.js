import { createWebHashHistory, createRouter } from "vue-router";
import Splash from "./views/Splash.vue";
import About from "./views/About.vue";
import Authenticate from "./views/Authenticate.vue"
import Theme from "./views/Theme.vue"
import {useStore} from "../store/store"


import meta from "./views/Theme/meta.vue"
import colors from "./views/Theme/colors.vue"
import fonts from "./views/Theme/fonts.vue"
import overlays from "./views/Theme/overlays.vue"
import typography from "./views/Theme/typography.vue"
import ThemeContainer from './views/ThemeContainer.vue'




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
  {   name: 'Theme',
      path: '/theme/:id', component: ThemeContainer,
     children: [
        // UserHome will be rendered inside User's <router-view>
        // when /user/:id is matched
        { path: '', component: meta },
				
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        { path: 'colors', component: colors },
        { path: 'overlays', component: overlays },
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        { path: 'fonts', component: fonts },
        { path: 'typography', component: typography },
      ]
    },
  // {
  //   path: "/theme/",
  //   name: "Theme",
  //   component: Theme,
  //    children: [
  //     {path: '',
  //     name: 'Meta',
  //     component: meta},
  //     {path: 'colors',
  //     name: 'Colors',
  //     component: colors},
  //     {path: 'overlays',
  //     name: 'Overlays',
  //     component: overlays},
  //     {path: 'fonts',
  //     name: 'Fonts',
  //     component: fonts},
  //     {path: 'typography',
  //     name: 'Typography',
  //     component: typography}
  //   ],
  //   meta: {requiresAuth: true},
  // },
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

router.afterEach((to,from,next) => {
console.log(from,'->', to)

})

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