// @flow

import { Platform } from 'react-native'

const platform = Platform.OS
const IOS = 'ios'
const BUTTON_TEXT_SIZE = platform === IOS ? 16 : 16
const DEFAULT_FONT_TEXT_SIZE = 12

let FONTS = {
  defaultButtonTextSize: BUTTON_TEXT_SIZE,
  defaultFontSize: DEFAULT_FONT_TEXT_SIZE,
  fontFamilyRegular: 'Exo2-Regular',
  fontFamilyBlack: 'Exo2-Bold'
}

export { FONTS }
