//Provides some info about the theme
import { figmaFetch, fileKey } from '../utils'
export default async function(){
    var meta = {}
    const APIKEY = await figma.clientStorage.getAsync('APIKEY')
    const user = await figmaFetch('https://api.figma.com/v1/me')

    meta['document_name'] = figma.root.name
    meta['filekey'] = fileKey
    meta['exporter_name'] = user.handle
    meta['exporter_email'] = user.email
    return meta
}