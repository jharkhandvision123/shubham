```javascript
document.addEventListener("DOMContentLoaded", function () {

    const searchBtn = document.getElementById("searchBtn");

    /* =================================
       SEARCH BUTTON AVAILABLE?
    ================================= */

    if (!searchBtn) {
        console.log("Search button not found on this page.");
        return;
    }


    /* =================================
       SEARCH FUNCTION
    ================================= */

    searchBtn.onclick = async function () {

        const mobileInput =
            document.getElementById("mobileNumber");

        const result =
            document.getElementById("result");


        /* Safety check */

        if (!mobileInput || !result) {
            console.error(
                "Search elements are missing."
            );
            return;
        }


        const mobile =
            mobileInput.value.trim();


        /* =================================
           MOBILE NUMBER VALIDATION
        ================================= */

        if (!/^[0-9]{10}$/.test(mobile)) {

            alert(
                "Please enter a valid 10 digit mobile number."
            );

            return;
        }


        /* =================================
           SEARCH START
        ================================= */

        this.disabled = true;

        this.textContent = "SEARCHING...";

        result.innerHTML = "Searching...";


        /* =================================
           SUPABASE
        ================================= */

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

                        "apikey":
                            SUPABASE_KEY,

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


            /* =================================
               SUPABASE ERROR
            ================================= */

            if (!response.ok) {

                throw new Error(

                    data.message ||
                    data.details ||
                    data.hint ||
                    JSON.stringify(data)

                );

            }


            /* =================================
               NO RECEIPT
            ================================= */

            if (!data || data.length === 0) {

                result.innerHTML =
                    "No receipt found for this mobile number.";

                return;
            }


            /* =================================
               RECEIPTS FOUND
            ================================= */

            let html =
                "<h3>Receipts Found</h3>";


            data.forEach(
                (receipt, index) => {

                    const pdfURL =
                        SUPABASE_URL +
                        "/storage/v1/object/public/receipts/" +
                        receipt.file_path;


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

                            ${
                                receipt.file_name ||
                                "Receipt PDF"
                            }

                            <br><br>

                            <a
                                href="${pdfURL}"
                                target="_blank"
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


                            <a
                                href="${pdfURL}"
                                download
                                style="
                                    display:inline-block;
                                    padding:10px 15px;
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
                }
            );


            result.innerHTML = html;


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
```
