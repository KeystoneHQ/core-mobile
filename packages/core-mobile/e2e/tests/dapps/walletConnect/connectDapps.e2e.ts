import { warmup } from '../../../helpers/warmup'
import browserPage from '../../../pages/browser.page'
import plusMenuPage from '../../../pages/plusMenu.page'
import connectToSitePage from '../../../pages/connectToSite.page'

describe('Dapp Wallet Connect - Others', () => {
  beforeEach(async () => {
    await warmup(true)
  })

  it('should connect UniSwap via Wallet Connect', async () => {
    await browserPage.connectTo('https://app.uniswap.org/')
    const qrUri = await browserPage.getQrUri()
    await plusMenuPage.connectWallet(qrUri)
    await connectToSitePage.selectAccountAndconnect()
  })

  it('should connect TraderJoe via Wallet Connect', async () => {
    await browserPage.connectTo('https://lfj.gg/avalanche')
    const qrUri = await browserPage.getQrUri()
    await plusMenuPage.connectWallet(qrUri)
    await connectToSitePage.selectAccountAndconnect()
  })

  it('should connect OpenSea via Wallet Connect', async () => {
    await browserPage.connectTo('https://opensea.io/')
    const qrUri = await browserPage.getQrUri()
    await plusMenuPage.connectWallet(qrUri)
    await connectToSitePage.selectAccountAndconnect()
    await connectToSitePage.approveSignMessage(
      'OpenSea, the largest NFT marketplace'
    )
  })
})
