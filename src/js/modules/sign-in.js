const formSelector = '[data-role="sign-in-form"]'



function makeSubmitHandler(socket, localPlayer) {

    function submitHandlerCallBack(response) {
        if (response.type === 'REFUSAL') {
            alert (response.message)
            return false
        }
        alert (`Received request to log you in as ${response.userName}`)
        localPlayer = response
    }

    return function (event) {
        event.preventDefault();

        if (localPlayer) {
            alert (`You are already logged in as ${localPlayer.userName}`)
            return false
        }

        const form = event.target
        const userName = form.elements.userName.value
        socket.emit('sign-in', {userName}, submitHandlerCallBack)
    }
}

function initSignInForm(socket, localPlayer) {
    const form = document.querySelector(formSelector)
    if (!form) {return false}

    const submitHandler = makeSubmitHandler(socket, localPlayer)
    form.addEventListener('submit', submitHandler)

}

export {initSignInForm}