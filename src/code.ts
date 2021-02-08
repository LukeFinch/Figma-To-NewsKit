import { handleEvent, dispatch } from './codeMessageHandler'

//lazy workaround for now..
const secrets = require('../secrets.js').default
figma.clientStorage.setAsync('APIKEY',secrets.FIGMA_API)

figma.showUI(__html__, {
	width: 400,
	height: 400
});



import meta from './generators/meta'
import getTextStyles from './generators/textStyles';
import getColors from './generators/colors'


handleEvent("resizeUI", (size) => {
	figma.ui.resize(size[0],size[1])
})

handleEvent("UIReady", _ => {
console.log('ready')
 sendThemeToUI()
})

async function sendThemeToUI(){

	dispatch('metaJson',await meta())
	const colors = await getColors()
	dispatch('colorsJson',colors.colors)
	console.log(colors.overlays)
	dispatch('overlaysJson',colors.overlays)
	
	const textStyles = await getTextStyles()
	
	dispatch('fontsJson',textStyles.fonts)
	dispatch('typographyJson',textStyles.typography)
	

}
