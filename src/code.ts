import { type } from 'os';
import { handleEvent, dispatch } from './codeMessageHandler'

var figmaKey = null

async function launchUI(){
	figmaKey = await figma.clientStorage.getAsync('figmaKey')
	console.log(typeof figmaKey)	
	figma.showUI(__html__, {
		width: 500,
		height: 400,
		visible: false
	});
	if(typeof figmaKey != 'undefined'){
		console.log('dispatch key')
		dispatch('figmaKey',figmaKey)
	} else {
		console.log('go to auth')
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

	dispatch('themeData', {type: 'colors', data: colors.colors.data, errors: colors.colors.errors})
	dispatch('themeData', {type: 'overlays', data: colors.overlays.data, errors: colors.overlays.errors})
	const textStyles = await getTextStyles()
	console.log(textStyles)
dispatch('themeData', {type: 'fonts', data: textStyles.fonts.data, errors: textStyles.fonts.errors})
dispatch('themeData', {type: 'typography', data: textStyles.typography.data, errors: textStyles.typography.errors})
	// // dispatch('fontsJson',textStyles.fonts)
	// // dispatch('typographyJson',textStyles.typography)
	
	dispatch('allSent')
}
