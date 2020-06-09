const {buildSchema} = require('graphql');

module.exports = buildSchema(`

type Product {
    id: Int
    usr: Int
    url: String
    title: String
    price: String
    img: String
    created: String
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

    testScrape(url: String): String

    registerUserTEST(email: String, pw: String): String
    
}

schema {
    query: RootQuery

    
    
}`

);