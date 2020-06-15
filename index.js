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
const DomParser = require('dom-parser');



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



app.put('/updateOne', async (req, res) => {
    const newData = req.body
    console.log("updateOne     " + newData)

     const client = new Client(DB_config.connection_data)
     let today = new Date().toISOString().slice(0, 10)
     try {
         await client.connect()
         return await client.query(`
         INSERT INTO public.product_${newData.id} (
            id, 
            created,
            price
            ) VALUES (
                nextval('product_${newData.id}_sequence')::integer,
                '${today}'::text,
                '${newData.price}'::text
            ) returning id;`)
            .then(async res => {
                
                let notificationValue = await client.query(`
                    SELECT notification FROM public.products WHERE id=${res.rows[0].id};`)
                
                if(parseFloat(newData.price) <= notificationValue){
                    console.log("send email")
                    await client.query(`
                        UPDATE public.products SET notification = 0 WHERE id=${res.rows[0].id};`)
                    .then(res => {
                        console.log("set to 0")


////////////////////////////
            const target = "http://potaski.space/api/"
            try {
                return axios.post(target, {
                    email: email,
                    code: code
                })
                .then(async function (response) {
                    console.log(response.data);
                    const enteredUser = await DB_config.enterUser(email, hashedPW, code);
                    if(enteredUser){
                        console.log(enteredUser)
                    }else {
                        console.log("")

                    }
                })
                .catch(function (error) {console.log(error);});
            } catch (error) {console.log(error)} 
////////////////////////////



            
                    })
                    .catch(err => {console.log("set to 0 failed")})
                }
                return res.rows[0].id

            })                
             .then(result => {
            //     console.log("entered  " + newData.id +  " ___ " + result)
            //     res.send("OK entered") 
             })
             .catch (error => console.log("error"))
     } catch (error) {console.log("error");  }
     finally{
         client.end()
         res.send("OK entered") 
     } 
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


app.get('/zen', async (req, res) => {
    try {
        var request = require('request');
        const key = "2e4a0950-ab24-11ea-9bcd-4d4684ddfa61"
        const target = "https://www.amazon.de/dp/0826490913/?coliid=I217ALF18GNQUY&colid=2VAR5ZRGOET20&psc=1&ref_=lv_ov_lig_dp_it"
        var options = { 
        url: 'https://app.zenscrape.com/api/v1/get?apikey=' + key +  '&url=' + target + '&location=eu'
        };
        // &render=true&premium=true
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
            //    console.log(body);
                const parser = new DomParser()
                const dom = parser.parseFromString(body)
                
                const titleRaw = dom.getElementById('productTitle').innerHTML
                const title =  titleRaw.trim()
                res.send(title)
                console.log(title);
            } else {
                res.send("blocked")
            }
        }
        request(options, callback);
    } catch (error) {
        res.send("error")
    }
})




const port = process.env.PORT || 5002;
app.listen(port, () => console.log("running!!"));








