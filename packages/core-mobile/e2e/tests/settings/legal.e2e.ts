import { expect as jestExpect } from 'expect'
import useInAppBrowser from 'hooks/useInAppBrowser'
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from 'resources/Constants'
import { warmup } from '../../helpers/warmup'
import burgerMenuPage from '../../pages/burgerMenu/burgerMenu.page'
import coreSettings from '../../pages/burgerMenu/coreSettings.page'

describe('Legal', () => {
  beforeEach(async () => {
    jest.clearAllMocks()

    jest.mock('hooks/useInAppBrowser', () => ({
      __esModule: true,
      default: jest.fn(() => ({
        openUrl: jest.fn()
      }))
    }))

    await warmup(true, false)
  })

  it('should navigate to Terms of Use ', async () => {
    await burgerMenuPage.tapBurgerMenuButton()
    await burgerMenuPage.tapLegal()
    await coreSettings.verifyLegalPage()
    await coreSettings.tapTermsOfUse()
    const open = useInAppBrowser().openUrl(TERMS_OF_USE_URL)
    jestExpect(open).toHaveBeenCalled()
  })

  it('should navigate to Privacy Policy ', async () => {
    await burgerMenuPage.tapBurgerMenuButton()
    await burgerMenuPage.tapSendFeedback()
    await coreSettings.verifyLegalPage()
    await coreSettings.tapPrivacyPolicy()
    const open = useInAppBrowser().openUrl(PRIVACY_POLICY_URL)
    jestExpect(open).toHaveBeenCalled()
  })
})
