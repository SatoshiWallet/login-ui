// @flow

import React, { Component } from 'react'
import { Text, View } from 'react-native'

import s from '../../../../common/locales/strings'
import HeaderConnector from '../../../connectors/componentConnectors/HeaderConnector'
import UsernameConnector from '../../../connectors/componentConnectors/UsernameConnector'
import { Button } from '../../common'
import SafeAreaView from '../../common/SafeAreaViewGradient.js'

type Props = {
  styles: Object,
  username: string,
  checkUsernameForAvailabilty(string): void
}
type State = {
  isProcessing: boolean
}
export default class LandingScreenComponent extends Component<Props, State> {
  componentWillMount () {
    this.setState({
      isProcessing: false
    })
  }
  componentDidUpdate (prevProps: Props) {
    if (this.props !== prevProps) {
      this.setState({
        isProcessing: false
      })
    }
  }

  render () {
    const { NewAccountUsernameScreenStyle } = this.props.styles
    return (
      <SafeAreaView>
        <View style={NewAccountUsernameScreenStyle.screen}>
          <HeaderConnector style={NewAccountUsernameScreenStyle.header} />
          <View style={NewAccountUsernameScreenStyle.pageContainer}>
            <View style={NewAccountUsernameScreenStyle.instructions}>
              <Text style={NewAccountUsernameScreenStyle.instructionsText}>
                {s.strings.username_desc}
              </Text>
            </View>
            <UsernameConnector
              style={NewAccountUsernameScreenStyle.inputBox}
              onFinish={this.onNextPress}
            />
            <View style={NewAccountUsernameScreenStyle.shim} />
            <Button
              onPress={this.onNextPress.bind(this)}
              downStyle={NewAccountUsernameScreenStyle.nextButton.downStyle}
              downTextStyle={
                NewAccountUsernameScreenStyle.nextButton.downTextStyle
              }
              upStyle={NewAccountUsernameScreenStyle.nextButton.upStyle}
              upTextStyle={NewAccountUsernameScreenStyle.nextButton.upTextStyle}
              label={s.strings.next_label}
              isThinking={this.state.isProcessing}
              doesThink
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }
  onNextPress = () => {
    if (this.props.usernameErrorMessage) {
      return
    }
    this.setState({
      isProcessing: true
    })
    this.props.checkUsernameForAvailabilty(this.props.username)
  }
}
