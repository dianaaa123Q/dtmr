async function signInUser(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const password = passwordInput.value;

    // Simple email validation
    if (!email || !password) {
        console.error("Please enter both email and password.");
        return;
    }

    const apiUrl = 'https://656951d1de53105b0dd6e610.mockapi.io/user';

    try {
        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();

            const matchingUser = data.find(user => user.email === email && user.password === password);

            if (matchingUser) {
                console.log("User signed in successfully:", matchingUser);

                // Save user ID to local storage
                localStorage.setItem('userId', matchingUser.id);
                
                let userName =  matchingUser.name;
                localStorage.setItem('userName', userName);
                
                window.location.replace('main.html');
            } else {
                console.error("Invalid email or password. Please try again.");
            }
        } else {
            console.error(`Failed to fetch user data from the database. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error during the sign-in process:", error);
    }
}

// Hook up the function to the form submit event
document.getElementById('signin-form').addEventListener('submit', signInUser);
