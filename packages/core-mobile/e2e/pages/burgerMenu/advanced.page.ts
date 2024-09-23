import Actions from '../../helpers/actions'
import commonElsPage from '../commonEls.page'
import Assert from '../../helpers/assertions'
import BurgerMenuPage from './burgerMenu.page'

class Advanced {
  async tapSwitchToTestnetButton() {
    await Actions.tapElementAtIndex(commonElsPage.disabledSwitch, 0)
  }

  async tapSwitchToMainnetButton() {
    await Actions.tapElementAtIndex(commonElsPage.enabledSwitch, 0)
  }

  async switchToTestnet() {
    try {
      await Assert.isVisible(commonElsPage.testnetBanner)
    } catch (error) {
      await BurgerMenuPage.tapBurgerMenuButton()
      await BurgerMenuPage.tapAdvanced()
      await Actions.waitForElement(commonElsPage.disabledSwitch)
      await this.tapSwitchToTestnetButton()
      await BurgerMenuPage.tapBackbutton()
      await BurgerMenuPage.swipeLeft()
    }
  }

  async switchToMainnet() {
    try {
      await Assert.isVisible(commonElsPage.testnetBanner)
      await BurgerMenuPage.tapBurgerMenuButton()
      await BurgerMenuPage.tapAdvanced()
      await Actions.waitForElement(commonElsPage.enabledSwitch)
      await this.tapSwitchToMainnetButton()
      await BurgerMenuPage.exitBurgerMenu()
    } catch (e) {
      console.log('You are on mainnet')
    }
  }
}

export default new Advanced()
