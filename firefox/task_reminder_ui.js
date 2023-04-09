browser.storage.local.get("todo").then((result) => { document.getElementsByTagName("textarea")[0].value = result.todo })

document.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON" || !event.target.closest(".popup-content")) {
        return
    }

    if (event.target.id === "save") {
        let save_data = document.getElementsByTagName("textarea")[0].value

        browser.storage.local.set({todo: save_data})
        console.log(`task-reminder: saving ${save_data} to localStorage`)
    }

    if (event.target.id === "clear") {
        document.getElementsByTagName("textarea")[0].value = ""
    }
})