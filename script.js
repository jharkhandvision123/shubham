document.addEventListener("DOMContentLoaded", function () {

    const searchBtn = document.getElementById("searchBtn");

    if (!searchBtn) {
        console.log("Search button not found on this page.");
        return;
    }

    searchBtn.onclick = async function () {

        const mobileInput =
            document.getElementById("mobileNumber");

        const result =
            document.getElementById("result");

        if (!mobileInput || !result) {
            console.error("Search elements are missing.");
            return;
        }

        const mobile =
            mobileInput.value.trim();

        if (!/^[0-9]{10}$/.test(mobile)) {

            alert(
                "Please enter a valid 10 digit mobile number."
            );

            return;
        }

        this.disabled = true;
        this.textContent = "SEARCHING...";
        result.innerHTML = "Searching...";

        const SUPABASE_URL =
            "https://aghizlgvrhunpuxvohep.supabase.co";

        const SUPABASE_KEY =
            "sb_publishable_gpc7KUqUIykO3WM1aCzRfg_Myo8AKyx";

        try {

            const url =
                SUPABASE_URL +
                "/rest/v1/receipts" +
                "?mobile_number=eq." +
                encodeURIComponent(mobile) +
                "&select=*";

            const response =
                await fetch(url, {

                    method: "GET",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            "Bearer " + SUPABASE_KEY
                    }

                });

            const data =
                await response.json();

            console.log(
                "Supabase Status:",
                response.status
            );

            console.log(
                "Supabase Response:",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.details ||
                    data.hint ||
                    JSON.stringify(data)
                );

            }

            if (!data || data.length === 0) {

                result.innerHTML =
                    "No receipt found for this mobile number.";

                return;
            }

            let html =
                "<h3>Receipts Found</h3>";

            data.forEach(
                (receipt, index) => {

                    const pdfURL =
                        SUPABASE_URL +
                        "/storage/v1/object/public/receipts/" +
                        receipt.file_path;

                    const fileName =
                        receipt.file_name ||
                        "Receipt.pdf";

                    html += `
                        <div style="
                            margin:15px 0;
                            padding:15px;
                            border:1px solid #ddd;
                            border-radius:8px;
                        ">

                            <strong>
                                Receipt ${index + 1}
                            </strong>

                            <br><br>

                            ${fileName}

                            <br><br>

                            <a
                                href="${pdfURL}"
                                target="_blank"
                                rel="noopener noreferrer"
                                style="
                                    display:inline-block;
                                    padding:10px 15px;
                                    background:#007bff;
                                    color:white;
                                    text-decoration:none;
                                    border-radius:5px;
                                    margin-right:5px;
                                "
                            >
                                View PDF
                            </a>

                            <button
                                type="button"
                                class="downloadReceiptBtn"
                                data-url="${pdfURL}"
                                data-filename="${fileName}"
                                style="
                                    display:inline-block;
                                    padding:10px 15px;
                                    background:#28a745;
                                    color:white;
                                    border:none;
                                    border-radius:5px;
                                    cursor:pointer;
                                    font-size:15px;
                                "
                            >
                                Download
                            </button>

                        </div>
                    `;
                }
            );

            result.innerHTML = html;


            /* ==============================
               DOWNLOAD PDF
            ============================== */

            document
                .querySelectorAll(".downloadReceiptBtn")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        async function () {

                            const pdfURL =
                                this.dataset.url;

                            const fileName =
                                this.dataset.filename ||
                                "Receipt.pdf";

                            const originalText =
                                this.textContent;

                            this.disabled = true;
                            this.textContent =
                                "DOWNLOADING...";

                            try {

                                const pdfResponse =
                                    await fetch(pdfURL);

                                if (!pdfResponse.ok) {
                                    throw new Error(
                                        "PDF could not be downloaded."
                                    );
                                }

                                const blob =
                                    await pdfResponse.blob();

                                const blobURL =
                                    window.URL.createObjectURL(
                                        blob
                                    );

                                const downloadLink =
                                    document.createElement("a");

                                downloadLink.href =
                                    blobURL;

                                downloadLink.download =
                                    fileName;

                                document.body.appendChild(
                                    downloadLink
                                );

                                downloadLink.click();

                                downloadLink.remove();

                                window.URL.revokeObjectURL(
                                    blobURL
                                );

                            } catch (error) {

                                console.error(
                                    "Download Error:",
                                    error
                                );

                                alert(
                                    "Download failed. Please try again."
                                );

                            } finally {

                                this.disabled = false;

                                this.textContent =
                                    originalText;

                            }

                        }
                    );

                });


        } catch (error) {

            console.error(
                "Search Error:",
                error
            );

            result.innerHTML =
                "Search failed: " +
                error.message;

        } finally {

            this.disabled = false;
            this.textContent = "SEARCH";

        }

    };

});
