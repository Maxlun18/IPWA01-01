// form.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("donationForm");
    const modeOnSite = document.getElementById("modeOnSite");
    const modePickup = document.getElementById("modePickup");
    const onSiteNotice = document.getElementById("onSiteNotice");
    const pickupFields = document.getElementById("pickupFields");
    const postcode = document.getElementById("postalCode");
    const postcodeError = document.getElementById("postcodeError");
  
    // Neue Controls
    const clothingType = document.getElementById("clothingType");
    const clothingOtherDiv = document.getElementById("clothingOtherDiv");
    const clothingOther = document.getElementById("clothingOther");
    const crisisRegion = document.getElementById("crisisRegion");
    const crisisOtherDiv = document.getElementById("crisisOtherDiv");
    const crisisOther = document.getElementById("crisisOther");
  
    // PLZ-Präfix der Geschäftsstelle (z.B. "12")
    const businessPostalPrefix = "12";
  
    // Umschalten Geschäftsstelle vs. Abholung
    function updateFormMode() {
      if (modeOnSite.checked) {
        onSiteNotice.classList.remove("d-none");
        pickupFields.classList.add("d-none");
        [...pickupFields.querySelectorAll("input")].forEach(i => i.required = false);
      } else {
        onSiteNotice.classList.add("d-none");
        pickupFields.classList.remove("d-none");
        [...pickupFields.querySelectorAll("input")].forEach(i => i.required = true);
      }
    }
    modeOnSite.addEventListener("change", updateFormMode);
    modePickup.addEventListener("change", updateFormMode);
  
    // PLZ-Umkreisprüfung
    function checkPostalProximity() {
      postcodeError.classList.add("d-none");
      const val = postcode.value.trim();
      if (val.length === 5 && val.slice(0,2) !== businessPostalPrefix) {
        postcodeError.classList.remove("d-none");
        return false;
      }
      return true;
    }
    postcode.addEventListener("input", () => {
      postcode.setCustomValidity("");
      postcodeError.classList.add("d-none");
    });
    postcode.addEventListener("blur", () => {
      if (!checkPostalProximity()) {
        postcode.setCustomValidity("nicht im Umkreis");
      }
    });
  
    // Kleidung: Freitext bei "Sonstiges"
    clothingType.addEventListener("change", () => {
      const selected = Array.from(clothingType.selectedOptions).map(o => o.value);
      if (selected.includes("Sonstiges")) {
        clothingOtherDiv.classList.remove("d-none");
        clothingOther.required = true;
      } else {
        clothingOtherDiv.classList.add("d-none");
        clothingOther.value = "";
        clothingOther.required = false;
      }
    });
  
    // Krisengebiet: Freitext bei "Sonstiges"
    crisisRegion.addEventListener("change", () => {
      if (crisisRegion.value === "Sonstiges") {
        crisisOtherDiv.classList.remove("d-none");
        crisisOther.required = true;
      } else {
        crisisOtherDiv.classList.add("d-none");
        crisisOther.value = "";
        crisisOther.required = false;
      }
    });
  
    // Submit-Handler
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      // Mindestens eine Kleidung auswählen
      if (clothingType.selectedOptions.length === 0) {
        clothingType.setCustomValidity("Bitte mindestens eine Option wählen.");
      } else {
        clothingType.setCustomValidity("");
      }
  
      if (!form.checkValidity() || (modePickup.checked && !checkPostalProximity())) {
        form.classList.add("was-validated");
        return;
      }
  
      // Daten sammeln
      const data = {
        mode: form.mode.value,
        clothingType: Array.from(clothingType.selectedOptions).map(o => o.value),
        clothingOther: clothingOther.value || null,
        crisisRegion: crisisRegion.value === "Sonstiges"
                      ? crisisOther.value
                      : crisisRegion.value,
        street: form.street?.value || null,
        postalCode: form.postalCode?.value || null,
        city: form.city?.value || null,
        timestamp: new Date().toISOString()
      };
  
      sessionStorage.setItem("donationData", JSON.stringify(data));
      window.location.href = "confirmation.html";
    });
  });
  