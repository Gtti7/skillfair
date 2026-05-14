const form = document.getElementById("studentForm");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    course: document.getElementById("course").value,
    semester: document.getElementById("semester").value,
    project: document.getElementById("project").value,
    place: document.getElementById("place").value,
    email: document.getElementById("email").value
  };

  document.getElementById("msg").innerText = "Submitting...";

  fetch("https://script.google.com/macros/s/AKfycbxdyzWktQVvOeo00p5m2Q_Es2s0KMaTOTr7wk3XwvG6EHux0f0TMGAEJ8A0Fs6sxclJ/exec", {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    if(res.status === "ok"){
      document.getElementById("msg").innerText = "Success! Certificate Sent 🎉";
      form.reset();
    } else {
      document.getElementById("msg").innerText = "Failed!";
    }
  })
  .catch(err => {
    document.getElementById("msg").innerText = "Error connecting server!";
    console.log(err);
  });

});