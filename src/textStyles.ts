
const GRID_SIZE = 4 //Assume 4px baseline grid for NewsKit themes
var lineHeightsEm = new Set()
async function fetchApiDoc () {
    return (await figmaFetch(`https://api.figma.com/v1/files/${fileKey}?depth=1&plugin_data=shared`) as any)
}

import {
    tokenFormat,
    figmaFetch,
    fileKey,
    allChildren,
    getKeyByValue,
    fetch,
} from './utils'

export default async function(){
    var API_Doc = API_Doc ? API_Doc : await fetchApiDoc() // Fetch once we hope
    const getTypographyNodes = async(doc) => {
        const pages = doc.document.children
    
        var typographyPage = pages.find(p => p.name.includes('Typography')) ? pages.find(p => p.name.includes('Typography')).id : figma.notify('Could not find a typography page');
    
        //This is a rather strict way of getting what we want.. if the structure changes this will break
        var pageNodes = (await figmaFetch(`https://api.figma.com/v1/files/${fileKey}?ids=${typographyPage}`) as any).document.children.find(p => p.id == typographyPage)
    
        var styledNodes = []
        allChildren(pageNodes, hasStyles)
    
        function hasStyles(node) {
            return node.styles && node.type == "TEXT" ? styledNodes.push(node) : null;
        }
        return styledNodes
    }
    var typographyNodes = typographyNodes ? typographyNodes : await getTypographyNodes(API_Doc);
        
    const getFontsJson = async() => {
        
        const textStyles: Array < TextStyle > = figma.getLocalTextStyles()

        
               
        const getFontSizes = () => {
            let obj = {};
            [...new Set(textStyles.map(style => style.fontSize))]
            .sort((a: any, b: any) => a - b)
                .forEach((value, index) => {
                    obj['fontSize' + tokenFormat(index)] = value + 'px'
                })
            return obj as object
        }   
    
        const getLineHeights = () => {
            let obj = {};
            //Get all the lineheights as pixel values
            let lineHeights = [...new Set(textStyles.map(style => {
                let lh
                if (style.lineHeight.unit == "AUTO") {
                    //Shouldn't use auto
                    figma.notify(`${style.name} is using AUTO for lineHeight, please set it to px`)
                    lh = "Value isn't set properly in figma, please fix and re-export theme"
                }
                if (style.lineHeight.unit == "PERCENT") {
                    lh = style.lineHeight.value / 100 * style.fontSize
                }
                if (style.lineHeight.unit == "PIXELS") {
                    lh = style.lineHeight.value
                }
                return {
                    lineHeight: lh,
                    fontSize: style.fontSize,
                    name: style.name
                }
            }))]
            
            lineHeights.forEach(style => {         
                lineHeightsEm.add(lineHeightPxToEm(style.lineHeight,style.fontSize,lineHeightsEm))        
            });

            //Get only unique values, sort them add them to returned object
            [...new Set(lineHeightsEm)].sort((a: any, b: any) => a - b).forEach((value, index) => {
                obj['fontLineHeight' + tokenFormat(index)] = value
            })
        
        
        
            return obj as object
        }
        
        const getFontWeights = async (nodes) => {
            let obj = {};
            [...new Set((nodes as unknown as Array < any > )
                .map(style => style.style.fontWeight as number))]
            .sort((a: any, b: any) => a - b)
                .forEach((value, index) => {
                    obj['fontWeight' + tokenFormat(index)] = value
                })
            return obj as object
        }
        
        const getLetterSpacing = () => {
            let obj = {};
            [...new Set(textStyles.map(style => style.letterSpacing.value))]
            .sort((a: any, b: any) => a - b)
                .forEach((size, index) => {
                    obj['fontLetterSpacing' + tokenFormat(index)] = size
                })
            return obj as object
        }    
        
        const getFontFamilies = async () => {
            let obj = {};
            let doc = API_Doc
            let fontSizes =  getFontSizes()
        
            // let cropArray = (Object.entries(doc.document.sharedPluginData.TextCrop)).map(
            //     (style: any ) => {
            //          return JSON.parse(style[1])
            //     });
            
            let cropArray = [];
        
            [...new Set((typographyNodes as unknown as Array < any > )
                .map(style => style.style.fontPostScriptName as string))]
                .sort((a: any, b: any) => a - b)
                .forEach((value, index) => {
                            let family = {}
                            family['fontFamily'] = value
                            family['cropConfig'] = {
                                top:    0,
                                bottom: 0,
                            }        
                            let crops = cropArray.filter(n => {
                                return (n.fontName.family + '-' + n.fontName.style).replace(/\s/g,'') == value.replace(/\s/g,'')
                            }).sort((a:any,b:any) => {
                                return a.fontSize - b.fontSize
                            })
                       
                            let adjustments = {}
                            crops.forEach(crop => {
                                 const sizeToken = getKeyByValue(fontSizes,crop.fontSize +'px')
                                // console.log(sizeToken,crop.fontSize,crop.before,crop.after)
                                adjustments[`{{fonts.${sizeToken}}}`] = {
                                    top: - crop.before -1, //subtract 1 for collapsing margin fix
                                    bottom: - crop.after-1                        }
                            })
                            family['cropAdjustments'] = adjustments            
                             obj['fontFamily' + tokenFormat(index)] = family            
            })   
            return obj as object
        }
        
        const fontsJson = async () => {
            return Object.fromEntries([
            //All the token groups that make up font.json
            await getFontFamilies(),
            await getFontWeights(typographyNodes), //Makes an API call
            getFontSizes(),
            getLineHeights(),
            getLetterSpacing()
        ].map(tokenGroup => {
            return Object.entries(tokenGroup)
        }).flat(1))
        }
        
        return await fontsJson()    
     
    }
    
    var fontsJson = fontsJson ? fontsJson : await getFontsJson(); 
       
    async function getTypographyPresets(){    let obj = {}
       
    console.log(lineHeightsEm)
      
        typographyNodes.forEach(style =>{
            const token = style.name.split('/')[style.name.split('/').length-1]
         

            //Eww this is gross
            let familyObj = getKeyByValue(fontsJson, Object.values(fontsJson).find((item: any) => item.fontFamily === `${style.style.fontPostScriptName}`))


            // let lineHeight = getKeyByValue(fontsJson,lineHeightPxToEm(
            //         style.style.lineHeightPx,
            //         style.style.fontSize,
            //         lineHeightsEm
            //         )).includes('fontLineHeight') ? getKeyByValue(fontsJson,lineHeightPxToEm(
            //             style.style.lineHeightPx,
            //             style.style.fontSize,
            //             lineHeightsEm
            //             )) : undefined;

            //let lineHeight = "Awaiting a fix"

            // lineHeightsEm.forEach(lh =>
            //     {
            //         let newLh = Math.round((lh*style.style.fontSize)/GRID_SIZE) * GRID_SIZE
            //         console.log(newLh, style.style.lineHeightPx)
            //     }
            //     )

            let lineHeightEm = (Array.from(lineHeightsEm) as number[]).find(lh => Math.round((lh*style.style.fontSize)/GRID_SIZE) * GRID_SIZE == style.style.lineHeightPx )
            let lineHeight = getKeyByValue(fontsJson,lineHeightEm)

            let letterSpacing = getKeyByValue(fontsJson,
                style.style.letterSpacing).includes('fontLetterSpacing') ? getKeyByValue(fontsJson,   style.style.letterSpacing) : undefined;

            obj[token] = {
                "fontFamily": `{{fonts.${familyObj}.fontFamily}}`,
                "fontWeight": `{{fonts.${getKeyByValue(fontsJson,   style.style.fontWeight)}}}`,
                "fontSize": `{{fonts.${getKeyByValue(fontsJson, style.style.fontSize + 'px')}}}`,
                "lineHeight": `{{fonts.${lineHeight}}}`,
                "letterSpacing": `{{fonts.${letterSpacing}}}`,
            }
            
        })
        return obj
    }

    return {
        fonts: fontsJson,
        typography: await getTypographyPresets()
    }
}


