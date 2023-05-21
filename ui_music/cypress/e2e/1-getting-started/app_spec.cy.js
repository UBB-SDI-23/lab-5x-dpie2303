describe('Login Test', () => {
    it('Should login successfully with correct credentials', () => {
      // Visit the login page
      cy.visit('http://localhost:3000/login');
      
      // Type into username and password fields
      cy.get('input[name="username"]').type('admin_1');
      cy.get('input[name="password"]').type('Password.123');
      
      // Submit the form
      cy.get('form').submit();
  
      // Check if we have navigated to the homepage after login
      cy.url().should('eq', 'http://localhost:3000/');
  
      // Check if the correct data is in local storage
      cy.window().then((window) => {
        expect(window.localStorage.getItem('access')).to.exist;
        expect(window.localStorage.getItem('refresh')).to.exist;
        const user = JSON.parse(window.localStorage.getItem('user'));
        expect(user).to.exist;
        expect(user.username).to.equal('admin_1');
      });
    });
  });
  