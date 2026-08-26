import * as React from 'react'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { Form } from './form'
import { Button } from './button'
import { Ref } from './ref'

/** Text shown before the device flow code has been fetched. */
export const BrowserRedirectMessage =
  "We'll open your browser and give you a short code to enter there. Once you approve it, GitHub Desktop signs you in automatically \u2014 you can come straight back here."

interface IAuthenticationFormProps {
  /**
   * A callback which is invoked if the user requests OAuth sign in using
   * their system configured browser.
   */
  readonly onBrowserSignInRequested: () => void

  /**
   * Present once the device flow has produced a code. While absent we're
   * either idle or still asking GitHub for one.
   */
  readonly deviceFlow?: {
    readonly userCode: string
    readonly verificationURI: string
  }

  /**
   * An array of additional buttons to render after the "Sign In" button.
   * (Usually, a 'cancel' button)
   */
  readonly additionalButtons?: ReadonlyArray<JSX.Element>
}

/** The GitHub authentication component. */
export class AuthenticationForm extends React.Component<IAuthenticationFormProps> {
  public render() {
    return (
      <Form className="sign-in-form" onSubmit={this.signInWithBrowser}>
        {this.props.deviceFlow
          ? this.renderDeviceFlow(this.props.deviceFlow)
          : this.renderEndpointRequiresWebFlow()}
      </Form>
    )
  }

  /**
   * Show the code the user has to type into their browser, along with a way
   * back to the verification page in case the automatic launch was blocked or
   * the tab was closed.
   */
  private renderDeviceFlow(deviceFlow: {
    readonly userCode: string
    readonly verificationURI: string
  }) {
    return (
      <>
        <p className="device-flow-instructions">
          Enter this code at <Ref>{deviceFlow.verificationURI}</Ref> to finish
          signing in. Keep this window open — it'll continue automatically once
          you approve.
        </p>
        <div className="device-flow-user-code" role="status">
          {deviceFlow.userCode}
        </div>
        {this.props.additionalButtons}
      </>
    )
  }

  /**
   * Show a message informing the user they must sign in via the web flow
   * and a button to do so
   */
  private renderEndpointRequiresWebFlow() {
    return (
      <>
        {BrowserRedirectMessage}
        <Button
          type="submit"
          className="button-with-icon"
          onClick={this.signInWithBrowser}
          autoFocus={true}
          role="link"
        >
          Sign in using your browser
          <Octicon symbol={octicons.linkExternal} />
        </Button>
        {this.props.additionalButtons}
      </>
    )
  }

  private signInWithBrowser = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault()
    this.props.onBrowserSignInRequested()
  }
}
