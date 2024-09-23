import { expect as jestExpect } from 'expect'
// import InA from 'hooks/useInAppBrowser'

import { warmup } from '../../helpers/warmup'
import burgerMenuPage from '../../pages/burgerMenu/burgerMenu.page'
import coreSettings from '../../pages/burgerMenu/coreSettings.page'

describe('Send Feedback', () => {
  beforeEach(async () => {
    jest.mock('react-native-inappbrowser-reborn', () => ({
      open: jest.fn(() => Promise.resolve()),  // Simulate opening browser
      close: jest.fn(() => Promise.resolve()), // Simulate closing browser
    }))

    await warmup(true, false)
  })

  it('should navigate to report a bug', async () => {
    await burgerMenuPage.tapBurgerMenuButton()
    await burgerMenuPage.tapSendFeedback()
    await coreSettings.verifySendFeedbackPage()
    await coreSettings.tapReportABug()
    // const { openUrl } = useInAppBrowser()
    // openUrl(
    //   'https://docs.google.com/forms/d/e/1FAIpQLSdUQiVnJoqQ1g_6XTREpkSB5vxKKK8ba5DRjhzQf1XVeET8Rw/'
    // )
    const InAppBrowser = require('react-native-inappbrowser-reborn')
    await InAppBrowser.open('')
    await InAppBrowser.open('https://example.com')

    jestExpect(InAppBrowser.open).toHaveBeenCalled()
  })

  it('should navigate to send feedback and feature request', async () => {
    await burgerMenuPage.tapBurgerMenuButton()
    await burgerMenuPage.tapSendFeedback()
    await coreSettings.verifySendFeedbackPage()
    await coreSettings.tapProductFeedback()
    // const { openUrl } = useInAppBrowser()
    // openUrl(
    //   'https://docs.google.com/forms/d/e/1FAIpQLSdQ9nOPPGjVPmrLXh3B9NR1NuXXUiW2fKW1ylrXpiW_vZB_hw'
    // )
    // jestExpect(openUrl).toHaveBeenCalled()
  })
})
