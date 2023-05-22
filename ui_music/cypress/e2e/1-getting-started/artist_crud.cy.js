describe('Artist journey', () => {
    it('Logins as user, creates new artist, updates the artist and deletes the artist', () => {
        // User login data
        const username = 'regular_1';
        const password = 'Password.123';
        const base_url = 'http://localhost:3000';

        // Artist data
        const artist = {
            name: 'New Artist',
            sex: 'M',
            description: 'New Artist Description',
            country_of_origin: 'New Artist Country',
            birth_day: '1990-01-01',
        };

        const updatedArtist = {
            name: 'Updated Artist',
            sex: 'F',
            description: 'Updated Artist Description',
            country_of_origin: 'Updated Artist Country',
            birth_day: '1990-01-01',
        };

        // Visit the login page
        cy.visit(`${base_url}/login`);

        // Log in
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"]').click();

        cy.wait(1000);

        // Go to artists page
        cy.get('a[href="/artists"]').click();
        
        // Go to create artist page
        cy.get('[data-testid="add-artist"]').click();

        // Create artist
        cy.get('input[name="name"]').type(artist.name);
        cy.get('input[name="sex"]').type(artist.sex);
        cy.get('input[name="country_of_origin"]').type(artist.country_of_origin);
        cy.get('input[name="description"]').type(artist.description);
        cy.get('input[name="birth_day"]').type(artist.birth_day);

        // get and type into other fields if needed
        cy.get('form').submit();

        // Assert that we are redirected to the artist detail page
        cy.location('pathname').should('match', /\/artists\/\d+/);

        // get, clear, and type into other fields if needed
        cy.get('input[name="name"]').clear().type(updatedArtist.name);
        cy.get('input[name="sex"]').clear().type(updatedArtist.sex);
        cy.get('input[name="country_of_origin"]').clear().type(updatedArtist.country_of_origin);
        cy.get('input[name="description"]').clear().type(updatedArtist.description);
        cy.get('input[name="birth_day"]').clear().type(updatedArtist.birth_day);

        // Update the artist
        cy.get('button:contains("Update")').click();


        // Assert that the form fields have been updated
        cy.get('input[name="name"]').should('have.value', updatedArtist.name);
        cy.get('input[name="sex"]').should('have.value', updatedArtist.sex);
        cy.get('input[name="country_of_origin"]').should('have.value', updatedArtist.country_of_origin);
        cy.get('input[name="description"]').should('have.value', updatedArtist.description);
        cy.get('input[name="birth_day"]').should('have.value', updatedArtist.birth_day);


        // Delete the artist
        cy.get('button:contains("Delete")').click();


        // Logout
        cy.contains('Button', 'Logout').click();

        cy.window().then((window) => {
            expect(window.localStorage.getItem('access')).to.not.exist;
            expect(window.localStorage.getItem('refresh')).to.not.exist;
            expect(window.localStorage.getItem('user')).to.not.exist;
        });
    });
});
