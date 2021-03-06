/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */
require('module-alias/register');

const {expect} = require('chai');

// Import utils
const helper = require('@utils/helpers');
const loginCommon = require('@commonTests/loginBO');

// Import pages
const LoginPage = require('@pages/BO/login');
const DashboardPage = require('@pages/BO/dashboard');
const EmailThemesPage = require('@pages/BO/design/emailThemes');
const PreviewEmailThemesPage = require('@pages/BO/design/emailThemes/preview');

// Import test context
const testContext = require('@utils/testContext');

const baseContext = 'functional_BO_design_emailThemes_previewEmailThemes';


let browserContext;
let page;

// Init objects needed
const init = async function () {
  return {
    loginPage: new LoginPage(page),
    dashboardPage: new DashboardPage(page),
    emailThemesPage: new EmailThemesPage(page),
    previewEmailThemesPage: new PreviewEmailThemesPage(page),
  };
};

describe('Preview Email themes classic and modern', async () => {
  // before and after functions
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);
    page = await helper.newTab(browserContext);

    this.pageObjects = await init();
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });
  // Login into BO and go to taxes page
  loginCommon.loginBO();
  it('should go to design > email themes page', async function () {
    await testContext.addContextItem(this, 'testIdentifier', 'goToEmailThemesPage', baseContext);

    await this.pageObjects.dashboardPage.goToSubMenu(
      this.pageObjects.dashboardPage.designParentLink,
      this.pageObjects.dashboardPage.emailThemeLink,
    );

    await this.pageObjects.emailThemesPage.closeSfToolBar();

    const pageTitle = await this.pageObjects.emailThemesPage.getPageTitle();
    await expect(pageTitle).to.contains(this.pageObjects.emailThemesPage.pageTitle);
  });

  describe('Preview email themes', async () => {
    const tests = [
      {args: {emailThemeName: 'classic', numberOfLayouts: 50}},
      {args: {emailThemeName: 'modern', numberOfLayouts: 50}},
    ];

    tests.forEach((test) => {
      it(`should preview email theme ${test.args.emailThemeName} and check number of layouts`, async function () {
        await testContext.addContextItem(
          this,
          'testIdentifier',
          `previewEmailTheme_${test.args.emailThemeName}`,
          baseContext,
        );

        await this.pageObjects.emailThemesPage.previewEmailTheme(test.args.emailThemeName);

        const pageTitle = await this.pageObjects.emailThemesPage.getPageTitle();

        await expect(pageTitle).to.contains(
          `${this.pageObjects.previewEmailThemesPage.pageTitle} ${test.args.emailThemeName}`,
        );

        const numberOfLayouts = await this.pageObjects.previewEmailThemesPage.getNumberOfLayoutInGrid();
        await expect(numberOfLayouts).to.equal(test.args.numberOfLayouts);
      });

      it('should go back to email themes page', async function () {
        await testContext.addContextItem(
          this,
          'testIdentifier',
          `backToEmailThemePageFrom${test.args.emailThemeName}`,
          baseContext,
        );

        await this.pageObjects.previewEmailThemesPage.goBackToEmailThemesPage();
        const pageTitle = await this.pageObjects.emailThemesPage.getPageTitle();
        await expect(pageTitle).to.contains(this.pageObjects.emailThemesPage.pageTitle);
      });
    });
  });
});
