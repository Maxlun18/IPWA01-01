async function loadHead(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const temp = document.createElement("div");
    temp.innerHTML = html;

    const newTitle = temp.querySelector("title");
    if (newTitle) document.title = newTitle.textContent;

    // Meta und Link-Tags hinzufügen
    temp.querySelectorAll("meta, link").forEach((el) => {
      document.head.appendChild(el);
    });

    // SCRIPTS richtig laden
    temp.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.head.appendChild(newScript);
    });

    console.log("head.html geladen ✔️ und JS ausgeführt");
  } catch (error) {
    console.error(`Fehler beim Laden von ${url}:`, error);
  }
}


  
  async function loadComponent(id, url) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      document.getElementById(id).innerHTML = html;
      return true; // <-- wichtig für `.then()`
    } catch (error) {
      console.error(`Fehler beim Laden von ${url}:`, error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadHead("components/head.html");
    loadComponent("nav", "components/nav.html");
    loadComponent("footer", "components/footer.html");
  });
  

  function highlightActiveNav() {
    const links = document.querySelectorAll("nav .nav-link");
    const currentPage = window.location.pathname.split("/").pop();
  
    links.forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadHead("components/head.html");
    loadComponent("nav", "components/nav.html").then(() => {
      highlightActiveNav(); // wird erst nach dem Laden der Nav ausgeführt
    });
    loadComponent("footer", "components/footer.html");
  });
  