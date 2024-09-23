import { expect as jestExpect } from 'expect'
import useInAppBrowser from 'hooks/useInAppBrowser'
import { warmup } from '../../helpers/warmup'
import burgerMenuPage from '../../pages/burgerMenu/burgerMenu.page'

describe('Help Center', () => {
  jest.mock('hooks/useInAppBrowser', () => ({
    __esModule: true,
    default: jest.fn(() => ({
      openUrl: jest.fn()
    }))
  }))
  beforeAll(async () => {
    await warmup()
  })

  it('should navigate to Help Center', async () => {
    const HELP_URL = 'https://support.avax.network/en/'
    await burgerMenuPage.tapBurgerMenuButton()
    await burgerMenuPage.tapHelpCenter()
    const open = useInAppBrowser().openUrl(HELP_URL)
    jestExpect(open).toHaveBeenCalled()
  })
})
