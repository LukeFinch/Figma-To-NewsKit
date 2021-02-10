import {useStore } from './store/store'


//Split camelCase into words[]
function splitWords(s) {
    var re, match, output = [];
    // re = /[A-Z]?[a-z]+/g
    re = /([A-Za-z]?)([a-z]+)/g;

    /*
    matches example: "oneTwoThree"
    ["one", "o", "ne"]
    ["Two", "T", "wo"]
    ["Three", "T", "hree"]
    */

    match = re.exec(s);
    while (match) {
        // output.push(match.join(""));
        output.push([match[1].toUpperCase(), match[2]].join(""));
        match = re.exec(s);
    }

    return output;

}

export function prettifyJSON(data, idx){
    var idx = idx ? idx : 0
    let str = JSON.stringify(data, null, '\t')
    let arr = str.split('\n')
    
    let prevCat = null
    arr.forEach((item,index) => {
      
     let cat = splitWords(item)[idx]
     let cats = 0 
      if(prevCat !== cat && index != 1 && index != arr.length -1){
        cats ++ 
        if (cats >= 1){
        arr[index-1] += '\n'
        cats = 0
        }
      }
     prevCat = cat
    })
    
    str = arr.join('\n')
    return str
    }