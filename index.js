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
    const fetch = require('node-fetch');

    const url = "https://www.amazon.de/dp/B07TL8SBH3/ref=sspa_dk_detail_1?psc=1&pd_rd_i=B07TL8SBH3&pd_rd_w=nLfTD&pf_rd_p=d3e24f85-c2f2-4959-bef4-3acc5e4e81dc&pd_rd_wg=TuPMi&pf_rd_r=C32WJ0F77DST3XQ8Z2YY&pd_rd_r=78e28d2b-3b42-4c51-abe3-8b4e2859f78d&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyRFhES1RLQzc1M1VEJmVuY3J5cHRlZElkPUEwNjc5NjQ5MUNLUklDV01LQllSMSZlbmNyeXB0ZWRBZElkPUEwMzUxMjAwMTdON0hSRjhaSjQ0QSZ3aWRnZXROYW1lPXNwX2RldGFpbCZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU="

    try {
        fetch(url)
        .then(response => response.text())
        .then(json => {
            console.log(json)
            res.send(json) 


    //        const $ = cheerio.load(json.data)
    //        const txt = $('#price_inside_buybox').text()

    //        res.send(JSON.stringify(txt)) 
        })
        .catch (error => {
            console.log(error)
            res.send(JSON.stringify("Error")) 
        }) 
    } catch (error) {
        console.log(error)
        res.send(JSON.stringify("err")) 
    }

})



app.get('/test', async (req, res) => {
    const fetch = require('node-fetch');
//        Utils.sendRegistrationMail()
    const rp = require('request-promise');
    const DomParser = require('dom-parser');
    const Scraper = require('./scraper.js');

    var options = {
        uri: 'https://www.amazon.de/dp/B00H9I40CA/?coliid=IYUVS7QX8E4K4&colid=2VAR5ZRGOET20&psc=1&ref_=lv_ov_lig_dp_it',
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0", "Accept-Encoding":"gzip, deflate", "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT":"1","Connection":"close", "Upgrade-Insecure-Requests":"1"
        },
//        json: true // Automatically parses the JSON string in the response
    };

    try {

        fetch(options.uri, {
            method: 'get',
    //        body:    JSON.stringify(body),
            headers: options.headers,
        })
        .then(x => x.text())
        .then(html => {
            const parser = new DomParser()
            const dom = parser.parseFromString(html)
            const price = Scraper.getPrice(dom)
            console.log(price)
            res.send(JSON.stringify(price)) 
        })
        
        /*
        rp(options)
        .then(function (html) {
            console.log(html);
            res.send(html) 
        })
        .catch(function (err) {
            console.log(err)
            res.send(JSON.stringify("err")) 
        });
        */
        
    } catch (error) {
        console.log(error)
        res.send(JSON.stringify("err")) 
    }

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








