document.addEventListener("DOMContentLoaded", () => {

    const SUPABASE_URL = "https://aghizlgvrhunpuxvohep.supabase.co";
    const SUPABASE_KEY = "sb_publishable_gpc7KUqUIykO3WM1aCzRfg_Myo8AKyx";

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const loginBtn = document.getElementById("loginBtn");
    const loginBox = document.getElementById("loginBox");
    const adminBox = document.getElementById("adminBox");

    const searchBtn = document.getElementById("searchBtn");
    const adminMobile = document.getElementById("adminMobile");
    const message = document.getElementById("message");
    const receipts = document.getElementById("receipts");
    const logoutBtn = document.getElementById("logoutBtn");
const uploadBtn = document.getElementById("uploadBtn");
const paperCode = document.getElementById("paperCode");
const pdfFile = document.getElementById("pdfFile");
const uploadMessage = document.getElementById("uploadMessage");

    // =========================
    // CHECK EXISTING LOGIN
    // =========================

    checkLogin();


    async function checkLogin() {

        const { data } = await supabaseClient.auth.getSession();

        if (data.session) {
            showAdminPanel();
        } else {
            showLogin();
        }
    }


    // =========================
    // LOGIN
    // =========================

    loginBtn.addEventListener("click", async () => {

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Email और Password दोनों भरिए।");
            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = "LOGGING IN...";

        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            if (!data.session) {
                throw new Error("Login session नहीं बनी।");
            }

            showAdminPanel();

        } catch (error) {

            console.error("Login Error:", error);

            alert("Login failed: " + error.message);

        } finally {

            loginBtn.disabled = false;
            loginBtn.textContent = "LOGIN";

        }
    });


    // =========================
    // SHOW ADMIN PANEL
    // =========================

    function showAdminPanel() {

        loginBox.style.display = "none";
        adminBox.style.display = "block";

        message.innerHTML = "";
        receipts.innerHTML = "";
    }


    // =========================
    // SHOW LOGIN
    // =========================

    function showLogin() {

        loginBox.style.display = "block";
        adminBox.style.display = "none";
    }


    // =========================
    // SEARCH RECEIPTS
    // =========================

    searchBtn.addEventListener("click", async () => {

        const mobile = adminMobile.value.trim();

        if (!/^[0-9]{10}$/.test(mobile)) {

            message.innerHTML =
                "Please enter a valid 10 digit mobile number.";

            return;
        }

        searchBtn.disabled = true;
        searchBtn.textContent = "SEARCHING...";

        message.innerHTML = "Searching...";
        receipts.innerHTML = "";

        try {

            const { data, error } =
                await supabaseClient
                    .from("receipts")
                    .select("*")
                    .eq("mobile_number", mobile);

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {

                message.innerHTML =
                    "No receipt found for this mobile number.";

                return;
            }

            message.innerHTML =
                data.length + " receipt(s) found.";

            let html = "";

            data.forEach((receipt, index) => {

                html += `
                    <div class="receipt">

                        <strong>
                            Receipt ${index + 1}
                        </strong>

                        <br><br>

                        ${receipt.file_name || "Receipt PDF"}

                        <br><br>

                        <button
                            class="deleteBtn"
                            data-id="${receipt.id}"
                            data-path="${receipt.file_path}"
                        >
                            DELETE RECEIPT
                        </button>

                    </div>
                `;
            });

            receipts.innerHTML = html;

            // Delete buttons
            document.querySelectorAll(".deleteBtn")
                .forEach(button => {

                    button.addEventListener("click", () => {

                        deleteReceipt(
                            button.dataset.id,
                            button.dataset.path
                        );

                    });

                });

        } catch (error) {

            console.error("Search Error:", error);

            message.innerHTML =
                "Search failed: " + error.message;

        } finally {

            searchBtn.disabled = false;
            searchBtn.textContent = "SEARCH RECEIPTS";

        }
    });


    // =========================
    // DELETE RECEIPT
    // =========================

    async function deleteReceipt(id, filePath) {

        const confirmDelete = confirm(
            "क्या आप इस receipt को permanently delete करना चाहते हैं?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            // Delete PDF from Storage
            if (filePath) {

                const { error: storageError } =
                    await supabaseClient.storage
                        .from("receipts")
                        .remove([filePath]);

                if (storageError) {
                    throw storageError;
                }
            }


            // Delete database row
            const { error: dbError } =
                await supabaseClient
                    .from("receipts")
                    .delete()
                    .eq("id", id);

            if (dbError) {
                throw dbError;
            }

            alert("Receipt successfully deleted.");

            // Refresh search
            searchBtn.click();

        } catch (error) {

            console.error("Delete Error:", error);

            alert(
                "Delete failed: " +
                error.message
            );
        }
    }


    // =========================
    // LOGOUT
    // =========================

    logoutBtn.addEventListener("click", async () => {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {

            alert(
                "Logout failed: " +
                error.message
            );

            return;
        }

        showLogin();

        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        adminMobile.value = "";

        message.innerHTML = "";
        receipts.innerHTML = "";
    });

});
