function onRoll (state, socket, io){
    return function (playerId, rollData) {


        matchingPlayer = state.getPlayerById(playerId)
        if (!matchingPlayer) {return false}

        console.log(matchingPlayer.playerName, rollData.message);

        socket.to(matchingPlayer.gameId).emit('roll',{ 
            player: matchingPlayer.clientSafeVersion,
            rollData,
        });
    }
}

module.exports = onRoll