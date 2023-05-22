

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

describe('User journey', () => {
  it('Registers a new user and updates their profile', () => {
    // Generate random user data
    let randomNumber = getRandomInt(1, 100000);

    const username = `test_user_${randomNumber}`;
    const email = `test_email_${randomNumber}@email.com`;
    const password = "Password.123";
    const base_url = 'http://localhost:3000'
    const date = new Date(); // current date
    date.setDate(date.getDate() - 1); // subtract 1 day
    const yesterday = date.toISOString().slice(0,10);

    // Visit the registration page
    cy.visit(`${base_url}/register`);

    // Fill in the registration form
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="password2"]').type(password);

    // Submit the form
    cy.get('button[type="submit"]').click();

    cy.wait(1000);

    // Go to login page
    cy.visit(`${base_url}/login`);

    // Log in
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait(1000);

    cy.window().then((window) => {
        expect(window.localStorage.getItem('access')).to.exist;
        expect(window.localStorage.getItem('refresh')).to.exist;
        const user = JSON.parse(window.localStorage.getItem('user'));
        expect(user).to.exist;
        expect(user.username).to.equal(username);
      });
    
    
    cy.get('[data-testid=user-profile-button]').click()
   // Update profile with random generated data
   cy.contains('label', 'Bio').parent().find('input').clear().type('test bio');
   cy.get('input[name="location"]').clear().type("test location");
   cy.get('input[name="birth_date"]').clear().type(yesterday);
   cy.get('input[name="gender"]').clear().type('F');

   // Assuming your Select component has data-testid attribute
   // cy.get('[data-testid=marital-select-button]').click({ force: true }).contains('li', 'Single').click({ force: true });
  
   cy.get('button[type="submit"]').click();

 
   // Refresh the page
   cy.reload();
   cy.wait(1000);

   // Assert the data
   cy.contains('label', 'Bio').parent().find('input').should('have.value', 'test bio');
   cy.get('input[name="location"]').should('have.value', "test location");
   cy.get('input[name="birth_date"]').should('have.value', yesterday);
   cy.get('input[name="gender"]').should('have.value', 'F');
   
   // Logout
   cy.contains('Button', 'Logout').click();

   cy.window().then((window) => {
    expect(window.localStorage.getItem('access')).to.not.exist;
    expect(window.localStorage.getItem('refresh')).to.not.exist;
    expect(window.localStorage.getItem('user')).to.not.exist;
  });



  });
});
