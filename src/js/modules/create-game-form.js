
const formSelector = '[data-role="create-game-form"]'

function sendForm(event){
    event.preventDefault();
    const form = event.target
    form.setAttribute('action', "game/"+form.gameName.value)
    form.submit()
}

function initCreateGameForm() {
    const form = document.querySelector(formSelector)
    if (!form) {return false}
    form.addEventListener("submit",sendForm)
}

export {initCreateGameForm}