window.onload = function () {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptAllButton = document.getElementById("accept-all");
    const essentialOnlyButton = document.getElementById("essential-only");
    const denieButton = document.getElementById("denie");
  
    // Cookie banner tonen indien nog geen keuze is gemaakt
    if (!getCookie("cookie_consent")) {
      cookieBanner.style.display = "block";
    }
    else {
        // Verberg de cookie banner:
        cookieBanner.style.display = "none";
      }
      //cookieBanner.style.display = "block";
    
    acceptAllButton.onclick = function () {
      setCookie("cookie_consent", "all", 365);
      applyCookieSettings("all");
      hideCookieBanner();
    };
  
    essentialOnlyButton.onclick = function () {
      // Stel de Google AdSense cookie in
      // 2 rd party cookies
      setCookie("__gads", "ID=1f5d1e0b01a6d54a:T=1691234567:RT=1691234567:S=ALNI_MZ5FjXYZQJSK_D9slokLRxHXJ8_wg", 365);
      setCookie("_ga", "GA1.2.1234567890.1691234567", 365);

      setCookie("cookie_consent", "essential", 365);
      applyCookieSettings("essential");
      hideCookieBanner();
    };
  
    denieButton.onclick = function () {
      $.ajax({
        url: '/logout', // De server-side route
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
          console.log("Sessie beëindigd:", response);
          hideCookieBanner();
        },
        error: function (xhr, status, error) {
          console.error("Fout bij het beëindigen van de sessie:", xhr.responseText || error);
        }
      });
    };
    // Functies voor cookie handling
    function setCookie(name, value, days) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
  
    function getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  
    function applyCookieSettings(consent) {
      // Hier laad je de scripts/trackers op basis van de toestemming
      if (consent === "all") {
        // Laad alle scripts/trackers
        console.log("Alle cookies toegestaan. Laad scripts/trackers...");
        // Voorbeeld:
        // loadGoogleAnalytics();
        // loadOtherTrackingScript();
      } else if (consent === "essential") {
        // Laad alleen essentiële scripts
        console.log("Alleen essentiële cookies toegestaan.");
      }
    }
  
    function hideCookieBanner() {
      cookieBanner.style.display = "none";
    }
  };