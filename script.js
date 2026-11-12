(function () {
  var form = document.getElementById("signup");
  var status = document.getElementById("form-status");
  var year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();
  if (!form || !status) return;

  var email = form.querySelector('input[name="email"]');
  var button = form.querySelector('button[type="submit"]');

  function setStatus(message, kind) {
    status.textContent = message;
    status.className = "form-note" + (kind ? " is-" + kind : "");
  }

  form.addEventListener("submit", function (event) {
    if (typeof fetch !== "function") return; // let the browser do a normal POST
    event.preventDefault();

    if (!email.value || !email.checkValidity()) {
      email.classList.add("invalid");
      setStatus("Please enter a valid email address.", "error");
      email.focus();
      return;
    }
    email.classList.remove("invalid");

    button.disabled = true;
    setStatus("Signing you up…");

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          setStatus("You're on the list. Watch your inbox for the Play Store link.", "success");
        } else {
          return response.json().then(function (data) {
            var error = data && data.errors && data.errors[0] && data.errors[0].message;
            throw new Error(error || "Something went wrong.");
          });
        }
      })
      .catch(function (error) {
        setStatus(error.message + " Please try again, or email us directly.", "error");
      })
      .finally(function () {
        button.disabled = false;
      });
  });

  email.addEventListener("input", function () {
    email.classList.remove("invalid");
  });
})();
