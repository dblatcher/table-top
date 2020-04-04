const formSelector = '[data-role="sign-in-form"]'
const userNameSelector = '#user-name-indicator'


function updatePlayerStatus (userData, localPlayer) {

    Object.assign(localPlayer,userData)

    const userNameIndicator = document.querySelector(userNameSelector)
    if (userNameIndicator) {
        userNameIndicator.innerText = localPlayer.userName;
    }
}

function makeSubmitHandler(socket, localPlayer) {

    function submitHandlerCallBack(response) {
        if (response.type === 'REFUSAL') {
            alert (response.message)
            return false
        }
        updatePlayerStatus(response, localPlayer)
    }

    return function (event) {
        event.preventDefault();

        if (localPlayer.userName) {
            alert (`You are already logged in as ${localPlayer.userName}`)
            return false
        }

        // TO DO - SANITISE INPUT!!
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