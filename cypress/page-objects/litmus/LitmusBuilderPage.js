
class LitmusBuilderPage {

    get iFrameLoadingTimeout() {
        return 5000;
    }

    waitForPageLoading() {
        cy.wait('@category');
    }

    clickRunEmailPreviews() {
        cy.get('iframe.builder').then(function ($iframe) {
            const $body = $iframe.contents().find('body');
            cy.wrap($body).contains("Email Previews").click({force: true});
        })
    }

    selectDevice(deviceName) {
        cy.wait(this.iFrameLoadingTimeout);
        cy.get('iframe.builder').then(function ($iframe) {
            const $body = $iframe.contents().find('body');
            cy.wrap($body).contains(deviceName).click({force: true});
        })
    }


    closeDeviceView() {
        cy.wait(5000);
        cy.get('iframe.builder').then(function ($iframe) {
            const $body = $iframe.contents().find('body');
            cy.wrap($body).find('.icon-cross').first().click({force: true});
        })
    }

    downloadImage(fullPath, fileName) {
        cy.wait(this.iFrameLoadingTimeout);
        cy.get('iframe.builder').then(function ($iframe) {
            const $body = $iframe.contents().find('body');
            cy.wrap($body).find('.result img').then(($image => {
                cy.wrap($image).then(() => {
                    const imageUrl = $image.first().attr('src');
                    cy.log("imageUrl: " + imageUrl);
                    cy.downloadFile(imageUrl, fullPath, fileName);
                })
            }))
        })
    }

    checkDeviceNotificationImage(deviceName) {
        const folderName = Cypress.env('notificationScreenFolder');
        const fullPath = `cypress/fixtures/${folderName}`;
        const actualFileName = `${deviceName} Actual.png`;
        const expectedFileName = `${deviceName} Expected.png`;
        this.downloadImage(fullPath, actualFileName);
        this.compareImages(folderName, expectedFileName, actualFileName);
    }

    compareImages(folderName, expectedFileName, actualFileName) {
        const fileType = 'image/png';
        cy.log('expectedFileName: ' + expectedFileName);
        this.getFixtureFromFolder(folderName, expectedFileName).then(expectedScreen => {
            this.getFixtureFromFolder(folderName, actualFileName).then(actualScreen => {
                Cypress.Blob.base64StringToBlob(actualScreen, fileType).then((actualBlob) => {
                    Cypress.Blob.base64StringToBlob(expectedScreen, fileType).then((expectedBlob) => {
                        expect(actualBlob).to.deep.equal(expectedBlob);
                    })
                })
            })
        })
    }

    getFixtureFromFolder(folderName, fileName) {
        return cy.fixture(`${folderName}/${fileName}`)
    }

    routeRequests() {
        cy.server()
        cy.route({
            method: 'GET',
            url: '/checklist/usage/status',
        }).as('status');
        cy.route({
            method: 'GET',
            url: '/checklist/tests/*/cat',
        }).as('category');
    }
}

export default new LitmusBuilderPage();