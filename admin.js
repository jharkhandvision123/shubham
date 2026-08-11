document.addEventListener("DOMContentLoaded", () => {

    const loginBtn = document.getElementById("loginBtn");
    const loginBox = document.getElementById("loginBox");
    const adminBox = document.getElementById("adminBox");

    loginBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Email और Password दोनों भरिए।");
            return;
        }

        // यहाँ आपके Supabase login का code आएगा
        alert("LOGIN BUTTON WORKING");
    });

});
