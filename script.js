
```javascript
document.addEventListener("DOMContentLoaded", () => {

    const searchBox = document.getElementById("mobileNumber");
    const searchBtn = document.getElementById("searchBtn");

    const SUPABASE_URL = "https://aghizlgvrhunpuxvohep.supabase.co";
    const SUPABASE_KEY = "sb_publishable_gpc7KUqUIykO3WM1aCzRfg_Myo8AKyx";

    console.log("SCRIPT LOADED");
    console.log("searchBox:", searchBox);
    console.log("searchBtn:", searchBtn);

    if (!searchBtn || !searchBox) {
        console.error("SEARCH ELEMENT NOT FOUND");
        return;
    }

    searchBtn.addEventListener("click", async () => {

        console.log("SEARCH BUTTON CLICKED");

        const mobile = searchBox.value.trim();

        console.log("Mobile entered:", mobile);

        if (!/^[0-9]{10}$/.test(mobile)) {
            alert("Please enter a valid 10 digit mobile number.");
            return;
        }

        searchBtn.disabled = true;
        searchBtn.textContent = "SEARCHING...";

        try {

            const url =
                SUPABASE_URL +
                "/rest/v1/receipts?mobile_number=eq." +
                encodeURIComponent(mobile) +
                "&select=*";

            console.log("Searching URL:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + SUPABASE_KEY
                }
            });

            console.log("Supabase status:", response.status);

            const data = await response.json();

            console.log("Supabase response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error_description ||
                    JSON.stringify(data)
                );
            }

            if (!data || data.length === 0) {
                alert("No receipt found for this mobile number.");
                return;
            }

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
                        ${receipt.file_name || "Receipt PDF"}<br><br>

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

            const resultDiv = document.getElementById("result");

            if (resultDiv) {
                resultDiv.innerHTML = resultHTML;
            }

        } catch (error) {

            console.error("SEARCH ERROR:", error);

            alert("Search failed: " + error.message);

        } finally {

            searchBtn.disabled = false;
            searchBtn.textContent = "SEARCH";

        }

    });

});
