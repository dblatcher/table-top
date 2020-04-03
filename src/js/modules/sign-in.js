const formSelector = '[data-role="sign-in-form"]'

function submitHandlerCallBack(response) {

    if (response.type === 'REFUSAL') {
        alert (response.message)
        return false
    }

    alert (`Recieved request to log you in as ${response.userName}`)
}

function makeSubmitHandler(socket) {
    return function (event) {
        event.preventDefault();
        const form = event.target
        const userName = form.elements.userName.value
        socket.emit('sign-in', {userName}, submitHandlerCallBack)
    }
}

function initSignInForm(socket) {
    const form = document.querySelector(formSelector)
    if (!form) {return false}

    const submitHandler = makeSubmitHandler(socket)
    form.addEventListener('submit', submitHandler)

}

export {initSignInForm}