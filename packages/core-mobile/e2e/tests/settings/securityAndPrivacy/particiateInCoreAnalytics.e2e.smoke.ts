/* eslint-env detox/detox, jest */
/**
 * @jest-environment ./environment.ts
 */
import BurgerMenuPage from '../../../pages/burgerMenu/burgerMenu.page'
import { warmup } from '../../../helpers/warmup'
import commonElsPage from '../../../pages/commonEls.page'

describe('Core Analystics', () => {
  beforeAll(async () => {
    await warmup(false, true)
  })

  it('should store initial analytics setup', async () => {
    await BurgerMenuPage.tapBurgerMenuButton()
    await BurgerMenuPage.tapSecurityAndPrivacy()
    await commonElsPage.isSwitchOn(true)
  })

  it('Should set new analytics setup', async () => {
    await commonElsPage.tapSwitch(false)
    await commonElsPage.isSwitchOn(false)
    await commonElsPage.tapBackButton()
    await BurgerMenuPage.dismissBurgerMenu()
    await BurgerMenuPage.tapBurgerMenuButton()
    await BurgerMenuPage.tapSecurityAndPrivacy()
    await commonElsPage.isSwitchOn(false)
  })
})
