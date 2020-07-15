const {buildSchema} = require('graphql');

module.exports = buildSchema(`

type Product {
    id: Int
    created: String
    usr: Int
    img: String
    price: String
    title: String
    url: String
    notification: Int
}
type ProducTEST {
    title: String
    price: String
    imageURL: String
}

type AuthData {
    id: String
    token: String
    exp: Int
    msg: String
}

type ProductDetails {
    id: String
    created: String
    price: String
    img: String
}




type RootQuery {
    getAllByUserID(userID: Int): [Product]
    login(email: String, pw: String): AuthData
    createProductTable(name: String): String
    createUsersTable: String
    enterProduct(url: String, usr: Int): Product
    enterUser(email: String, pw: String): Int
    createALLProductsTable: String
    deleteProduct(prodID: Int): String
    getProductDetails(prodID: Int): [ProductDetails]
    registerUser(email: String, pw: String): String
    confirmUser(code: Int): String
    setNotificationValue(prodID: Int, notification: Int): String
    deleteUser(userID: Int): String

    testScrape(url: String): String

    registerUserTEST(email: String, pw: String): String
    
}

schema {
    query: RootQuery

    
    
}`

);