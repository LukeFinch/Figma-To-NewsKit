<template>
  <Toolbar/>
<button @click="saveFiles"  class="button button--primary">Export</button>
  <theme-nav/>
    <router-view v-slot="{ Component }" class="contentView">
      <transition name="fade">
      <component :is="Component"/>
      </transition>
  </router-view>
</template>
<script>
import JSZip from 'jszip'
const secrets = require('../../secrets.js').default
import Toolbar from './components/Toolbar.vue'
import Disclosure from './components/Disclosure.vue'
import jsonData from './components/jsondata.vue'
import ThemeNav from './components/ThemeNav.vue'
//import 'vue-json-pretty/lib/styles.css';
import './json-style.css'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import '@lukefinch/figmaicons/dist/figmaicons.css'
import {
  dispatch,
  handleEvent
} from "./uiMessageHandler";
import {
  computed,
  onMounted,
  ref,
} from 'vue';

import { useStore } from './store/store'
import { themeStore } from './store/themeStore'

export default {
  components: {
    Toolbar,
    ThemeNav,
    Disclosure,
    jsonData
  },
  setup() {
      const store = useStore()
      const theme = themeStore()
    

  

  const allLoaded = computed(() => {
    let val = theme.getAllSent
    return val
  })


    function saveFiles(){
    const zip = new JSZip();
    zip.file('meta.json',           JSON.stringify(theme.getMeta.data,      null,2))
    zip.file('colors.json',         JSON.stringify(theme.getColors.data,    null,2))
    zip.file('overlays.json',       JSON.stringify(theme.getOverlays.data,    null,2))
    zip.file('fonts.json',          JSON.stringify(theme.getFonts.data,     null,2))
    zip.file('typographyJson.json', JSON.stringify(theme.getTypography.data,null,2))
    zip.generateAsync({type:"blob"})
    .then(function(content) {
    // Force down of the Zip file
    saveAs(content, `${theme.getMeta.data.document_name}.zip`);
});
    }
    function saveAs(blob, filename) {
  if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
    return navigator.msSaveOrOpenBlob(blob, fileName);
  } else if (typeof navigator.msSaveBlob !== 'undefined') {
    return navigator.msSaveBlob(blob, fileName);
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    elem.style = 'display:none;opacity:0;color:transparent;';
    (document.body || document.documentElement).appendChild(elem);
    if (typeof elem.click === 'function') {
      elem.click();
    } else {
      elem.target = '_blank';
      elem.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }
    URL.revokeObjectURL(elem.href);
  }
}
  
    function gitExport(){
      const GitHub = require('github-api');

      //let user = prompt("Git Username",process.env.GITUSER)
      alert('Git Export')
      let token = secrets.GIT_TOKEN


    function GithubAPI(auth) {
    let repo;
    let filesToCommit = [];
    let currentBranch = {};
    let newCommit = {};
    this.gh = new GitHub(auth);

    this.setRepo = function(userName, repoName) {
        repo = this.gh.getRepo(userName, repoName);
    }

    this.setBranch = function(branchName) {
    return repo.listBranches()
        .then((branches) => {
            let branchExists = branches.data
                .find( branch => branch.name === branchName );
            if (!branchExists) {
                return repo.createBranch('main', branchName)
                    .then(() => {
                        currentBranch.name = branchName;
                    });
            } else {
                currentBranch.name = branchName;
            }
        });
}

this.pushFiles = function(message, files) {
    return getCurrentCommitSHA()
        .then(getCurrentTreeSHA)
        .then( () => createFiles(files) )
        .then(createTree)
        .then( () => createCommit(message) )
        .then(updateHead)
        .catch((e) => {
            console.error(e);
        });
}


function getCurrentCommitSHA() {
    return repo.getRef('heads/' + currentBranch.name)
        .then((ref) => {
            currentBranch.commitSHA = ref.data.object.sha;
        });
}

function getCurrentTreeSHA() {
    return repo.getCommit(currentBranch.commitSHA)
        .then((commit) => {
            currentBranch.treeSHA = commit.data.tree.sha;
        });
}
function createFiles(files) {
    console.log(files)
    let promises = [];
    let length = files.length;
    for (let i = 0; i < length; i++) {
        promises.push(createFile(files[i]));
    }
    return Promise.all(promises);
}
function createFile(file) {
    console.log(file)
    return repo.createBlob(file.content)
        .then((blob) => {
            filesToCommit.push({
                sha: blob.data.sha,
                path: file.path,
                mode: '100644',
                type: 'blob'
            });
        });
}
function createTree() {
    return repo.createTree(filesToCommit, currentBranch.treeSHA)
        .then((tree) => {
            newCommit.treeSHA = tree.data.sha;
        });
}
function createCommit(message) {
    return repo.commit(currentBranch.commitSHA, newCommit.treeSHA, message)
        .then((commit) => {
            newCommit.sha = commit.data.sha;
        });
}
function updateHead() {
    return repo.updateHead(
        'heads/' + currentBranch.name,
        newCommit.sha
    );
}


this.getContentObject = function(){
    return repo._getContentObject
}

};

let api = new GithubAPI({token: token});
api.setRepo('NewsKitThemesTest', 'Themes')
api.setBranch('main')
.then( () => api.pushFiles(
    'Commiting from the figma plugin',
    [       
    {path: `${theme.getMeta.data.document_name}/meta.json`,           content: JSON.stringify(theme.getMeta.data,      null,2)},
    {path: `${theme.getMeta.data.document_name}/colors.json`,         content: JSON.stringify(theme.getColors.data,    null,2)},
    {path: `${theme.getMeta.data.document_name}/overlays.json`,       content: JSON.stringify(theme.getOverlays.data,  null,2)},
    {path: `${theme.getMeta.data.document_name}/fonts.json`,          content: JSON.stringify(theme.getFonts.data,     null,2)},
    {path: `${theme.getMeta.data.document_name}/typographyJson.json`, content: JSON.stringify(theme.getTypography.data,null,2)},
    ])
)
.then(function() {
    console.log('Files committed!');
});
    }

    onMounted(() => {
      console.log('The Doc is mounted')
      dispatch('UIReady')
      const app = document.getElementById('app')
      handleEvent('themeData', data => {
        switch(data.type) {
          case 'meta':
            theme.setMeta(data.data,data.errors)
            break;
          case 'colors':
            theme.setColors(data.data,data.errors)
            break;
          case 'overlays':
            theme.setOverlays(data.data,data.errors)
            break;
          case 'fonts':
            theme.setFonts(data.data,data.errors)
            break;
          case 'typography':
            theme.setTypography(data.data,data.errors)
            break;
        }
        console.log(data)
      })

      handleEvent('allSent', _ => {
        theme.setAllSent(true)
      })

      handleEvent('fetch', async data => {
          let returnData = await fetch(data.url, data.options)
          .then(response => {            
            return response.json()
            }).then(res => {
              dispatch(data.time,res)
            }
            )
       
        })

      handleEvent('fetchTextStyles', async data => {
          await fetch(data.url, data.options)
          .then(response => {            
            return response.json()  
            }).then(res => {
              var returnData = res.meta.styles.filter(style => style.style_type == "TEXT")
              
              dispatch(data.time,returnData)
            }
            )       
        })
        


    })

    return {
      theme,
      allLoaded,
      saveFiles,
      gitExport
    };
  }

};
</script>

<style>
/* http://meyerweb.com/eric/tools/css/reset/ 
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
</style>

<style lang=scss>
.capsizedText {
  padding: 0.05px 0;
}

.capsizedText::before {	
  content: "";	
  margin-top: -0.1826em;	
  display: block;	
  height: 0;	
}

.capsizedText::after {	
  content: "";	
  margin-bottom: -0.1826em;	
  display: block;	
  height: 0;	
}

input:placeholder-shown{
  border-color: var(--black1);
}
.icon{
  background-position: center;
}
#app{
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  .contentView{
    flex-grow: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
