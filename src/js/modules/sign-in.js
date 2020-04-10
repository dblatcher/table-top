const formSelector = '[data-role="sign-in-form"]'
const playerNameSelector = '#player-name-indicator'


function updatePlayerStatus (userData, localPlayer) {

    Object.assign(localPlayer,userData)

    const playerNameIndicator = document.querySelector(playerNameSelector)
    if (playerNameIndicator) {
        playerNameIndicator.innerText = localPlayer.playerName;
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

        if (localPlayer.playerName) {
            alert (`You are already logged in as ${localPlayer.playerName}`)
            return false
        }

        // TO DO - SANITISE INPUT!!
        const form = event.target
        const playerName = form.elements.playerName.value
        socket.emit('sign-in', {playerName}, submitHandlerCallBack)
    }
}

function initSignInForm(socket, localPlayer) {
    const form = document.querySelector(formSelector)
    if (!form) {return false}

    const submitHandler = makeSubmitHandler(socket, localPlayer)
    form.addEventListener('submit', submitHandler)
}

export {initSignInForm}