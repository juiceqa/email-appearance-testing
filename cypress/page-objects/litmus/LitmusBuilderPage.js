class LitmusBuilderPage {
  open() {
    cy.visit("/folders/78809/emails/2929982/builder")
    this.waitForPageLoading()
  }

  waitForPageLoading() {
    cy.wait("@category")
  }

  clickRunEmailPreviews() {
    cy.get("iframe.builder").then(function ($iframe) {
      const $body = $iframe.contents().find("body")
      cy.wrap($body).contains("Email Previews").click({ force: true })
    })
  }

  selectConfiguration(deviceName) {
    cy.wait(Cypress.env("waitTime"))
    cy.get("iframe.builder").then(function ($iframe) {
      const $body = $iframe.contents().find("body")
      cy.wrap($body).contains(deviceName).should("exist").click({ force: true })
    })
  }

  closeConfigView() {
    cy.get("iframe.builder").then(function ($iframe) {
      const $body = $iframe.contents().find("body")
      cy.wrap($body).find(".icon-cross").first().click({ force: true })
    })
  }

  downloadImage(fullPath, fileName) {
    cy.wait(Cypress.env("waitTime"))
    cy.get("iframe.builder").then(function ($iframe) {
      const $body = $iframe.contents().find("body")
      cy.wrap($body)
        .find(".result img")
        .then(($image) => {
          cy.wrap($image).then(() => {
            const imageUrl = $image.first().attr("src")
            cy.log("imageUrl: " + imageUrl)
            cy.downloadFile(imageUrl, fullPath, fileName)
          })
        })
    })
  }

  saveNotificationForConfig(config, name_part) {
    const fullPath = `cypress/fixtures/${Cypress.env(
      "notificationScreenFolder"
    )}`
    const actualFileName = `${config} ${name_part}.png`
    this.downloadImage(fullPath, actualFileName)
  }

  getFixtureFromFolder(folderName, fileName) {
    return cy.fixture(`${folderName}/${fileName}`)
  }

  routeRequests() {
    cy.server()
    cy.route({
      method: "GET",
      url: "/checklist/usage/status",
    }).as("status")
    cy.route({
      method: "GET",
      url: "/checklist/tests/*/cat",
    }).as("category")
  }
}

export default new LitmusBuilderPage()
