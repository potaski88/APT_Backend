require('dotenv').config()
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
const Utils = require('./utils.js');







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







app.get('/cheerio', async (req, res) => {
    const cheerio = require('cheerio')
    const axios = require('axios')

    const url = "https://www.amazon.de/dp/B00H9I40CA/?coliid=IYUVS7QX8E4K4&colid=2VAR5ZRGOET20&psc=1&ref_=lv_ov_lig_dp_it"
    try {
        axios.get(url).then((response) => {

            const $ = cheerio.load(response.data)
            const txt = $('#price_inside_buybox').text()
    
            console.log(txt)
            res.send(JSON.stringify(txt)) 
        }) 
    } catch (error) {
        res.send(JSON.stringify("error")) 
    }
    
  
     
})



app.get('/test', async (req, res) => {
    try {
        Utils.sendRegistrationMail()
    } catch (error) {
        console.log(error)
    }
    

    res.send(JSON.stringify("OK"))  
})

app.get('/show', async (req, res) => {
    const show = await DB_config.showTest()    
        if(show){
            res.send(JSON.stringify(show))
        }else{
            res.send(JSON.stringify("Fail"))
        }
})






const port = process.env.PORT || 5001;
app.listen(port, () => console.log("running!!"));








