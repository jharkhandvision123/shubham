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


    // =========================
    // PDF UPLOAD
    // =========================

    const uploadBtn = document.getElementById("uploadBtn");
    const semester = document.getElementById("semester");
    const honoursSubject = document.getElementById("honoursSubject");
    const paperName = document.getElementById("paperName");
    const contentType = document.getElementById("contentType");
    const pdfFile = document.getElementById("pdfFile");
    const uploadMessage = document.getElementById("uploadMessage");


    uploadBtn.addEventListener("click", async () => {

        const selectedSemester = semester.value.trim();
        const selectedSubject = honoursSubject.value.trim();
        const selectedPaper = paperName.value.trim();
        const selectedContent = contentType.value.trim();

        const file = pdfFile.files[0];


        if (!selectedSemester) {
            uploadMessage.innerHTML = "Semester चुनिए।";
            return;
        }

        if (!selectedSubject) {
            uploadMessage.innerHTML = "Honours / Subject चुनिए।";
            return;
        }

        if (!selectedPaper) {
            uploadMessage.innerHTML = "Paper Name / Code डालिए।";
            return;
        }

        if (!selectedContent) {
            uploadMessage.innerHTML = "Content Type चुनिए।";
            return;
        }


        if (!file) {
            uploadMessage.innerHTML = "PDF file चुनिए।";
            return;
        }


        if (file.type !== "application/pdf") {
            uploadMessage.innerHTML = "सिर्फ PDF file upload करें।";
            return;
        }


        uploadBtn.disabled = true;
        uploadBtn.textContent = "UPLOADING...";
        uploadMessage.innerHTML = "Uploading...";


        try {

            const safeFileName =
                file.name.replace(/[^\w.\- ]/g, "_");


            const filePath =
                selectedSemester + "/" +
                selectedSubject + "/" +
                selectedPaper + "/" +
                selectedContent + "/" +
                Date.now() + "_" + safeFileName;


            const { error: uploadError } =
                await supabaseClient.storage
                    .from("receipts")
                    .upload(filePath, file);


            if (uploadError) {
                throw uploadError;
            }


            const { error: dbError } =
                await supabaseClient
                    .from("receipts")
                    .insert({
                        mobile_number: "0000000000",
                        file_name: file.name,
                        file_path: filePath,
                        paper_code: selectedPaper,
                        semester: selectedSemester,
                        honours_subject: selectedSubject,
                        paper_name: selectedPaper,
                        content_type: selectedContent
                    });


            if (dbError) {
                throw dbError;
            }


            uploadMessage.innerHTML =
                "PDF successfully uploaded.";


            semester.value = "";
            honoursSubject.value = "";
            paperName.value = "";
            contentType.value = "";
            pdfFile.value = "";


        } catch (error) {

            console.error("Upload Error:", error);

            uploadMessage.innerHTML =
                "Upload failed: " + error.message;

        } finally {

            uploadBtn.disabled = false;
            uploadBtn.textContent = "UPLOAD PDF";

        }

    });


    // =========================
    // SOLUTION VIDEO
    // =========================

    const addVideoBtn = document.getElementById("addVideoBtn");
    const videoSemester = document.getElementById("videoSemester");
    const videoHonoursSubject = document.getElementById("videoHonoursSubject");
    const videoPaperName = document.getElementById("videoPaperName");
    const videoTitle = document.getElementById("videoTitle");
    const videoUrl = document.getElementById("videoUrl");
    const videoMessage = document.getElementById("videoMessage");


    addVideoBtn.addEventListener("click", async () => {

        const selectedSemester =
            videoSemester.value.trim();

        const selectedSubject =
            videoHonoursSubject.value.trim();

        const selectedPaper =
            videoPaperName.value.trim();

        const selectedTitle =
            videoTitle.value.trim();

        const selectedUrl =
            videoUrl.value.trim();


        if (!selectedSemester) {
            videoMessage.innerHTML =
                "Semester चुनिए।";
            return;
        }


        if (!selectedSubject) {
            videoMessage.innerHTML =
                "Honours / Subject चुनिए।";
            return;
        }


        if (!selectedPaper) {
            videoMessage.innerHTML =
                "Paper Name / Code डालिए।";
            return;
        }


        if (!selectedUrl) {
            videoMessage.innerHTML =
                "YouTube Video Link डालिए।";
            return;
        }


        if (
            !selectedUrl.includes("youtube.com") &&
            !selectedUrl.includes("youtu.be")
        ) {
            videoMessage.innerHTML =
                "सिर्फ YouTube Video Link डालिए।";
            return;
        }


        addVideoBtn.disabled = true;
        addVideoBtn.textContent = "ADDING...";
        videoMessage.innerHTML = "Saving...";


        try {

            const { error } =
                await supabaseClient
                    .from("solution_videos")
                    .insert({
                        semester: selectedSemester,
                        honours_subject: selectedSubject,
                        paper_name: selectedPaper,
                        video_title: selectedTitle,
                        video_url: selectedUrl
                    });


            if (error) {
                throw error;
            }


            videoMessage.innerHTML =
                "Solution Video successfully added.";


            videoSemester.value = "";
            videoHonoursSubject.value = "";
            videoPaperName.value = "";
            videoTitle.value = "";
            videoUrl.value = "";


        } catch (error) {

            console.error("Video Error:", error);

            videoMessage.innerHTML =
                "Video add failed: " + error.message;

        } finally {

            addVideoBtn.disabled = false;
            addVideoBtn.textContent =
                "ADD SOLUTION VIDEO";

        }

    });


    // =========================
    // CHECK EXISTING LOGIN
    // =========================

    checkLogin();


    async function checkLogin() {

        const { data } =
            await supabaseClient.auth.getSession();


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

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        if (!email || !password) {

            alert(
                "Email और Password दोनों भरिए।"
            );

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
                throw new Error(
                    "Login session नहीं बनी।"
                );
            }


            showAdminPanel();


        } catch (error) {

            console.error("Login Error:", error);

            alert(
                "Login failed: " +
                error.message
            );


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

        const mobile =
            adminMobile.value.trim();


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
                data.length +
                " receipt(s) found.";


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


            document
                .querySelectorAll(".deleteBtn")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            deleteReceipt(
                                button.dataset.id,
                                button.dataset.path
                            );

                        }
                    );

                });


        } catch (error) {

            console.error(
                "Search Error:",
                error
            );

            message.innerHTML =
                "Search failed: " +
                error.message;


        } finally {

            searchBtn.disabled = false;
            searchBtn.textContent =
                "SEARCH RECEIPTS";

        }

    });


    // =========================
    // DELETE RECEIPT
    // =========================

    async function deleteReceipt(id, filePath) {

        const confirmDelete =
            confirm(
                "क्या आप इस receipt को permanently delete करना चाहते हैं?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            if (filePath) {

                const { error: storageError } =
                    await supabaseClient.storage
                        .from("receipts")
                        .remove([filePath]);


                if (storageError) {
                    throw storageError;
                }

            }


            const { error: dbError } =
                await supabaseClient
                    .from("receipts")
                    .delete()
                    .eq("id", id);


            if (dbError) {
                throw dbError;
            }


            alert(
                "Receipt successfully deleted."
            );


            searchBtn.click();


        } catch (error) {

            console.error(
                "Delete Error:",
                error
            );


            alert(
                "Delete failed: " +
                error.message
            );

        }

    }


    // =========================
    // LOGOUT
    // =========================

    logoutBtn.addEventListener(
        "click",
        async () => {

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

        }
    );

});
