import Actions from '../../helpers/actions'
import commonElsPage from '../commonEls.page'
import coreLoc from '../../locators/burgerMenu/coreSettings.loc'

class coreSettings {
  get sendFeebback() {
    return by.text(coreLoc.sendFeedback)
  }

  get reportABug() {
    return by.text(coreLoc.reportABug)
  }

  get productFeedback() {
    return by.text(coreLoc.productFeedback)
  }

  get legal() {
    return by.text(coreLoc.legal)
  }

  get termsOfUse() {
    return by.text(coreLoc.termsOfUse)
  }

  get privacyPolicy() {
    return by.text(coreLoc.privacyPolicy)
  }

  async verifySendFeedbackPage() {
    await Actions.waitForElement(this.sendFeebback)
    await Actions.waitForElement(this.reportABug)
    await Actions.waitForElement(this.productFeedback)
  }

  async verifyLegalPage() {
    await Actions.waitForElement(this.legal)
    await Actions.waitForElement(this.termsOfUse)
    await Actions.waitForElement(this.privacyPolicy)
  }

  async tapReportABug() {
    await Actions.tapElementAtIndex(this.reportABug, 0)
  }

  async tapTermsOfUse() {
    await Actions.tapElementAtIndex(this.termsOfUse, 0)
  }

  async tapPrivacyPolicy() {
    await Actions.tapElementAtIndex(this.privacyPolicy, 0)
  }

  async tapSwitchToTestnetButton() {
    await Actions.tapElementAtIndex(commonElsPage.disabledSwitch, 0)
  }

  async tapProductFeedback() {
    await Actions.tapElementAtIndex(this.productFeedback, 0)
  }
}

export default new coreSettings()
