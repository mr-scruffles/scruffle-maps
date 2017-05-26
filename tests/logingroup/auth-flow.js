// This end to end test describes a basic auth flow to login and verify the user has logged in.
module.exports = {
  '@tags': ['login', 'sanity'],
  before: (browser) => {
    browser
    .useXpath()
    .url(browser.launchUrl)
    .maximizeWindow();
  },
  'navigate to app': (browser) => {
    browser
    .waitForElementVisible("//div[contains(@class, 'navbar')]", 20000);
  },
  'login through auth0': (browser) => {
    browser
    .click("//*[@id='myButton']")
    .waitForElementPresent("//div[contains(@class, 'auth0-lock-container')]", 20000)
    .pause(2000)
    .setValue("//input[@type='email']", 'test@test.com')
    .pause(2000)
    .setValue("//input[@type='password']", '1234')
    .click("//span[contains(@class, 'auth0-label-submit')]")
    .pause(2000);
  },
  'verify login': (browser) => {
    browser
    .getText("//*[@id='myButton']/span", (result) => {
      console.log(result.value);
      browser.assert.equal(result.value, 'Logout');
    });
  },
  'close test': (browser) => {
    browser
      .closeWindow()
      .end();
  },
};
