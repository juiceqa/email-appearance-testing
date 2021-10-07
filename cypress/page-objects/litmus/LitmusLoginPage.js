import LitmusBuilderPage from "./LitmusBuilderPage"

class LitmusLoginPage {
  open() {
    cy.viewport(1280, 720)
    cy.visit("/folders/78809/emails/3555576/checklist")
  }

  login(login, password) {
    cy.get("#email").type(login)
    cy.get("#password").type(password)
    cy.get('button:contains("Sign in")').click({ force: true })
    cy.wait("@status")
  }
}

export default new LitmusLoginPage()
