```javascript
const SUPABASE_URL = "https://aghizlgvrhunpuxvohep.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_gpc7KUqUIykO3WM1aCzRfg_Myo8AKyx";

const loginBox = document.getElementById("loginBox");
const adminBox = document.getElementById("adminBox");

const loginBtn = document.getElementById("loginBtn");
const searchBtn = document.getElementById("searchBtn");
const logoutBtn = document.getElementById("logoutBtn");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const mobileInput = document.getElementById("adminMobile");

const message = document.getElementById("message");
const receiptsDiv = document.getElementById("receipts");


// ==============================
// LOGIN
// ==============================

loginBtn.addEventListener("click", async function () {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "LOGGING IN...";

    try {

        const response = await fetch(
            SUPABASE_URL + "/auth/v1/token?grant_type=password",
            {
                method: "POST",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        console.log("Login response:", data);

        if (!response.ok) {
            throw new Error(
                data.error_description ||
                data.msg ||
                data.message ||
                "Login failed."
            );
        }

        localStorage.setItem(
            "admin_access_token",
            data.access_token
        );

        localStorage.setItem(
            "admin_refresh_token",
            data.refresh_token
        );

        loginBox.style.display = "none";
        adminBox.style.display = "block";

        message.textContent = "Login successful.";

    } catch (error) {

        console.error("Login error:", error);

        alert("Login failed: " + error.message);

    } finally {

        loginBtn.disabled = false;
        loginBtn.textContent = "LOGIN";

    }

});


// ==============================
// SEARCH RECEIPTS
// ==============================

searchBtn.addEventListener("click", async function () {

    const mobile = mobileInput.value.trim();

    if (!/^[0-9]{10}$/.test(mobile)) {
        alert("Please enter a valid 10 digit mobile number.");
        return;
    }

    const token =
        localStorage.getItem("admin_access_token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "SEARCHING...";

    receiptsDiv.innerHTML = "";
    message.textContent = "";

    try {

        const url =
            SUPABASE_URL +
            "/rest/v1/receipts" +
            "?mobile_number=eq." +
            encodeURIComponent(mobile) +
            "&select=*";

        const response = await fetch(url, {

            method: "GET",

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + token
            }

        });

        const data = await response.json();

        console.log("Receipt search:", data);

        if (!response.ok) {
            throw new Error(
                data.message ||
                data.details ||
                JSON.stringify(data)
            );
        }

        if (!data || data.length === 0) {

            message.textContent =
                "No receipt found.";

            return;
        }

        message.textContent =
            data.length + " receipt(s) found.";


        data.forEach(function (receipt, index) {

            const receiptDiv =
                document.createElement("div");

            receiptDiv.className = "receipt";

            receiptDiv.innerHTML = `

                <strong>
                    Receipt ${index + 1}
                </strong>

                <br><br>

                ${receipt.file_name || "Receipt PDF"}

                <br>

                Mobile:
                ${receipt.mobile_number}

                <br><br>

                <button
                    class="deleteBtn"
                    data-id="${receipt.id}"
                >
                    DELETE THIS RECEIPT
                </button>

            `;

            receiptsDiv.appendChild(receiptDiv);

        });


        // DELETE BUTTONS

        document
            .querySelectorAll(".deleteBtn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        deleteReceipt(
                            button.dataset.id,
                            mobile
                        );

                    }
                );

            });


    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        message.textContent =
            "Search failed: " + error.message;

    } finally {

        searchBtn.disabled = false;
        searchBtn.textContent =
            "SEARCH RECEIPTS";

    }

});


// ==============================
// DELETE RECEIPT
// ==============================

async function deleteReceipt(id, mobile) {

    const token =
        localStorage.getItem("admin_access_token");

    if (!token) {
        alert("Please login again.");
        return;
    }


    const confirmDelete = confirm(
        "Are you sure you want to delete this receipt?"
    );

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            SUPABASE_URL +
            "/rest/v1/receipts?id=eq." +
            encodeURIComponent(id),
            {

                method: "DELETE",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + token
                }

            }
        );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.message ||
                errorData.details ||
                JSON.stringify(errorData)
            );

        }


        alert(
            "Receipt deleted successfully."
        );


        // Refresh receipt list

        searchBtn.click();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Delete failed: " +
            error.message
        );

    }

}


// ==============================
// LOGOUT
// ==============================

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "admin_access_token"
        );

        localStorage.removeItem(
            "admin_refresh_token"
        );

        adminBox.style.display = "none";
        loginBox.style.display = "block";

        emailInput.value = "";
        passwordInput.value = "";
        mobileInput.value = "";

        receiptsDiv.innerHTML = "";
        message.textContent = "";

    }
);
```
