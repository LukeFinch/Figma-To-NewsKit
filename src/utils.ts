export const secrets = require('../secrets.js').default

export const fileKey = figma.fileKey

import {
    dispatch,
    handleEvent
} from "./codeMessageHandler";


export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

export const fetch = async function (url: string, options: object) {
    const timestamp = Date.now().toString()
  
    dispatch('fetch', {
        url: url,
        options: options,
        time: timestamp
    })
    
    const returnData: any = await new Promise((resolve, reject) => {
        handleEvent(timestamp, (data: FigmaApiStyles) => {
            if(data.error){
                reject(data)
            } else {
                
                resolve(data)
            }
        })
        
    })
    
    return returnData
}

export const figmaFetch = async function(url){
    return await fetch(url,{'headers': {'X-Figma-Token':secrets.FIGMA_API}})
}

export const fetchTextStyles = async function (url: string, options: object) {
    const timestamp = Date.now.toString()
    dispatch('fetchTextStyles', {
        url: url,
        options: options,
        time: timestamp
    })

    const returnData: any = await new Promise((resolve, reject) => {
        handleEvent(timestamp, (data: FigmaApiStyles) => {
            if(data.error){
                reject(data)
            } else {
                resolve(data)
            }
        })

    })

    return returnData
}

export const APIStyles =  async function () {
    const styles = await fetchTextStyles(`https://api.figma.com/v1/files/${fileKey}/styles`,{'headers': {'X-Figma-Token':secrets.FIGMA_API}})
    return styles
}

export const tokenFormat = function (index: number) {
    index += 1;
    return new Array(+3 + 1 - (index * 10 + '').length).join('0') + index * 10;
}

export function allChildren(node,callFunction){
    if(node.children){
        for(var i = 0; i < node.children.length; i++){
            var child = node.children[i]
            allChildren(child,callFunction)
            callFunction(child)
        }
    }
    
}

interface FigmaApiStyles{
    error: boolean;
    meta: {
        styles: Array<Object>
    };
    status: number
}

import matrixInverse from 'matrix-inverse'

export function applyMatrixToPoint(matrix: number[][], point: number[]) {
	return [
		point[0] * matrix[0][0] + point[1] * matrix[0][1] + matrix[0][2],
		point[0] * matrix[1][0] + point[1] * matrix[1][1] + matrix[1][2]
	]
}

export function extractLinearGradientParamsFromTransform(
	shapeWidth: number,
	shapeHeight: number,
	t: Transform
) {
	const transform = t.length === 2 ? [...t, [0, 0, 1]] : [...t]
	const mxInv = matrixInverse(transform)
	const startEnd = [
		[0, 0.5],
		[1, 0.5]
	].map((p) => applyMatrixToPoint(mxInv, p))
	return {
		start: [startEnd[0][0] * shapeWidth, startEnd[0][1] * shapeHeight],
		end: [startEnd[1][0] * shapeWidth, startEnd[1][1] * shapeHeight]
	}
}

export function parseGradient(p: GradientPaint) {

    let angle = 180 //angleBetween(gradient.from(), gradient.to())
    let type = ''
    switch (p.type) {
      case 'GRADIENT_LINEAR':
        type = "linear-gradient"
        let angleData = extractLinearGradientParamsFromTransform(1, 1,p.gradientTransform)
        angle = angleBetween(angleData.start, angleData.end) + 90
        break;
      case 'GRADIENT_RADIAL':
        type = "radial-gradient"
        break;
      case 'GRADIENT_ANGULAR':
        type = "angular-gradient"
        break;
    }
    let stops = p.gradientStops
    let str = []
    stops.forEach((stop: ColorStop) => {
      //We wanted to have gradients be made up of two tokens, but alpha values made things awkard.
      // let colorToken = colorPalette.getKeyByValue(`${MSColorToRGBA(stop.color())}`)
      // str.push(` ${colorToken} ${(stop.position().toFixed(4)*100)}%`)
  
      str.push(`${rgbaString(stop.color)} ${((stop.position)*100).toFixed(4)}%`)
  
  
    })
  
    let output = `${type}(${angle}deg, ${str.join(',')})`
  
    return output
  }

  function angleBetween(p1: Array<number>, p2: Array<number>) {
    let angleDeg = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
    return Math.round(angleDeg) as number
  }

  export function rgbaString(color: RGBA){
    return `rgba(${color.r * 255},${color.g * 255},${color.b * 255},${color.a})` as string
}