document.addEventListener("DOMContentLoaded", () => {
  // ISBN validation logic
  const isbnInputSell = document.getElementById("isbnNumber");
  const isbnIconSell = document.getElementById("isbnValidationIcon");
  const verifyButton = document.querySelector(".isbn-validation-sell .sell-button");

  if (isbnInputSell && isbnIconSell && verifyButton) {
    verifyButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form submission

      const isbn = isbnInputSell.value.trim();

      if (isbn.length === 13 && /^\d+$/.test(isbn)) {
        fetch(`/validateISBN?isbn=${isbn}`) // Replace with your actual API endpoint
          .then((response) => {
            if (!response.ok) {
              throw new Error("ISBN validation failed.");
            }
            return response.json();
          })
          .then((data) => {
            if (data.valid) {
              isbnIconSell.textContent = "✔️";
              isbnIconSell.style.color = "blue";
            } else {
              isbnIconSell.textContent = "❌";
              isbnIconSell.style.color = "red";
            }
          })
          .catch((error) => {
            console.error("Error validating ISBN:", error);
            isbnIconSell.textContent = "❌";
            isbnIconSell.style.color = "red";
          });
      } else {
        isbnIconSell.textContent = "❌";
        isbnIconSell.style.color = "red";
      }
    });
  }

  // Payment mode logic
  const upiMode = document.getElementById("upiMode");
  const bankMode = document.getElementById("bankMode");
  const upiDetails = document.getElementById("upiDetails");
  const bankDetails = document.getElementById("bankDetails");

  if (upiMode && bankMode && upiDetails && bankDetails) {
    upiMode.addEventListener("change", () => {
      if (upiMode.checked) {
        upiDetails.classList.remove("hidd");
        bankDetails.classList.add("hidd");
      }
    });

    bankMode.addEventListener("change", () => {
      if (bankMode.checked) {
        bankDetails.classList.remove("hidd");
        upiDetails.classList.add("hidd");
      }
    });
  }
});
