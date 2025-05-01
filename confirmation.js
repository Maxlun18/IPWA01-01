// confirmation.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("confirmationContent");
    const raw = sessionStorage.getItem("donationData");
  
    if (!raw) {
      container.innerHTML = "<p>Keine Daten gefunden.</p>";
      return;
    }
  
    const d = JSON.parse(raw);
    const dt = new Date(d.timestamp);
    const date = dt.toLocaleDateString("de-DE");
    const time = dt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    const location = d.mode === "onsite"
      ? "Geschäftsstelle"
      : `${d.street}, ${d.postalCode} ${d.city}`;
  
    // Darstellung der Kleidung
    let clothingDisplay = d.clothingType.join(", ");
    if (d.clothingType.includes("Sonstiges") && d.clothingOther) {
      clothingDisplay = clothingDisplay.replace("Sonstiges", d.clothingOther);
    }
  
    container.innerHTML = `
      <h1>Registrierung erfolgreich!</h1>
      <ul class="list-group mb-4">
        <li class="list-group-item">
          <strong>Art der Kleidung:</strong> ${clothingDisplay}
        </li>
        <li class="list-group-item">
          <strong>Krisengebiet:</strong> ${d.crisisRegion}
        </li>
        <li class="list-group-item">
          <strong>Datum:</strong> ${date}
        </li>
        <li class="list-group-item">
          <strong>Uhrzeit:</strong> ${time}
        </li>
        <li class="list-group-item">
          <strong>Ort:</strong> ${location}
        </li>
      </ul>
    `;
  
    // PDF-Export
    document.getElementById("exportPdf").addEventListener("click", async () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      await doc.html(document.getElementById("confirmationContent"), {
        callback: (pdf) => pdf.save("kleiderspende-bestaetigung.pdf"),
        x: 20,
        y: 20,
        html2canvas: { scale: 0.6 }
      });
    });
  
    // Neue Spende registrieren
    document.getElementById("newDonation").addEventListener("click", () => {
      sessionStorage.removeItem("donationData");
      window.location.href = "form.html";
    });
  });
  