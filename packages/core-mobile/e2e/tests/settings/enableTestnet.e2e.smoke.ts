import assert from '../../helpers/assertions'
import action from '../../helpers/actions'
import networksManagePage from '../../pages/networksManage.page'
import PortfolioPage from '../../pages/portfolio.page'
import { warmup } from '../../helpers/warmup'
import advancedPage from '../../pages/burgerMenu/advanced.page'
import commonElsPage from '../../pages/commonEls.page'
import bottomTabsPage from '../../pages/bottomTabs.page'
import burgerMenuPage from '../../pages/burgerMenu/burgerMenu.page'

describe('Enable Testnet', () => {
  beforeAll(async () => {
    await warmup()
  })

  afterAll(async () => {
    await commonElsPage.tapBackButton()
    await bottomTabsPage.tapPortfolioTab()
    await advancedPage.switchToMainnet()
  })

  it('should store toggle', async () => {
    await burgerMenuPage.tapBurgerMenuButton()
    await burgerMenuPage.tapAdvanced()
    await action.waitForElement(commonElsPage.disabledSwitch)
    await advancedPage.tapSwitchToTestnetButton()
    await assert.isVisible(commonElsPage.testnetBanner)
    await assert.isVisible(commonElsPage.enabledSwitch)
    await burgerMenuPage.exitBurgerMenu()

    await burgerMenuPage.tapBurgerMenuButton()
    await burgerMenuPage.tapAdvanced()
    await action.waitForElement(commonElsPage.enabledSwitch)
    await advancedPage.tapSwitchToMainnetButton()
    await assert.isNotVisible(commonElsPage.testnetBanner)
    await assert.isVisible(commonElsPage.disabledSwitch)
  })

  it('Should verify Avax Network', async () => {
    await advancedPage.switchToTestnet()
    await PortfolioPage.tapAvaxNetwork()
    await assert.isVisible(PortfolioPage.avaxNetwork)
  })

  it('Should verify Bitcoin & Eth Sepolia Networks', async () => {
    await PortfolioPage.tapNetworksDropdown()
    await PortfolioPage.tapManageNetworks()
    await networksManagePage.tapNetworksTab()
    await networksManagePage.searchNetworks('Ethereum Sepolia')
    await assert.count(networksManagePage.ethereumSepoliaNetwork, 2)
    await networksManagePage.searchNetworks('Bitcoin Testnet')
    await assert.count(networksManagePage.bitcoinTestnetNetwork, 2)
  })
})
