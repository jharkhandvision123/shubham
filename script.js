```javascript
document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // HTML ELEMENTS
    // ==============================

    const searchBox = document.getElementById("mobileNumber");
    const searchBtn = document.getElementById("searchBtn");
    const resultDiv = document.getElementById("result");


    // ==============================
    // SUPABASE SETTINGS
    // ==============================

    const SUPABASE_URL = "https://aghizlgvrhunpuxvohep.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_gpc7KUqUIykO3WM1aCzRfg_Myo8AKyx";


    // ==============================
    // CHECK PAGE ELEMENTS
    // ==============================

    console.log("Student CSC script.js loaded successfully.");

    console.log("Mobile input:", searchBox);
    console.log("Search button:", searchBtn);
    console.log("Result box:", resultDiv);


    if (!searchBox) {
        console.error("ERROR: mobileNumber input not found.");
        return;
    }

    if (!searchBtn) {
        console.error("ERROR: searchBtn button not found.");
        return;
    }


    // ==============================
    // SEARCH BUTTON
    // ==============================

    searchBtn.addEventListener("click", async function () {

        console.log("SEARCH BUTTON CLICKED");


        // Get mobile number
        const mobile = searchBox.value.trim();

        console.log("Mobile number entered:", mobile);


        // ==============================
        // MOBILE NUMBER VALIDATION
        // ==============================

        if (!/^[0-9]{10}$/.test(mobile)) {

            alert("Please enter a valid 10 digit mobile number.");

            searchBox.focus();

            return;
        }


        // ==============================
        // BUTTON LOADING
        // ==============================

        searchBtn.disabled = true;
        searchBtn.textContent = "SEARCHING...";


        if (resultDiv) {
            resultDiv.innerHTML = "";
        }


        try {

            // ==============================
            // SUPABASE API URL
            // ==============================

            const searchURL =
                SUPABASE_URL +
                "/rest/v1/receipts" +
                "?mobile_number=eq." +
                encodeURIComponent(mobile) +
                "&select=*";


            console.log("Searching Supabase...");
            console.log("URL:", searchURL);


            // ==============================
            // SUPABASE REQUEST
            // ==============================

            const response = await fetch(searchURL, {

                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + SUPABASE_KEY,
                    "Content-Type": "application/json"
                }

            });


            console.log("Supabase HTTP status:", response.status);


            // ==============================
            // READ RESPONSE
            // ==============================

            const responseText = await response.text();

            console.log("Supabase raw response:", responseText);


            let data;

            try {

                data = JSON.parse(responseText);

            } catch (jsonError) {

                throw new Error(
                    "Supabase returned an invalid response."
                );

            }


            console.log("Supabase data:", data);


            // ==============================
            // SUPABASE ERROR
            // ==============================

            if (!response.ok) {

                const errorMessage =
                    data.message ||
                    data.error_description ||
                    data.details ||
                    data.hint ||
                    data.error ||
                    "Could not search receipts.";

                throw new Error(errorMessage);
            }


            // ==============================
            // NO RECEIPT FOUND
            // ==============================

            if (!Array.isArray(data) || data.length === 0) {

                if (resultDiv) {

                    resultDiv.innerHTML = `
                        <div style="
                            margin-top:20px;
                            padding:15px;
                            background:#fff3cd;
                            color:#856404;
                            border:1px solid #ffeeba;
                            border-radius:10px;
                        ">
                            No receipt found for this mobile number.
                        </div>
                    `;

                }

                return;
            }


            // ==============================
            // RECEIPTS FOUND
            // ==============================

            console.log(
                "Receipts found:",
                data.length
            );


            let resultHTML = `

                <div style="
                    margin-top:20px;
                    padding:15px;
                    background:white;
                    border:1px solid #ddd;
                    border-radius:10px;
                    box-shadow:0 2px 8px rgba(0,0,0,.08);
                ">

                    <h3 style="
                        color:#0d47a1;
                        margin-bottom:15px;
                    ">
                        ${data.length} Receipt${data.length > 1 ? "s" : ""} Found
                    </h3>

            `;


            // ==============================
            // CREATE RECEIPT LIST
            // ==============================

            data.forEach(function (receipt, index) {


                // File path
                const filePath =
                    receipt.file_path || "";


                // File name
                const fileName =
                    receipt.file_name ||
                    "Receipt PDF";


                // Public PDF URL
                const pdfURL =
                    SUPABASE_URL +
                    "/storage/v1/object/public/receipts/" +
                    filePath;


                console.log(
                    "Receipt " + (index + 1),
                    pdfURL
                );


                resultHTML += `

                    <div style="
                        margin:12px 0;
                        padding:15px;
                        border:1px solid #eee;
                        border-radius:8px;
                        background:#fafafa;
                    ">

                        <strong>
                            Receipt ${index + 1}
                        </strong>

                        <br><br>

                        <span>
                            ${fileName}
                        </span>

                        <br><br>


                        <a
                            href="${pdfURL}"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="
                                display:inline-block;
                                padding:9px 15px;
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
                                padding:9px 15px;
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


            // ==============================
            // SHOW RESULTS
            // ==============================

            if (resultDiv) {

                resultDiv.innerHTML = resultHTML;

            } else {

                console.error(
                    "ERROR: result element not found."
                );

            }


        } catch (error) {

            // ==============================
            // ERROR HANDLING
            // ==============================

            console.error(
                "SEARCH ERROR:",
                error
            );


            if (resultDiv) {

                resultDiv.innerHTML = `

                    <div style="
                        margin-top:20px;
                        padding:15px;
                        background:#f8d7da;
                        color:#842029;
                        border:1px solid #f5c2c7;
                        border-radius:10px;
                    ">

                        Search failed:

                        <br><br>

                        ${error.message}

                    </div>

                `;

            } else {

                alert(
                    "Search failed: " +
                    error.message
                );

            }


        } finally {

            // ==============================
            // RESTORE BUTTON
            // ==============================

            searchBtn.disabled = false;

            searchBtn.textContent = "SEARCH";

        }

    });


});
```
