const formSelector = '[data-role="sign-in-form"]'

function makeSubmitHandler(socket) {
    return function (event) {
        event.preventDefault();
        const form = event.target
        const userName = form.elements.userName.value
        socket.emit('sign-in', {userName})
    }
}

function initSignInForm(socket) {
    const form = document.querySelector(formSelector)
    if (!form) {return false}

    const submitHandler = makeSubmitHandler(socket)
    form.addEventListener('submit', submitHandler)

}

export {initSignInForm}