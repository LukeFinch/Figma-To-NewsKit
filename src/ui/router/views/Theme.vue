<template>
<div id="ui">

<ThemeNav/>

  
<h1>{{$route.path}}</h1>


</div>

</template>

<script>
import JSZip from 'jszip'
const secrets = require('../../../../secrets').default
import Disclosure from '../../components/Disclosure.vue'
import jsonData from '../../components/jsondata.vue'
import ThemeNav from '../../components/ThemeNav.vue'
//import 'vue-json-pretty/lib/styles.css';
import '../../json-style.css'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import '@lukefinch/figmaicons/dist/figmaicons.css'
import {
  dispatch,
  handleEvent
} from "../../uiMessageHandler";
import {
  computed,
  onMounted,
  ref,
} from 'vue';

import { useStore } from '../../store/store'
import { themeStore } from '../../store/themeStore'

export default {
  components: {
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




    })

    return {
      theme,
      // metaJson,
      // metaErr,
      // colorsJson,
      // colorsErr,
      // overlaysJson,
      // overlaysErr,
      // fontsJson,
      // fontsErr,
      // typographyJson,
      // typographyErr,
      allLoaded,
      saveFiles,
      gitExport
    };
  }

};
</script>

<style scoped>
#ui{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: var(--size-medium);
}

.icon{
  background-position: 0 0;
}

.type-red{
  color: var(--red)
}
</style>