
const SUPABASE_URL = "https://aghizlgvrhunpuxvohep.supabase.co";

const SUPABASE_KEY = "sb_publishable_gpc7KUqUIykO3WM1aCzRfg_Myo8AKyx";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


const uploadBtn = document.getElementById("uploadBtn");
const mobileNumber = document.getElementById("mobileNumber");
const pdfFile = document.getElementById("pdfFile");
const message = document.getElementById("message");


uploadBtn.addEventListener("click", async () => {

    const mobile = mobileNumber.value.trim();
    const file = pdfFile.files[0];


    // Mobile number check
    if (!/^[0-9]{10}$/.test(mobile)) {

        message.textContent = "Please enter a valid 10 digit mobile number.";

        return;
    }


    // PDF check
    if (!file) {

        message.textContent = "Please select a PDF file.";

        return;
    }


    if (file.type !== "application/pdf") {

        message.textContent = "Only PDF files are allowed.";

        return;
    }


    uploadBtn.disabled = true;

    message.textContent = "Uploading...";


    try {

        /*
         * Unique file name
         * ताकि एक ही नाम की PDF दूसरी PDF को replace न करे।
         */

        const fileName =
            mobile + "_" +
            Date.now() + "_" +
            file.name;

        const filePath = mobile + "/" + fileName;


        // 1. Upload PDF to Storage

        const { error: uploadError } =
            await supabaseClient
                .storage
                .from("receipts")
                .upload(filePath, file, {
                    contentType: "application/pdf",
                    upsert: false
                });


        if (uploadError) {

            throw uploadError;
        }


        // 2. Save information in receipts table

        const { error: databaseError } =
            await supabaseClient
                .from("receipts")
                .insert([
                    {
                        mobile_number: mobile,
                        file_name: file.name,
                        file_path: filePath
                    }
                ]);


        if (databaseError) {

            // Database save failed तो uploaded file भी हटाने की कोशिश
            await supabaseClient
                .storage
                .from("receipts")
                .remove([filePath]);

            throw databaseError;
        }


        message.textContent =
            "Receipt uploaded successfully!";


        mobileNumber.value = "";
        pdfFile.value = "";


    } catch (error) {

        console.error(error);

        message.textContent =
            "Upload failed: " + error.message;

    }


    uploadBtn.disabled = false;

});
