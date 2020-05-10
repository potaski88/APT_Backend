const { Pool, Client } = require('pg')
const express = require('express');
const DB_config = require('./DB_config.js');
const {buildSchema} = require('graphql');
const graphqlHttp = require('express-graphql');  // middleware function
const auth = require('./middleware/auth.js');
const graphqlSchema = require('./schemas/index.js'); 
const graphqlResolvers = require('./resolvers/index.js'); 
// const Sequelize = require('sequelize');
const Product = require('./models/product')








const app = express();
// middleware
app.use(express.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST', 'PUT');
        return res.status(200).json({});
    }
    next(); 
});

//app.use(auth);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,    // resolver functions
    graphiql: true 
}));




app.get('/all', async (req, res) => {
//    const products = await Product.findAll();
    const products = await DB_config.getAllProducts()
//    console.log(products)
    res.send(JSON.stringify(products, null, 2))
    }
)

app.put('/update', async (req, res) => {
    const newData = req.body
    newData.forEach(async item => {
        setTimeout(async function(){
            await DB_config.updateProduct(item)
        }, 2000);
        })
        res.send(JSON.stringify("OK"))
})

app.put('/updateOne', async (req, res) => {
    const newData = req.body
    console.log(newData)
//    await DB_config.updateProduct(newData)
//    .then(res.send(JSON.stringify("OK")))

    setTimeout(async function(){
        const client = new Client(DB_config.connection_data)
        try {
            await client.connect()
            return await client.query(`UPDATE public.products SET price = ${newData.price} WHERE id = ${newData.id};`)
                .then(res => {
                    return res
                })
                .catch (error => console.log(error))
        } catch (error) {console.log(error) }
        finally{
            client.end()
        } 
    }, 2000);
})



app.get('/bre', async (req, res) => {
    res.send(JSON.stringify("bre"))
})



app.get('/test', async (req, res) => {
    const conn_data = {
        user: "pzwdfyitycyqus",
        password: "21ad6d97e80cfef3d0e18a117e10b123ca2ad82e83d770a6dd5a0b5bcf3c5f0b",
        host: "ec2-46-137-156-205.eu-west-1.compute.amazonaws.com",
        port: 5432,
        database: "d85bnlr9fphuei",
    }
    const conn_str ='postgres://pzwdfyitycyqus:21ad6d97e80cfef3d0e18a117e10b123ca2ad82e83d770a6dd5a0b5bcf3c5f0b@ec2-46-137-156-205.eu-west-1.compute.amazonaws.com:5432/d85bnlr9fphuei'
    const client = new Client(conn_data)
        try {
            await client.connect()
            return await client.query(`SELECT NOW();`)
                .then(res => {
                    console.log(res)
                })
                .catch (error => console.log(error))
        } catch (error) {console.log(error) }
        finally{
            client.end()
        } 
    

    const y = 3
    const x = [
        { id: 28, price: y },
        { id: 23, price: y },
        { id: 22, price: y },
        { id: 24, price: y },
        { id: 3, price: y },
    ]
    res.send(JSON.stringify("OK"))

    })







const port = process.env.PORT || 5001;
app.listen(port, () => console.log("running!!"));








