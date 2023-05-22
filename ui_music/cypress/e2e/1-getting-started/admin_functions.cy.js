describe('Admin journey', () => {
    it('Logins as admin, updates a user to admin, verifies update and deletes the user', () => {
      // Admin login data
      const username = 'admin_1';
      const password = 'Password.123';
      const base_url = 'http://localhost:3000';
  
      // Visit the login page
      cy.visit(`${base_url}/login`);
  
      // Log in
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password);
      cy.get('button[type="submit"]').click();
  
      cy.wait(1000);
  
      // Go to edit user page
      cy.visit(`${base_url}/admin/users`);
  
      // Search for a user
      cy.get('input[name="user_search"]').type('test_user');
      cy.get('button').contains('Filter').click();
      
      cy.wait(1000);
  
      // Click on the first user
      cy.get('[data-testid^="view-details-"]').first().click();
      
      cy.wait(1000);

      cy.get('input[name="username"]')
        .invoke('val')
        .as('username'); // Set an alias for the username
  
      // Unmark the user as regular and set as admin
      cy.get('input[name="is_regular"]').uncheck();
      cy.get('input[name="is_admin"]').check();
      cy.get('button').contains('Update User').click();
  
      // Refresh the page
      cy.reload();
      cy.wait(1000);
  
    //   // Assert the user is an admin
    cy.get('input[name="is_admin"]').should('be.checked');
    cy.get('input[name="is_regular"]').should('not.be.checked');

    
    // Delete the user
    cy.get('button').contains('Delete User').click();


        cy.get('@username') // Get the value by its alias
    .then((username) => {
        // Check if the user still exists
        cy.get('input[name="user_search"]').type(username);
        cy.wait(1000);
        cy.get('[data-testid^="view-details-"]').should('not.exist');
    });


        // Logout
    cy.contains('Button', 'Logout').click();

    cy.window().then((window) => {
        expect(window.localStorage.getItem('access')).to.not.exist;
        expect(window.localStorage.getItem('refresh')).to.not.exist;
        expect(window.localStorage.getItem('user')).to.not.exist;
    });

  
    });



  });
  