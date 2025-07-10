const form = document.querySelector("#send-happiness");
const login = document.querySelector("#login-form");
const submission = document.querySelector("#submission");

login.addEventListener(
  "submit",
  (event) => {
    const data = new FormData(login);
    const username = data.get("username");
    const password = data.get("password");

    fetch("https://happiness-app-backend.herokuapp.com/api/token/", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": "Basic " + btoa(`${username}:${password}`),
        "Content-Type": "application/json"
      },
      body: "doesn't matter"
    }).then(response => {
      if (!response.ok) {
        window.alert("Could not log in, maybe incorrect username and password? Or just try again.");
      } else {
        let json = response.json();
        json.then(data => {
          document.getElementById("content").style.display = 'block';
          document.getElementById("login").style.display = 'none';
          localStorage.setItem("token", data.session_token);
        });
      }
    });
  }
);

form.addEventListener(
  "submit",
  (event) => {
    const data = new FormData(form);
    const happiness = data.get("happiness");
    const comment = data.get("comment");
    const timezone = (new Date()).getTimezoneOffset() * 60000;
    const date = (new Date(Date.now() - timezone)).toISOString().slice(0, 10);
    if (!happiness) {
      window.alert("please select happiness");
    } else {
      submission.innerText = `happiness:${happiness}\ncomment:\n${comment}`;
      fetch("https://happiness-app-backend.herokuapp.com/api/happiness/", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "value": happiness,
          "comment": comment,
          "timestamp": date
        })
      })
      .then(response => {
        if (!response.ok) {
          window.alert("something broke, maybe login again and hope it fixes itself");
          localStorage.removeItem("token");
          document.getElementById("content").style.display = 'none';
          document.getElementById("login").style.display = 'block';
        }
      });
    }
  }
);
