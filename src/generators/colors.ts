import { parseGradient, getKeyByValue } from "../utils"

const namesRGB = ['r', 'g', 'b']

type webRGB = [number, number, number]
type webRGBA = [number, number, number, number]

function wrapRGBA(rgba: Array<number>)
{
        return `rgba(${rgba.join(',')})`
}

function figmaRGBToWebRGB(color): any {
	const rgb = []

	namesRGB.forEach((e, i) => {
		rgb[i] = Math.round(color[e] * 255)
	})

	if (color['a'] !== undefined) rgb[3] = Math.round(color['a'] * 100) / 100
	return rgb
}


const paints: PaintStyle[] = figma.getLocalPaintStyles()

function getPalettes(){
    let obj = {}
    paints.filter(p => p.name.startsWith('palettes')).map(p => {
        const style = getCSSForPaint(p)
        let name = style.name.split('/')[style.name.split('/').length -1].trim()
        obj[name] = style.color
    })
    return obj
}
const palettes = getPalettes()

function getOverlays(){
    let obj = {}
    paints.filter(p => p.name.startsWith('overlay')).map(p => {
        const style = getCSSForPaint(p)
        obj[style.name] = style.color
    })
    return obj
}

function getThemedColors(){
    let obj = {}
    let errors = []
    paints.filter(p => p.name.startsWith('ink') || p.name.startsWith('interactive') || p.name.startsWith('interface')).map(p => {
        const style = getCSSForPaint(p)
        const token = getKeyByValue(palettes, style.color)
        let name = style.name.split('/')[style.name.split('/').length -1].trim()
        if(!token){
            errors.push(`${name}: couldn't find palette to match`)
        }
        obj[name] = `{{colors.${token}}}`
    })
    return {data: obj, errors: errors}
}

export default function(){

    const colors =  Object.fromEntries([
        //All the token groups that make up colors.json
        getPalettes(),
        getThemedColors()
    ].map(tokenGroup => {
        return Object.entries(tokenGroup)
    }).flat(1))

    return {
        colors: colors,
        overlays: getOverlays()
    }
}




function getCSSForPaint(p: PaintStyle){
    let name = p.name
    let color
    if(p.paints.length > 1){
        console.error(`Too many paints for style: ${p.name}`)
        figma.notify(`Error: Too many paints for style: ${p.name}`)        
    } else {
        if(p.paints[0].type == "SOLID"){
            let c = p.paints[0]
            let rgba = {
                r: c.color.r,
                g: c.color.g,
                b: c.color.b,
                a: c.opacity.toPrecision(4)
            }
            let k = figmaRGBToWebRGB(rgba)
            color = wrapRGBA(k)
        } 
        if ( p.paints[0].type !== "SOLID" && p.paints[0].type !== "IMAGE" ){
            color =  parseGradient(p.paints[0])
        }
    }
    return{
        name: name,
        color: color
    }

}