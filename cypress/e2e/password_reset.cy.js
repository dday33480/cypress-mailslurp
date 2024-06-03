describe('Account creation and password reset', function () {

    // create Mailslurp email address before launching test
    before( () => {
        cy.mailslurp({ 
            apiKey: Cypress.env('MAILSLURP_API_KEY')
        })
        .then(mailslurp => mailslurp.createInbox())
        .then( inbox => {
            cy.wrap(inbox.id).as('inbox');
            cy.wrap(inbox.emailAddress).as('email');
        });
    });
    

 

    it.skip('Create account', function () {

        //Visit the homepage
        cy.visit('https://preprod.backmarket.fr/')

        //Cookie banner (accept all)
        cy.get('[data-qa="accept-cta"]').click()

        //Access to login page of the site
        cy.get('[data-test="icon-avatar"]').click()
        cy.url('https://accounts.preprod.backmarket.fr/fr-fr/email').should('contains', '/email')

        //Check that new email and inbox exist
        expect(this.inbox).exist
        expect(this.email).exist

        //Register email address
        cy.get('[name="email"]').type(this.email)
        cy.get('#submit-login').should('have.text', "C'est moi").click()

        //Fill out signup form
        cy.url('https://accounts.preprod.backmarket.fr/fr-fr/email/signup').should('contains', '/email/signup')
        cy.get('[type="password"]').type('Password1')
        cy.get('[name="first_name"]').type("John")
        cy.get('[name="last_name"]').type("Doe")
        cy.get('#submit-signup').click()
    })

    it('Reset password', function () {

        //Set login variables
        const emailAddress = this.email;
        const inboxId = this.inbox;

        //Go to homepage
        cy.visit('https://preprod.backmarket.fr/fr-fr')

        //Cookie banner (accept all)
        cy.get('[data-qa="accept-cta"]').click()
        cy.wait(1000)

        //Access to login page of the site
        cy.get('[data-test="icon-avatar"]').click()
        cy.url('https://accounts.preprod.backmarket.fr/fr-fr/email', {timeout : 3000}).should('contains', '/email')

        //Enter used email address for the account
        cy.get('#email').type(this.emailAddress)
        cy.get('#submit-login').should('have.text', "C'est moi").click()

        //Click oin password reset link
        cy.get('a').eq(2).click()
        cy.url('https://preprod.backmarket.fr/fr-fr/password-reset').should('contain', "password-reset")
        cy.get('[type="email"]').should("have.value", emailAddress)
        cy.get('[data-qa="password-reset-submit-button"]').click()
        cy.wait(6000)

        //Open mailSlurp service to access email info
        cy.mailslurp({
            apiKey: Cypress.env('MAILSLURP_API_KEY')
        }).then( function (mailslurp) {
            return mailslurp.waitForLatestEmail(inboxId, 120_000, true)
        }).then(email => {

            //Set variables to obtain the url given in the email
            const hrefRegex = /<a\s+href="([^"]+)"/gm
            const emailText = email.body
            const match = emailText.match(hrefRegex)
            const linkMatch = match[1]
            const linkSanitize = linkMatch.replace("<a href=\"", "")
            const link = linkSanitize.replace('"','')

            //Navigate to the url given in the email and submit new password
            cy.visit(link)
            cy.get('[type="password"]').eq('0').type('Password123')
            cy.get('[type="password"]').eq('1').type('Password123')
            cy.get('[type="submit"]').eq('1').click()
        })
    })
})