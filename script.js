```javascript
document.addEventListener("DOMContentLoaded", function () {

    const mobileNumber = document.getElementById("mobileNumber");
    const searchBtn = document.getElementById("searchBtn");
    const result = document.getElementById("result");

    console.log("SCRIPT.JS LOADED");

    searchBtn.addEventListener("click", function () {

        console.log("SEARCH BUTTON CLICKED");

        const mobile = mobileNumber.value.trim();

        console.log("MOBILE NUMBER:", mobile);

        if (mobile.length !== 10) {
            result.innerHTML = "Please enter a 10 digit mobile number.";
            return;
        }

        result.innerHTML = "Mobile number received: " + mobile;

    });

});
```
