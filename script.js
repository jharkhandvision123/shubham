document.addEventListener("DOMContentLoaded", () => {

    const searchBox = document.getElementById("mobileNumber");
    const searchBtn = document.getElementById("searchBtn");

    const SUPABASE_URL = "https://aghizlgvrhunpuxvohep.supabase.co";
    const SUPABASE_KEY = "sb_publishable_gpc7KUqUIykO3WM1aCzRfg_Myo8AKyx";

    if (!searchBtn || !searchBox) {
        console.log("Search elements not found.");
        return;
    }

    searchBtn.addEventListener("click", async () => {

        const mobile = searchBox.value.trim();

        // Mobile number check
        if (!/^[0-9]{10}$/.test(mobile)) {
            alert("Please enter a valid 10 digit mobile number.");
            return;
        }

        searchBtn.disabled = true;
        searchBtn.textContent = "SEARCHING...";

        try {

            // Search receipts table
            const response = await fetch(
                SUPABASE_URL +
                "/rest/v1/receipts?mobile_number=eq." +
                encodeURIComponent(mobile) +
                "&select=*",
                {
                    method: "GET",
                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization": "Bearer " + SUPABASE_KEY
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error_description ||
                    "Could not search receipts."
                );
            }

            // No receipt found
            if (!data || data.length === 0) {
                alert("No receipt found for this mobile number.");
                return;
            }

            // Create receipt list
            let resultHTML = `
                <div style="
                    margin-top:20px;
                    padding:15px;
                    border:1px solid #ddd;
                    border-radius:10px;
                ">
                    <h3>Receipts Found</h3>
            `;

            data.forEach((receipt, index) => {

                const pdfURL =
                    SUPABASE_URL +
                    "/storage/v1/object/public/receipts/" +
                    receipt.file_path;

                resultHTML += `
                    <div style="
                        margin:10px 0;
                        padding:10px;
                        border:1px solid #eee;
                        border-radius:8px;
                    ">
                        <strong>Receipt ${index + 1}</strong><br>
                        ${receipt.file_name}<br><br>

                        <a
                            href="${pdfURL}"
                            target="_blank"
                            style="
                                display:inline-block;
                                padding:8px 15px;
                                background:#007bff;
                                color:white;
                                text-decoration:none;
                                border-radius:5px;
                                margin-right:5px;
                            "
                        >
                            View PDF
                        </a>

                        <a
                            href="${pdfURL}"
                            download
                            style="
                                display:inline-block;
                                padding:8px 15px;
                                background:#28a745;
                                color:white;
                                text-decoration:none;
                                border-radius:5px;
                            "
                        >
                            Download
                        </a>
                    </div>
                `;
            });

            resultHTML += `</div>`;

            // Show results below search section
            let resultsDiv = document.getElementById("searchResults");

            if (!resultsDiv) {
                resultsDiv = document.createElement("div");
                resultsDiv.id = "searchResults";
                searchBtn.parentElement.insertAdjacentElement(
                    "afterend",
                    resultsDiv
                );
            }

            resultsDiv.innerHTML = resultHTML;

        } catch (error) {

            console.error("Search error:", error);

            alert("Search failed: " + error.message);

        } finally {

            searchBtn.disabled = false;
            searchBtn.textContent = "SEARCH";

        }

    });

    console.log("JharkhandVision123 Student Portal Loaded");

});
