console.log("task-reminder(v1.1) is working")

let popupDOM = document.createElement("div")
popupDOM.setAttribute("class", "todo_list")
popupDOM.style.width = "61.803398875vw"
popupDOM.style.height = "92.705098312vh"
document.body.appendChild(popupDOM)

document.body.addEventListener("click", (event) => {
    if (event.target.className !== "todo_list") {
        hidePopup()
    }
})

function waitForYoutubePageReady() {
    return new Promise((resolve, _reject) => {
        const observer = new MutationObserver(mutations => {
                const hasAjaxLoaded = mutations.some(mutation => {
                    const target = mutation.target

                    if (target && target.nodeName === "BODY" && mutation.type === "childList") {
                        const ajaxElements = target.querySelectorAll("[data-prevent-ajax-transition]")
                        return !ajaxElements.length
                    }

                    return false
                })

                if (hasAjaxLoaded) {
                    resolve()
                    observer.disconnect()
                }
        })

        observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    })
}

let state = new Object
state.short_count = 0
state.previousState = null
state.currentState = null

document.addEventListener("yt-navigate-finish", () => {
    console.log("task-reminder: yt-navigate-finish detected")

    state.short_count += 1

    waitForYoutubePageReady().then(run_extension_logic(state))

    state.previousState = state.currentState
})

function run_extension_logic(state) {
    let is_short = document.getElementById("shorts-player")
    let is_watch = !(document.getElementsByTagName("ytd-watch-flexy")[0].attributes.hidden)
    let is_other = !is_short && !is_watch

    console.log(is_short)

    console.log("task-reminder: detect yt-navigate-finish")

    if (is_watch) {
        console.log("task-reminder: is watch")
        state.currentState = "watch"

        state.short_count = 0

        let videoElement = document.getElementsByTagName("video")[0]

        videoElement.addEventListener("ended", (_event) => {
            showPopup()

            console.log("task-reminder: video end detected")
        })
    }

    if (is_short) {
        console.log("task-reminder: is short")
        state.currentState = "short"

        let modulus = 3

        let container =  document.getElementById("shorts-inner-container")
        let reels = [...container.getElementsByTagName("ytd-reel-video-renderer")]

        reels.forEach((reel) => {
            let videoElement =  reel.getElementsByTagName("video")[0]

            videoElement.addEventListener("seeked", (_event) => {
                state.short_count += 1

                if (state.short_count % modulus === 0) {
                    showPopup()
                }

                console.log("task-reminder: video seeked detected")
            })
        })
    }

    if (is_other) {
        console.log("task-reminder: is other")
        state.currentState = "other"

        state.short_count = 0
        let show_on_leave = true

        if (show_on_leave && state.previousState !== "other") {
            showPopup()
        }
    }
}

function showPopup() {
    browser.storage.local.get("todo").then((result) => {
        popupDOM.innerHTML = result.todo
    });
    popupDOM.style.top = "calc((100vh - 90vh)/2)"
    popupDOM.style.left = "calc((100vw - 61.803398875vw)/2)"
    popupDOM.style.opacity = 0.75
    popupDOM.style.visibility = "visible"
}

function hidePopup() {
    popupDOM.style.opacity = 0
    popupDOM.style.visibility = "hidden"
}
