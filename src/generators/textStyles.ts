
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
} from '../utils'


const fontMap = require('../data/fontmap.json')
//Figma doesn't give us all the data we need for fonts at the file level, we build a map from data in the org.
//Add cookies data to the .env file and run `node fontmap.js` to get everything you need.
//This needs to be regenerated every time new fonts are added to the organisation.


//Map the font-stretch property to css values
const fontStretch: Array<string> = ['ultra-condensed','extra-condensed','condensed','semi-condensed','normal','semi-expanded','expanded','extra-expanded','ultra-expanded']

export default async function(){
    //var API_Doc = API_Doc ? API_Doc : await fetchApiDoc() // Fetch once we hope
    const getTypographyNodes = async() => {
    
        //This is a rather strict way of getting what we want.. if the structure changes this will break
        const typographyPage = figma.root.findChild(n => n.name.toLowerCase().includes('typography')).id    
        var pageNodes = (await figmaFetch(`https://api.figma.com/v1/files/${fileKey}?ids=${typographyPage}`) as any).document.children.find(p => p.id == typographyPage)
    
        var styledNodes = []
        allChildren(pageNodes, hasStyles)
    
        function hasStyles(node) {
            return node.styles && node.type == "TEXT" ? styledNodes.push(node) : null;
        }
        return styledNodes
    }
    var typographyNodes = typographyNodes ? typographyNodes : await getTypographyNodes();
        
    const getFontsJson = async() => {
        let errors = []
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
                    errors.push(`${style.name} is using AUTO for lineHeight, please set it to px`)
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
            let fontSizes =  getFontSizes()
        
            // let cropArray = (Object.entries(doc.document.sharedPluginData.TextCrop)).map(
            //     (style: any ) => {
            //          return JSON.parse(style[1])
            //     });

            let cropArray = textStyles.map(style => {
                return JSON.parse(figma.root.getSharedPluginData('TextCrop', style.name))
            });
            console.log(cropArray);
            //let cropArray = [];
        
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
                            let crops = cropArray.filter((n: any) => {
                                return (n.fontName.family + '-' + n.fontName.style).replace(/\s/g,'') == value.replace(/\s/g,'')
                            }).sort((a:any,b:any) => {
                                return a.fontSize - b.fontSize
                            })
                       
                            let adjustments = {}
                            crops.forEach((crop: any) => {
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
        
        return {data:await fontsJson(), errors: errors}    
     
    }
    
    var fontsJson = fontsJson ? fontsJson : await getFontsJson(); 
       
    async function getTypographyPresets(){
           let obj = {}       
           let errors = [] 
            console.log(fontsJson.data)
        typographyNodes.forEach(style =>{
            const token = style.name.split('/')[style.name.split('/').length-1]
            
               

            //Eww this is gross
            let familyObj = getKeyByValue(fontsJson.data, Object.values(fontsJson.data).find((item: any) => item.fontFamily === `${style.style.fontPostScriptName}`))
            

            let fontWeight = getKeyByValue(fontsJson.data, style.style.fontWeight).includes('fontWeight') ? getKeyByValue(fontsJson.data,  style.style.fontWeight) : undefined
            
            let fontSize = getKeyByValue(fontsJson.data, style.style.fontSize + 'px').includes('fontSize') ? getKeyByValue(fontsJson.data,  style.style.fontSize + 'px') : undefined

            

            if(style.style.lineHeightPx % 4 != 0){
                errors.push(`${token}: line height is not a multiple of 4`)
            }

            let lineHeightEm = (Array.from(lineHeightsEm) as number[]).find(lh => {
                return Math.round((lh*style.style.fontSize)/GRID_SIZE) * GRID_SIZE == style.style.lineHeightPx
            })
  
            let lineHeight = getKeyByValue(fontsJson.data, lineHeightEm) ? getKeyByValue(fontsJson.data, lineHeightEm) : undefined;

            let letterSpacing = getKeyByValue(fontsJson.data,  style.style.letterSpacing).includes('fontLetterSpacing') ? getKeyByValue(fontsJson.data,  style.style.letterSpacing) : undefined;
            
            

            let stretch = fontStretch[fontMap[style.style.fontPostScriptName].stretch - 1]
            let isItalic = fontMap[style.style.fontPostScriptName].italic

                if(!familyObj){
                    errors.push(`${token}: Couldn't find font family`)
                }
                if(!fontWeight){
                    errors.push(`${token}: Couldn't find font weight`)
                }
                if(!fontSize){
                    errors.push(`${token}: Couldn't find font size`)
                }
                if(!lineHeight){
                    errors.push(`${token}: Couldn't find line height`)
                }
                if(!letterSpacing){
                    errors.push(`${token}: Couldn't find letter spacing`)
                }


                obj[token] = {
                "fontFamily": `{{fonts.${familyObj}.fontFamily}}`,
                "fontWeight": `{{fonts.${fontWeight}}}`,
                "fontSize": `{{fonts.${fontSize}}}`,
                "lineHeight": `{{fonts.${lineHeight}}}`,
                "letterSpacing": `{{fonts.${letterSpacing}}}`,
                "fontStretch": `${stretch}`,
                "italic": `${isItalic}`
            }
            
        })
        return {data: obj, errors: errors}
    }

    return {
        fonts: fontsJson,
        typography: await getTypographyPresets()
    }
}




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
      
        return Number.parseFloat(Number.parseFloat(returnValue).toPrecision(3))
          
        
}

function fontFaceCSS(){
    
}