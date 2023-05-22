

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  function checkAlert(attempts = 0) {
    // Max number of attempts to find and visit the confirmation link
    const maxAttempts = 10;
  
    cy.window().then((win) => {
        cy.wrap(win).should((win) => {
          if (win.alert) {
            cy.on('window:alert', (str) => {
              let confirmLink = str.split(' ').slice(-1); 
              cy.visit(confirmLink);
            });
          } else if (attempts >= maxAttempts) {
            // If alert didn't appear after maxAttempts, stop checking
            throw new Error('Could not find confirmation link after 10 attempts');
          } else {
            // If alert didn't appear, wait 1 second and check again
            cy.wait(1000);
            attempts++;
            // Repeat the assertion until it passes
            return false;
          }
        });
      });

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
    cy.get('input[name="bio"]').type("test bio");
    cy.get('input[name="location"]').clear().type("test location");
    cy.get('input[name="birth_date"]').clear().type(yesterday);
    cy.get('input[name="gender"]').clear().type('F');

    cy.get('select[name="marital_status"]').select('Single');

    // Submit the profile form
    cy.get('button[type="submit"]').click();

    // Logout
    cy.visit('/logout');
  });
});
