 const chunkSize = 512;
  const qrImages = [];
  let currentIndex = 0;
  let slideshowInterval = null;

  document.getElementById('fileInput').addEventListener('change', async function () {
    const file = this.files[0];
    if (!file) return;

    qrImages.length = 0;
    currentIndex = 0;
    document.getElementById("slideshowImage").style.display = "none";
    document.getElementById("qrIndexLabel").innerText = "";

    let offset = 0;
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const text = await readFileChunk(chunk);
      const dataUrl = await generateQRCode(text);
      qrImages.push(dataUrl);
      offset += chunkSize;
    }

    alert("✅ All QR codes generated!");
    document.getElementById('startSlideshowBtn').disabled = false;
  });

  function readFileChunk(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(blob);
    });
  }

  function generateQRCode(data) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      QRCode.toCanvas(canvas, data, {
        errorCorrectionLevel: 'L',
        scale: 10 // bigger QR
      }, function (err) {
        if (err) return reject(err);
        const dataUrl = canvas.toDataURL();
        resolve(dataUrl);
      });
    });
  }

  // 🔁 Start Slideshow
  document.getElementById("startSlideshowBtn").addEventListener("click", () => {
    if (qrImages.length === 0) return;

    document.getElementById("slideshowImage").style.display = "block";
    currentIndex = 0;
    showQR(currentIndex);

    // 🎥 Play automatically like video (1 frame/sec)
    if (slideshowInterval) clearInterval(slideshowInterval);
    slideshowInterval = setInterval(() => {
      currentIndex++;
      if (currentIndex >= qrImages.length) {
        clearInterval(slideshowInterval); // Stop when done
        return;
      }
      showQR(currentIndex);
    }, 3000); // ⏱️ 1 QR per second
  });

  function showQR(index) {
    const image = document.getElementById("slideshowImage");
    const label = document.getElementById("qrIndexLabel");
    image.src = qrImages[index];
    label.innerText = `QR ${index + 1} of ${qrImages.length}`;
  }