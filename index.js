// instagram.com/theazran_

const express = require("express");
const fetch = require("node-fetch");
const app = express();
const port = 3000;
require('dotenv').config();

app.get("/", (req, res) => {
    const fetchUrl = process.env.GET_URL;
    const headers = { "content-type": "application/json" };

    const selectedId = req.query.id || "73";
    const data = { data: { id: selectedId } };

    fetch(fetchUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data, null, 2),
    })
        .then((response) => response.json())
        .then((result) => {
            const aggregatedData = result.result.aggregated;

            let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>LIVE COUNT - Caores dan Cawapres</title>
          <!-- Include Tailwind CSS -->
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">

          <style>
            @keyframes blink {
              0%, 50%, 100% {
                opacity: 1;
              }
              25%, 75% {
                opacity: 0;
              }
            }

            body {
              font-family: 'Inter', sans-serif;
              background-color: #f5f7fa;
              color: #2d3748;
              line-height: 1.6;
            }

            .container {
              max-width: 800px;
              margin: 0 auto;
            }

            .live-section {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
            }

            .live-icon {
              font-size: 18px;
              color: #e53e3e;
              margin-right: 8px;
              animation: blink 2s infinite;
            }

            .kecamatan-card {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              padding: 20px;
              margin-bottom: 20px;
              transition: transform 0.3s ease-in-out;
            }

            .kecamatan-card:hover {
              transform: scale(1.02);
            }

            .kecamatan-card h2 {
              font-size: 1.75rem;
              font-weight: bold;
              margin-bottom: 12px;
            }

            .kecamatan-card p {
              font-size: 1.1rem;
              margin-bottom: 8px;
            }

            body {
              font-family: 'Rubik', sans-serif; /* Use the Rubik font */
              background-color: #f5f7fa;
              color: #2d3748;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container mx-auto p-8">
            <div class="live-section">
              <i class="fas fa-circle live-icon"></i>
              <h1 class="text-3xl font-bold">LIVE COUNT</h1>
            </div>

            <img src="https://i.ibb.co/ns7WXzz/Screenshot-2024-02-14-165853.png" alt="Screenshot-2024-02-14-165853" class="w-full max-w-lg mx-auto mb-8">
            <!-- Input field and submit button for changing ID -->
<div class="mb-4">
  <label for="idInput" class="block mb-2 font-bold">Kode Wilayah <a href="https://kodewilayah.id" class="text-blue-500" target="_blank">Lihat Disini <i class="fa-solid fa-arrow-up-right-from-square"></i></a></label> 
  <input type="number" id="idInput" class="w-full max-w-lg p-2 border rounded mx-auto" placeholder="Kode Prov/Kab/Kec/Des" value="${selectedId}"><br>
  <small class="text-red-500">Contoh: 730208</small>
  <br>
  <button id="submitBtn" class="mt-2 p-2 bg-blue-500 text-white rounded">Submit</button>
</div>
      `;

            const formatTimestamp = (timestamp) => {
                const date = new Date(timestamp);
                return date.toLocaleString();
            };

            for (const key in aggregatedData) {
                if (aggregatedData.hasOwnProperty(key)) {
                    htmlContent += `
            <div class="kecamatan-card" id="${key}" onclick="fillAndSubmit('${key}')">
          `;

                    aggregatedData[key].forEach((entry) => {
                        htmlContent += `
            <div class="p-1 bg-gray-200 text-center text-black rounded text-xs">Kode Wilayah ${entry.idLokasi
                            }</div>
              <h2 class="mb-2">${entry.name}</h2>
              <p>Total TPS ${entry.totalTps}</p>
              <p><strong>ANIES - MUHAIMIN:</strong> ${entry.pas1}</p>
              <p><strong>PRABOWO - GIBRAN:</strong> ${entry.pas2}</p>
              <p><strong>GANJAR - MAHFUD:</strong> ${entry.pas3}</p>
                <div class="flex items-center justify-center space-x-2">
                  <div class="p-1 bg-green-500 text-white rounded text-xs">COMPLETED TPS ${entry.totalCompletedTps
                            }</div>
                  <div class="p-1 bg-yellow-500 text-white rounded text-xs">PENDING TPS ${entry.totalPendingTps
                            }</div>
                </div>
              <small>Updated ${formatTimestamp(entry.updateTs)}</small>`;
                    });

                    htmlContent += `</div>`;
                }
            }
            htmlContent += `
        <script>
          function fillAndSubmit(id) {
            document.getElementById('idInput').value = id;
            document.getElementById('submitBtn').click();
          }

          const idInput = document.getElementById('idInput');
          const submitBtn = document.getElementById('submitBtn');

          submitBtn.addEventListener('click', () => {
            const enteredId = idInput.value.trim();
            if (enteredId) {
              window.location.href = \`/?id=\${enteredId}\`;
            }
          });
        </script>
      </body>
      </html>`;

            res.send(htmlContent);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