// function lineHeightPxToEm(lineHeight,fontSize){
//     const inc = 1 / 24 //Incremement em in 24ths
//     let adjLineHeight
//     let outputEm
//     function getFractions(num: number){
//         let fracs = []
//         for(var i = 0; i < num; i++){
//             fracs.push(((num-i)/num).toPrecision(4))
//         }
//         return fracs
//     }


//     //all the 6ths 8ths and 10ths
//     var increments = [...getFractions(6),...getFractions(7), ...getFractions(8), ...getFractions(10)]

//     //Anything larger than 4em for a lineheight is foolish
//     //We could maybe do this in reverse however
//     for (var i = 0; i < 4; i ++) {
//         if (i == 4) {
//             //Couldn't find a match, notify the user they should fix it 
//             figma.notify(`Couldn't find a line height in em for ${lineHeight}`)
//             console.error("Couldn't find a line height (probably not a multiple of gridSize)")
//             break;
//         }
//         increments.forEach(increment => {
//             let em = i + parseFloat(increment)  
//             //Keep incrementing em value
//             let estLineHeight = em * fontSize
//             //This function rounds it to grid size, if it already matches, no change
//             adjLineHeight = (Math.round((estLineHeight * fontSize) / GRID_SIZE) * GRID_SIZE) / fontSize;
//             if (adjLineHeight == lineHeight) {
//                 //If the lineHeight (em) matches up to the value after rounding to gridSize 
//                outputEm = em         
//             }
//             else {
//                 outputEm = lineHeight / fontSize
//             }
//         })
        
//     }
//     return outputEm ? outputEm.toPrecision(4) : undefined;
// }

function lineHeightPxToEm(lineHeight,fontSize,currentSet){
    //console.log(lineHeight,fontSize,currentSet)
        let gridSize = GRID_SIZE
        const fontSizePx = parseInt(fontSize, 10);
        let returnValue: any
        //console.log(`checking for height: ${lineHeight} size: ${fontSize} ${fontSizePx}`)
        if(currentSet !== null){
            currentSet.forEach(possible => {
                let lh = Math.round(((possible * fontSizePx) / gridSize)) * gridSize
                //console.log(`total: ${currentSet.length}. ${possible} multiplied by ${fontSizePx} went to ${lh}. Wanted ${lineHeight} `)
                if(lh == lineHeight){
                    returnValue = possible
                }
            })
        }
        if(!returnValue){
            // If line-height in pixels does not align to the grid, we round it up or down to nearest grid line (4px),
            // then convert back to a line-height number.
            returnValue = (Math.round((lineHeight) / gridSize) * gridSize) / fontSizePx
        }
      
        return Number.parseFloat(returnValue).toPrecision(3)
          
        
}

let myGrid = figma.createGridStyle()
myGrid.layoutGrids = [{
    pattern: "GRID",
    sectionSize: 4
    }];
myGrid.name = "My Grid Name"

