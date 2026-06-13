const userAuth = (req, res, next) => {
    const userToken = "token2";
    const isAuthorized = userToken === "token2";
    if (!isAuthorized) {
        res.status(401).send("Unauthorized User");
    } else {
        next();
    }
}

module.exports = { userAuth };