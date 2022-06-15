class websockets {
    users = [];
    connection(client){
        client.on('disconnect',()=>{
            this.users = this.users.filter((user)=>{
                user.socketId !== client.id
            });
        });

        client.on("identity",(userId)=>{
            this.users.push({
                socketId:client.id,
                userId : userId
            });
        });

        client.on("subscribe",(room,otherUserId = "")=>{
            this.subscribeOtherUser(room,otherUserId);
            client.join(room);
        });

        client.on("unsubscribe",(room)=>{
            client.leave(room);
        });
    }
    subscribeOtherUser(room,otherUserId){
        const userScokets = this.users.filter((user)=>{
            user.userId === otherUserId;
        });
        userScokets.map((userInfo)=>{
            const socketConn = global.io.sockets.connected(userInfo.socketId);
            if(socketConn){
                socketConn.join(room);
            }
        });       
    }
    
}

module.exports = new websockets()