class User{
constructor(userName,userCode,userRole){
    this.UserName = userName;
    this.UserCode = userCode;
    this.UserRole = userRole;
    this.UserClient = "";
}

IsUserDM(){
    return (this.UserRole === "DM");
}

IsUserPlayer(){
    return (this.UserRole === "Player");
}

SetUserClient(client){
    this.UserClient = client;
}


}



module.exports = User;