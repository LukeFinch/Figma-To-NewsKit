import { handleEvent, dispatch } from './codeMessageHandler'

console.log(handleEvent)

figma.showUI(__html__, {
	width: 400,
	height: 400
});




import getTextStyles from './textStyles';
import getColors from './colors'


handleEvent("resizeUI", (size) => {
	figma.ui.resize(size[0],size[1])
})

handleEvent("UIReady", _ => {
console.log('ready')
 sendThemeToUI()
})

async function sendThemeToUI(){

	const colors = getColors()
	dispatch('colors',colors.colors)
	
	const textStyles = await getTextStyles()
	
	dispatch('fontsJson',textStyles.fonts)
	dispatch('typographyJson',textStyles.typography)
	

}
