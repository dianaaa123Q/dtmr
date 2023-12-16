window.currentUser = null;

async function findUser(event) {
  event.preventDefault();

  // Get form input values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const apiUrl = 'https://656951d1de53105b0dd6e610.mockapi.io/user';

  try {
    // Fetch existing users
    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json(); // Define data here

      // Check if user with the same email already exists
      const existingUser = data.find(user => user.email === email);

      if (existingUser) {
        console.error("User with this email already exists.");
      } else {
        // Create a new user (you might want to handle this part based on your API structure)
        const newUser = { name, email, password };

        // Save the new user to the API
        const saveResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        });

        if (saveResponse.ok) {
          const responseData = await saveResponse.json();
          const newUserId = responseData.id; // Assuming the API response contains the ID
          
          localStorage.setItem('userName', responseData.name);
          console.log("User registered successfully. ID:", newUserId);
          localStorage.setItem('userId', newUserId);
          window.location.href = 'main.html';
        } else {
          console.error("Failed to register user. Please try again later.");
        }
      }
    } else {
      console.error("Failed to fetch user data from the database.");
    }
  } catch (error) {
    console.error("Error during the registration process:", error);
  }
}

// Hook up the function to the form submit event
document.getElementById('signup-form').addEventListener('submit', findUser);
