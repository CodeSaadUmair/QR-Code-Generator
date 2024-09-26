const textElement = document.getElementById("txt");

const btnElement = document.getElementById("btn");

const imageElement = document.querySelector(".image");

const qrElement = document.querySelector(".qr");

const downloadElement = document.getElementById("down");

const copyElement = document.getElementById("copy");

btnElement.addEventListener("click", generateQR);

const spinnerElement = document.querySelector(".spinner");

function generateQR() {
  const text = textElement.value;
  if (text === "") {
    alert("Enter text");
  } else {
    btnElement.innerText = "Generating QR Code....";
    spinnerElement.classList.remove("hide");

    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${text}`;
    imageElement.src = qr;

    setTimeout(() => {
      spinnerElement.classList.add("hide");
      qrElement.classList.remove("hide");
      btnElement.innerText = "Generate QR Code";
    }, 1000);
  }
}

textElement.addEventListener("keyup", () => {
  if (!textElement.value.trim()) {
    qrElement.classList.add("hide");
  }
});

async function fetchQrImageBlob(qrImageUrl) {
  try {
    const response = await fetch(qrImageUrl, { mode: "cors" });
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error fetching the image:", error);
    throw error;
  }
}

downloadElement.addEventListener("click", async () => {
  const qrImageUrl = imageElement.src;

  try {
    const blob = await fetchQrImageBlob(qrImageUrl);

    const reader = new FileReader();

    reader.onloadend = function () {
      const link = document.createElement("a");
      link.href = reader.result;
      link.download = `QR-Code.png`;
      link.click();
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
});

copyElement.addEventListener("click", async () => {
  const qrImageUrl = imageElement.src;

  try {
    const blob = await fetchQrImageBlob(qrImageUrl);

    const clipboardItem = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([clipboardItem]);

    alert("QR code copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy image:", error);
  }
});
