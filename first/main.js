    class Encoder {
      constructor(encodingType = 'base64') {
        this.encodingType = encodingType;
      }

      //Base64 encoding
      encode(content) {
        if (this.encodingType === 'base64') {
          return btoa(content);
        } else {
          throw new Error("Unsupported encoding type");
        }
      }

      //Convert a string to binary string
      toBinary(str) {
        return str
          .split('')                            // Turn string into array of chars
          .map(char => char.charCodeAt(0)       // Get ASCII code of each char
                         .toString(2)           // Convert to binary
                         .padStart(8, '0'))     // Pad to 8 bits
          .join('');                            // Join all to single binary string
      }
    }

    const encoder = new Encoder();

    document.getElementById('fileInput').addEventListener('change', function(event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
          const content = e.target.result;

          //Encode content to Base64
          const encrypted = encoder.encode(content);

          //QR
            const qrContainer = document.getElementById("qrCodeContainer");
            qrContainer.innerHTML = ""; // Clear old QR if any

            new QRCode(qrContainer, {
               text: encrypted,
               width: 256,
               height: 256
            });


          //QR

          //Convert Base64 string to binary
          const binaryData = encoder.toBinary(encrypted);

          // 📟 Output binary data
          document.getElementById('output').innerText = binaryData;
        };

        reader.readAsText(file);
      }
    });