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
const Scraper = require('ampritra-scraper');
const fetch = require('node-fetch');
const axios = require('axios');




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


///////////////////////////////////////////////////
//app.use(auth);
///////////////////////////////////////////////////




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

/*
app.put('/update', async (req, res) => {
    const newData = req.body
    newData.forEach(async item => {
        setTimeout(async function(){
            await DB_config.updateProduct(item)
        }, 2000);
        })
        res.send(JSON.stringify("OK"))
})
*/

app.put('/updateOne', async (req, res) => {
    const newData = req.body
    console.log(newData)
    await DB_config.updateProduct(newData)
    .then(res.send(JSON.stringify("OK")))

    try {
        await DB_config.updateProduct(newData)
        .then(res.send(JSON.stringify("OK")))
        .catch (error => console.log(error))
    } catch (error) {
        console.log(error)
        res.send(JSON.stringify("OK"))
     }

/*
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
    */
})



/////////////////////////////////////////////////



app.get('/cheerio', async (req, res) => {
    const cheerio = require('cheerio')
    const axios = require('axios')
    

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
    const url = "https://www.amazon.de/dp/B00H9I40CA/?coliid=IYUVS7QX8E4K4&colid=2VAR5ZRGOET20&psc=1&ref_=lv_ov_lig_dp_it"
    
    try {
        const price = await Scraper.scrapePriceOnly(url)
        console.log(price)
        res.send(JSON.stringify(price))
    } catch (error) {
        res.send(JSON.stringify("error"))
    }
    

})



app.get('/pupp', async (req, res) => {
    const puppeteer = require('puppeteer');
    const url = "https://www.amazon.de/dp/B00H9I40CA/?coliid=IYUVS7QX8E4K4&colid=2VAR5ZRGOET20&psc=1&ref_=lv_ov_lig_dp_it"
    
    try {
        (async () => {
            const browser = await puppeteer.launch({ args: ['--no-sandbox'] } );
            const page = await browser.newPage();

            await page.goto(url, { waitUntil: 'networkidle0' });

            const renderedContent = await page.evaluate(() => new XMLSerializer().serializeToString(document));

            console.log(renderedContent);
            res.send(renderedContent)
            await browser.close();
          })();
        
    } catch (error) {
        res.send(JSON.stringify("error"))
    }
    

})



/*
app.get('/email', async (req, res) => {
    var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'matwolmu@gmail.com',
    pass: 'matthias88'
  }
});
var mailOptions = {
  from: 'matwolmu@gmail.com',
  to: 'matwolmu@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    res.send("error")
  } else {
    console.log('Email sent: ' + info.response);
    res.send("OK")
  }
});
})
*/




app.get('/show', async (req, res) => {
    const show = await DB_config.showTest()    
        if(show){
            res.send(JSON.stringify(show))
        }else{
            res.send(JSON.stringify("Fail"))
        }
})


////////////////////////////////////////////////////
app.get('/localTest', async (req, res) => {
    const rawURL = "https://www.amazon.de/dp/B00H9I40CA/?coliid=IYUVS7QX8E4K4&colid=2VAR5ZRGOET20&psc=1&ref_=lv_ov_lig_dp_it"
    const url = encodeURIComponent(rawURL)

    const target = "https://pupptest.herokuapp.com/"
    const targetLocal = "localhost:5100/"
    
    console.log(url)
    const body = { url: url  };
    try {
       fetch(target + 'getPrice', {
            method: 'post',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })
    //    .then(res => {
    //        return res.json()
    //    })
        .then(json => {
            console.log(json)
            res.send(json)
        })
        .catch(err => console.log(err))
    } catch (error) {
        res.send("error")
    }
    
})

app.get('/localTest2', async (req, res) => {
    const target = "https://pupptest.herokuapp.com/getPrice"
    const targetLocal = "http://localhost:5100/getPrice"
    
    const rawURL = "https://www.amazon.de/dp/B00H9I40CA/?coliid=IYUVS7QX8E4K4&colid=2VAR5ZRGOET20&psc=1&ref_=lv_ov_lig_dp_it"

    const url = encodeURIComponent(rawURL)
    try {
        axios.post(target, {
            url: url
          })
          .then(function (response) {
            console.log(response.data);
            res.send(response.data)
          })
          .catch(function (error) {
            console.log(error);
          });
    } catch (error) {
        res.send("error")
    }
})



app.get('/gator', async (req, res) => {
    const target = "http://potaski.space/mail/"
    try {
        axios.post(target, {
            email: "matwolmu@gmail.com"
          })
          .then(function (response) {
            console.log(response.data);
            res.send(response.data)
          })
          .catch(function (error) {
            console.log(error);
            res.send("ERROR")
          });
    } catch (error) {
        res.send("error")
    }
})




const port = process.env.PORT || 5002;
app.listen(port, () => console.log("running!!"));








