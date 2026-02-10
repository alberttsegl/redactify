# @alberttsgl/redactify

**Redactify** adalah package Node.js berbasis Javascript murni yang berfungsi untuk menyensor data sensitif secara otomatis pada proses logging, sebelum data tersebut dicetak ke terminal atau disimpan ke file log.

Package ini dirancang untuk mencegah kebocoran data akibat human error, seperti penggunaan **console.log()** terhadap objek yang mengandung informasi krusial misalnya password, token, API key, nomor kartu kredit, CVV, NIK hingga data privat lainnya.

## Instalasi

```bash
npm i @alberttsgl/redactify
