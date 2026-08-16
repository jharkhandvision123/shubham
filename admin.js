document.addEventListener("DOMContentLoaded", () => {

    const SUPABASE_URL = "https://aghizlgvrhunpuxvohep.supabase.co";
    const SUPABASE_KEY = "sb_publishable_gpc7KUqUIykO3WM1aCzRfg_Myo8AKyx";

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


    // =========================
    // LOGIN / ADMIN ELEMENTS
    // =========================

    const loginBtn = document.getElementById("loginBtn");
    const loginBox = document.getElementById("loginBox");
    const adminPanel = document.getElementById("adminPanel");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginMessage = document.getElementById("loginMessage");


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
    // DELETE CONTENT ELEMENTS
    // =========================

    const deleteType =
        document.getElementById("deleteType");

    const deleteSemester =
        document.getElementById("deleteSemester");

    const deleteSubject =
        document.getElementById("deleteSubject");

    const deletePaper =
        document.getElementById("deletePaper");

    const deleteContentType =
        document.getElementById("deleteContentType");

    const searchDeleteBtn =
        document.getElementById("searchDeleteBtn");

    const deleteMessage =
        document.getElementById("deleteMessage");

    const deleteResults =
        document.getElementById("deleteResults");


    // =========================
    // SEARCH CONTENT
    // =========================

    searchDeleteBtn.addEventListener("click", async () => {

        const type =
            deleteType.value.trim();

        const selectedSemester =
            deleteSemester.value.trim();

        const selectedSubject =
            deleteSubject.value.trim();

        const selectedPaper =
            deletePaper.value.trim();

        const selectedContent =
            deleteContentType.value.trim();


        if (!type) {
            deleteMessage.innerHTML =
                "Content Type चुनिए।";
            return;
        }

        if (!selectedSemester) {
            deleteMessage.innerHTML =
                "Semester चुनिए।";
            return;
        }

        if (!selectedSubject) {
            deleteMessage.innerHTML =
                "Honours / Subject चुनिए।";
            return;
        }

        if (!selectedPaper) {
            deleteMessage.innerHTML =
                "Paper Name / Code डालिए।";
            return;
        }

        if (type === "PDF" && !selectedContent) {
            deleteMessage.innerHTML =
                "PDF Type चुनिए।";
            return;
        }


        searchDeleteBtn.disabled = true;
        searchDeleteBtn.textContent =
            "SEARCHING...";

        deleteMessage.innerHTML =
            "Searching...";

        deleteResults.innerHTML = "";


        try {

            // =========================
            // SEARCH PDF
            // =========================

            if (type === "PDF") {

                const { data, error } =
                    await supabaseClient
                        .from("receipts")
                        .select("*")
                        .eq("semester", selectedSemester)
                        .eq("honours_subject", selectedSubject)
                        .eq("paper_name", selectedPaper)
                        .eq("content_type", selectedContent);


                if (error) {
                    throw error;
                }


                if (!data || data.length === 0) {

                    deleteMessage.innerHTML =
                        "इस जानकारी के लिए कोई PDF नहीं मिली।";

                    return;
                }


                deleteMessage.innerHTML =
                    data.length + " PDF मिली।";


                let html = "";


                data.forEach((file, index) => {

                    html += `
                        <div class="receipt">

                            <strong>
                                PDF ${index + 1}
                            </strong>

                            <br><br>

                            ${file.file_name || "PDF File"}

                            <br><br>

                            <button
                                class="deleteContentBtn"
                                data-type="PDF"
                                data-id="${file.id}"
                                data-path="${file.file_path}"
                            >
                                DELETE PDF
                            </button>

                        </div>
                    `;

                });


                deleteResults.innerHTML = html;

            }


            // =========================
            // SEARCH VIDEO
            // =========================

            if (type === "VIDEO") {

                const { data, error } =
                    await supabaseClient
                        .from("solution_videos")
                        .select("*")
                        .eq("semester", selectedSemester)
                        .eq("honours_subject", selectedSubject)
                        .eq("paper_name", selectedPaper);


                if (error) {
                    throw error;
                }


                if (!data || data.length === 0) {

                    deleteMessage.innerHTML =
                        "इस Paper के लिए कोई Solution Video नहीं मिला।";

                    return;
                }


                deleteMessage.innerHTML =
                    data.length +
                    " Solution Video मिली।";


                let html = "";


                data.forEach((video, index) => {

                    html += `
                        <div class="receipt">

                            <strong>
                                Video ${index + 1}
                            </strong>

                            <br><br>

                            ${video.video_title || "Solution Video"}

                            <br><br>

                            <button
                                class="deleteContentBtn"
                                data-type="VIDEO"
                                data-id="${video.id}"
                            >
                                DELETE VIDEO
                            </button>

                        </div>
                    `;

                });


                deleteResults.innerHTML = html;

            }


            // =========================
            // DELETE BUTTON EVENTS
            // =========================

            document
                .querySelectorAll(".deleteContentBtn")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const itemType =
                                button.dataset.type;

                            const id =
                                button.dataset.id;

                            const path =
                                button.dataset.path || "";


                            deleteContent(
                                itemType,
                                id,
                                path
                            );

                        }
                    );

                });


        } catch (error) {

            console.error(
                "Content Search Error:",
                error
            );


            deleteMessage.innerHTML =
                "Search failed: " +
                error.message;

        } finally {

            searchDeleteBtn.disabled = false;

            searchDeleteBtn.textContent =
                "SEARCH CONTENT";

        }

    });


    // =========================
    // DELETE CONTENT
    // =========================

    async function deleteContent(
        type,
        id,
        filePath
    ) {

        const confirmDelete =
            confirm(
                type === "PDF"
                    ? "क्या आप इस PDF को permanently delete करना चाहते हैं?"
                    : "क्या आप इस Solution Video को permanently delete करना चाहते हैं?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            // =========================
            // DELETE PDF
            // =========================

            if (type === "PDF") {

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
                    "PDF successfully deleted."
                );

            }


            // =========================
            // DELETE VIDEO
            // =========================

            if (type === "VIDEO") {

                const { error } =
                    await supabaseClient
                        .from("solution_videos")
                        .delete()
                        .eq("id", id);


                if (error) {
                    throw error;
                }


                alert(
                    "Solution Video successfully deleted."
                );

            }


            searchDeleteBtn.click();


        } catch (error) {

            console.error(
                "Delete Content Error:",
                error
            );


            alert(
                "Delete failed: " +
                error.message
            );

        }

    }


    // =========================
    // CHECK ADMIN SESSION
    // =========================

    async function checkLogin() {

        try {

            const { data, error } =
                await supabaseClient.auth.getSession();


            if (error) {
                throw error;
            }


            if (data.session) {

                showAdminPanel();

            } else {

                showLogin();

            }

        } catch (error) {

            console.error(
                "Session Error:",
                error
            );

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


        loginMessage.innerHTML = "";


        if (!email || !password) {

            loginMessage.innerHTML =
                "Email और Password दोनों भरिए।";

            return;
        }


        loginBtn.disabled = true;
        loginBtn.textContent =
            "LOGGING IN...";


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

            console.error(
                "Login Error:",
                error
            );


            loginMessage.innerHTML =
                "Login failed: " +
                error.message;


        } finally {

            loginBtn.disabled = false;
            loginBtn.textContent =
                "LOGIN";

        }

    });


    // =========================
    // SHOW ADMIN PANEL
    // =========================

    function showAdminPanel() {

        loginBox.style.display = "none";

        if (adminPanel) {
            adminPanel.style.display = "block";
        }

        const adminBox =
            document.getElementById("adminBox");

        if (adminBox) {
            adminBox.style.display = "block";
        }

        loginMessage.innerHTML = "";

    }


    // =========================
    // SHOW LOGIN
    // =========================

    function showLogin() {

        loginBox.style.display = "block";

        if (adminPanel) {
            adminPanel.style.display = "none";
        }

    }


    // =========================
    // AUTH STATE CHANGE
    // =========================

    supabaseClient.auth.onAuthStateChange(
        (event, session) => {

            if (session) {

                showAdminPanel();

            } else {

                showLogin();

            }

        }
    );


    // =========================
    // SEARCH RECEIPTS
    // =========================

    const searchBtn =
        document.getElementById("searchBtn");

    const adminMobile =
        document.getElementById("adminMobile");

    const message =
        document.getElementById("message");

    const receipts =
        document.getElementById("receipts");


    searchBtn.addEventListener("click", async () => {

        const mobile =
            adminMobile.value.trim();


        if (!/^[0-9]{10}$/.test(mobile)) {

            message.innerHTML =
                "Please enter a valid 10 digit mobile number.";

            return;
        }


        searchBtn.disabled = true;
        searchBtn.textContent =
            "SEARCHING...";

        message.innerHTML =
            "Searching...";

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

    async function deleteReceipt(
        id,
        filePath
    ) {

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


    // =========================
    // START SECURITY CHECK
    // =========================

    checkLogin();

});
