import { handleEvent, dispatch } from './codeMessageHandler'

var figmaKey = null

async function launchUI(){
	figmaKey = await figma.clientStorage.getAsync('figmaKey')
	console.log(figmaKey)	
	figma.showUI(__html__, {
		width: 500,
		height: 400,
		visible: false
	});
	if(figmaKey){
		dispatch('figmaKey',figmaKey)
	} else {
		dispatch('goToAuth')
	}

}
launchUI();
handleEvent('splashReady', data => {
	figma.ui.show();
})



import meta from './generators/meta'
import getTextStyles from './generators/textStyles';
import getColors from './generators/colors'


handleEvent('saveFigmaKey', key => {
	figma.clientStorage.setAsync('figmaKey',key)
})

handleEvent("resizeUI", (size) => {
	figma.ui.resize(size[0],size[1])
})

handleEvent("UIReady", _ => {
console.log('ready')
 sendThemeToUI()
})

async function sendThemeToUI(){

	// handleEvent('themeData', data => {
    //     theme.setData(data.type,data.data,data.errors)
	//   })
	
	dispatch('themeData', {type: 'meta', data: await meta(), errors: []})
	//dispatch('metaJson',await meta())
	const colors = await getColors()
	console.log(colors)
	dispatch('themeData', {type: 'colors', data: colors.colors.data, errors: colors.colors.errors})
	dispatch('themeData', {type: 'overlays', data: colors.overlays.data, errors: colors.overlays.errors})
	// dispatch('colorsJson',colors.colors)
	// console.log(colors.overlays)
	// dispatch('overlaysJson',colors.overlays)
	
	const textStyles = await getTextStyles()
	dispatch('themeData', {type: 'fonts', data: textStyles.fonts.data, errors: textStyles.fonts.errors})
	dispatch('themeData', {type: 'typography', data: textStyles.typography.data, errors: textStyles.typography.errors})
	// dispatch('fontsJson',textStyles.fonts)
	// dispatch('typographyJson',textStyles.typography)
	
	dispatch('allSent')
}
