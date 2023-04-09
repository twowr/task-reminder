console.log("task-reminder(v1.0) is working")

let popupDOM = document.createElement("div")
popupDOM.setAttribute("class", "selection_bubble")
popupDOM.style.width = "61.803398875vw"
popupDOM.style.height = "92.705098312vh"
document.body.appendChild(popupDOM)

document.addEventListener("mousedown", function (_event) {
    hidePopup()
}, false);

document.addEventListener("yt-navigate-finish", (_event) => {
    let is_short = document.getElementById("shorts-player")

    console.log("task-reminder: detect yt-navigate-finish")

    if (!(is_short === false)) {
        let videoElement = document.getElementsByTagName("video")[0]

        videoElement.addEventListener("ended", (_event) => {
            console.log(`task-reminder: current todo list is ${browser.storage.local.get("todo").then((result) => { return result.todo })}`)

            showPopup()

            console.log("task-reminder: video end detected")
        })
    }
})

function showPopup() {
    browser.storage.local.get("todo").then((result) => { popupDOM.innerHTML = "<pre>" + result.todo + "</pre>" })
    popupDOM.style.top = "calc((100vh - 90vh)/2)"
    popupDOM.style.left = "calc((100vw - 61.803398875vw)/2)"
    popupDOM.style.opacity = 0.5
    popupDOM.style.visibility = "visible"
}

function hidePopup() {
    popupDOM.style.opacity = 0
    popupDOM.style.visibility = "hidden";
}