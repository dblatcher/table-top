
let userHasBeenToldThierBrowserHasNoLocalStorage = false

function browserHasLocalStorage() {
    if (typeof localStorage !== 'object') {
        if (userHasBeenToldThierBrowserHasNoLocalStorage) {return false}
        alert('This browser does not support local storage - data cannot be saved or restored!')
        userHasBeenToldThierBrowserHasNoLocalStorage = true
        return false
    }
    return true
}

function save(folderName, itemName, data) {
    if (!browserHasLocalStorage) {return false}

    if (!localStorage.getItem(folderName)) {
        localStorage.setItem(folderName, JSON.stringify({}) )
    }
    let folder = JSON.parse (localStorage.getItem(folderName))
    folder[itemName] = data
    localStorage.setItem(folderName, JSON.stringify(folder) )
}

function load(folderName, itemName) {
    if (!browserHasLocalStorage) {return false}

    let data = window.localStorage.getItem(folderName)
    if (!data) { return false}
    data = JSON.parse(data)
    return data[itemName]
}

function getItemNames (folderName) {
    if (!browserHasLocalStorage) {return []}
    if (!localStorage.getItem(folderName)) {
        return []
    }
    let folder = JSON.parse (localStorage.getItem(folderName))
    return Object.keys(folder)
}

export {save, load, getItemNames}