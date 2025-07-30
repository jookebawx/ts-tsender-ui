
import basicSetup from '../wallet-setup/basic.setup'
import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const { expect } = test;

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/);
});

test("should show the airdrop form when connected to a wallet", async ({ page, context, metamaskPage, extensionId }) => {
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
  const customNetwork = {
    name: 'Anvil',
    rpcUrl: 'http://127.0.0.1:8545',
    chainId: 31337,
    symbol: 'ETH'
  }
  await metamask.addNetwork(customNetwork);
  await metamask.switchNetwork(customNetwork.name);

  await page.goto('/');
  await expect(page.getByText('Please connect your wallet....')).toBeVisible()
  await page.getByTestId('rk-connect-button').click();

  await page.getByTestId('rk-wallet-option-metaMask').waitFor({
    state: 'visible',
  });

  await page.getByTestId('rk-wallet-option-metaMask').click();


  await metamask.connectToDapp()



  // const approveButton = metamaskPage.locator('button', { hasText: 'Approve' });
  // if (await approveButton.isVisible()) {
  //   await approveButton.click();
  // }

  await page.bringToFront();
  await expect(page.getByText("Token Address")).toBeVisible();

})

