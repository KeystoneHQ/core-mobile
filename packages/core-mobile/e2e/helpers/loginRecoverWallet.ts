import CreatePinPage from '../pages/createPin.page'
import AnalyticsConsentPage from '../pages/analyticsConsent.page'
import commonElsPage from '../pages/commonEls.page'
import nameWalletPage from '../pages/nameWallet.page'
import ExistingRecoveryPhrasePage from '../pages/existingRecoveryPhrase.page'
import accountManagePage from '../pages/accountManage.page'
import existingRecoveryPhrasePage from '../pages/existingRecoveryPhrase.page'
import Actions from '../helpers/actions'

class LoginRecoverWallet {
  async recoverMnemonicWallet(isBalanceNotificationOn: boolean) {
    const recoveryPhrase: string = process.env.E2E_MNEMONIC as string
    await ExistingRecoveryPhrasePage.tapAccessExistingWallet()
    await ExistingRecoveryPhrasePage.tapRecoveryPhraseBtn()
    await AnalyticsConsentPage.tapNoThanksBtn()
    await ExistingRecoveryPhrasePage.enterRecoveryPhrase(recoveryPhrase)
    await ExistingRecoveryPhrasePage.tapSignInBtn()
    await nameWalletPage.enterWalletName('testWallet1\n')
    await CreatePinPage.tapNumpadZero()
    await CreatePinPage.tapNumpadZero()
    await CreatePinPage.tapAgreeAndContinueBtn()
    await commonElsPage.tapGetStartedButton()
    if (isBalanceNotificationOn) {
      await commonElsPage.tapTurnOnNotifications()
    } else {
      await commonElsPage.tapNotNow()
    }
  }

  async enterPin() {
    await CreatePinPage.tapNumpadZero6Times()
    await commonElsPage.checkIfMainnet()
  }

  async recoverWalletLogin(isBalanceNotificationOn: boolean) {
    const isVisibleNo = await Actions.expectToBeVisible(
      existingRecoveryPhrasePage.forgotPinBtn
    )

    if (isVisibleNo) {
      await this.enterPin()
      await accountManagePage.switchToFirstAccount()
    } else {
      await this.recoverMnemonicWallet(isBalanceNotificationOn)
    }
  }
}

export default new LoginRecoverWallet()
