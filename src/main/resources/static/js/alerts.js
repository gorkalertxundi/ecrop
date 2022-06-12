const createSuccessAlert = details => {
    const template = document.getElementById("alert-template");
    const alert = template.content.cloneNode(true);
    alert.classList.add(details.type);
    alert.querySelector("h3").innerHTML = details.message;
    alert.querySelector("a").addEventListener("click", () => closeAlert(alert));
    alert.id = null;
    alert.classList.remove("hidden");
    document.querySelector("#alerts").appendChild(alert);
}

const closeAlert = alert => {
    alert.remove();
}