window.onload = getIssues(1);

function getIssues(page) {
    if (!document.getElementById("error").classList.contains("d-none")) document.getElementById("error").classList.add("d-none")
    if (!document.getElementById("no-issues").classList.contains("d-none")) document.getElementById("no-issues").classList.add("d-none")
    spinner();
    let perc = document.getElementById("perc").value;
    let lang = document.getElementById("lang").value;

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 0 || (this.status >= 200 && this.status < 400)) {
                spinner();
                // if server sends a response
                if (this.responseText != "[]") {
                    let results = JSON.parse(this.responseText);
                    results.forEach(issue => {
                        let card = document.createElement("DIV");
                        card.classList.add("card", "col-11", "col-md-5", "col-xl-3");

                        // Iterate through labels
                        let cardLabels = "<p>"
                        issue.labels.forEach(label => cardLabels += `<span class="label">${label.name}</span>`)
                        cardLabels += "</p>"

                        // Iterate through languages
                        let cardLanguages = "<p>"
                        for (const language in issue.languages) {
                            cardLanguages += `<span>${language.toUpperCase()}: ${issue.languages[language].toFixed(2)}%</span>`
                        }
                        cardLanguages += "</p>"

                        card.innerHTML = `
                <div class="issueDesc">
                <span class="card-title">Issue Description</span>
                <span>${issue.title}</span>
            </div>
            <div class="issueDetails">
                <div class="issueDate">
                    <span class="card-title">Date Created</span>
                    <span>${relativeTime(issue.created_at)}</span>
                </div>
                <div class="issueLabels">
                    <span class="card-title">Labels</span>
                    ${cardLabels}
                </div>
            </div>
            <div class="repoDetails">
                <div class="repoName">
                    <span class="card-title">Repository Name</span>
                    <span>${issue.repo_details.full_name}</span>
                </div>
                <div class="repoDesc">
                    <span class="card-title">About Repository</span>
                    <span>${issue.repo_details.description}</span>
                </div>
            </div>
            <div class="repoLanguages">
                <span class="card-title">Languages</span>
                ${cardLanguages}
            </div>

            <div class="repoStats">
                <div class="repoStars">
                    <span class="card-title">Stars</span>
                    <span>${issue.repo_details.stargazers_count}</span>
                </div>
                <div class="repoLastPush">
                    <span class="card-title">Last Push</span>
                    <span>${relativeTime(issue.repo_details.pushed_at)}</span>
                </div>
            </div>
            <a href=${issue.html_url} class="stretched-link" target="_blank" rel="noopener noreferrer">Go to issue</a>
                `
                        document.getElementById("row").appendChild(card);
                    });

                    document.getElementById("row").setAttribute("page", `${page++}`)
                }

                else if (this.responseText === "[]") {
                    displayNoIssues()
                }
                else {
                    displayError();
                }
            }
        }


    }
    xhttp.open("GET", `https://goodfirstissueapi.netlify.app/.netlify/functions/app?perc=${perc}&lang=${lang}&page=${page}`);
    xhttp.send();
}

function spinner() {
    document.getElementById("row").classList.toggle("d-none");
    document.getElementById("row").innerHTML = "";
    document.getElementById("spinner").classList.toggle("d-none")
    document.getElementById("spinner").classList.toggle("d-flex")
}

function relativeTime(date) {
    const deltaDays = (new Date(date).getTime() - Date.now()) / (1000 * 3600 * 24);
    const formatter = new Intl.RelativeTimeFormat();
    let results = formatter.format(Math.round(deltaDays), 'days');
    return results.split(" ").includes("0") ? "Today" : results;
}

function next() {
    let curPage = Number(document.getElementById("row").getAttribute("page"))
    let prevElement = document.getElementById("prev");

    if (curPage == 1 && prevElement.classList.contains("d-none")) {
        prevElement.classList.remove("d-none");
    }
    getIssues(curPage + 1);

}

function prev() {
    let curPage = Number(document.getElementById("row").getAttribute("page"))
    let prevElement = document.getElementById("prev");

    curPage <= 1 ? prevElement.classList.add("d-none") : getIssues(curPage - 1);

}

function displayError() {
    document.getElementById("error").classList.remove("d-none")
}

function displayNoIssues() {
    document.getElementById("no-issues").classList.remove("d-none")
    document.getElementById("no-issues-perc").innerText = document.getElementById("perc").value
    document.getElementById("no-issues-lang").innerText = document.getElementById("lang").value
}