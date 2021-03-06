const DB_config = require('../DB_config.js');
const Utils = require('../utils.js');
const {Client } = require('pg')

const request = require('request');
const User = require('../models/user')
const Product = require('../models/product')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
// const Scraper = require('ampritra-scraper');
const Scraper = require('../scraper.js');

module.exports = {         

    getAllByUserID: async (args) => {
        const products = await DB_config.getAllByUserID(args.userID)
        if(products){
//            console.log("All products:", JSON.stringify(products, null, 2));
            return products;
        }
    },

    login: async ({email, pw}) => {
        const user = await User.findOne({ where: { email: email } });
        if(!user){
            return {
                id: 0,
                token: "",
                exp: 0,
                msg: "User doesn't exist"
            };
        } else {
            const isEqual = await bcrypt.compare(pw, user.pw);
            if(!isEqual){
                return {
                    id: 0,
                    token: "",
                    exp: 0,
                    msg: "Password not correct"
                };
            //    throw new Error("pw not correct");
            }
            if(user.registered !== 0){
                return {
                    id: 0,
                    token: "",
                    exp: 0,
                    msg: "Registration not finished"
                };
            //    throw new Error("registration not finished");
            }
            const token = await jwt.sign({email: email}, "secret", {expiresIn: "1h"});
            if(token){
                return {
                    id: user.id,
                    token: token,
                    exp: 1,
                    msg: "OK"
                };
            }
        }

    },
    
    setNotificationValue: async ({prodID, notification}) => {
        await DB_config.setNotificationValue(prodID, notification)
        .then(console.log("set notification value"))
        .catch(err => {
            console.log(err)
        })
    },

    createALLProductsTable: async () => {
        await DB_config.createALLProductsTable()
        .then(console.log("created"))
        .catch(err => {
            console.log(err)
        })
    },

    createProductTable: async (name) => {
        await DB_config.createProductTable(name)
        .then(console.log("product table created"))
        .catch(err => {
            console.log(err)
        })
    },

    deleteUser: async ({userID}) => {
        await DB_config.deleteUser(userID)
        .then(res => {
            console.log("user " + userID + "deleted")
        })
        .catch(err => {
            console.log(err)
        })
    },

    


////////////////////////////////////////////////////////////////
    testScrape: async (url) =>{
    //    const scraped = await Scraper.scrapePriceOnly(url)
        if(true){
            return JSON.stringify("not scraped") 
        }else {
            return "FAIL"
        }
    },


    enterProduct: async ({url, usr}) => {
        const target = "https://pupptest.herokuapp.com/getInfo"
        const processedURL = encodeURIComponent(url)
        try {
            const scraped = await axios.post(target, {
                url: processedURL
              })
              .then(function (response) {
            //    console.log(response.data);
                return response.data
              })
              .catch(function (error) {
            //    console.log(error);
              });
            let today = new Date().toISOString().slice(0, 10)
            newEntry =  { 
                url: url,
                usr: usr,
                title: scraped.title,
                price: scraped.price,
                img: scraped.imageURL,
                created: today             
            }


            const entered = await DB_config.enterProduct(newEntry)   /// problem!!!!!
            .then(res => {

                console.log("res in entered -----------------------------------------------")
                console.log(res)

                return {
                    id: res,
                    usr: newEntry.usr,
                    url: url,
                    title: scraped.title,
                    price: "" + scraped.price,
                    img: scraped.imageURL,   
                }
            })
            .catch(err => {
            //    console.log(err)
            })

            console.log("entered.id: " + entered.id )
            console.log(entered)

            await DB_config.createProductTable({
                id: entered.id, 
                price: entered.price,
                created: today
            })
            .then(res => {
                return res
            })
            .catch(err => {
            //    console.log(err)
            })
            return entered
        } catch (error) {
        //    console.log(error)
            return "error"
        }
    },



/*
    enterProduct: async ({url, usr}) => {
        if(url){
            const scraped = await Scraper.scrapeProduct(url)    //////////////////////
            let today = new Date().toISOString().slice(0, 10)
            newEntry =  { 
                url: url,
                usr: usr,
                title: scraped.title,
                price: scraped.price,
                img: scraped.imageURL,
                created: today             
            }
            const entered = await DB_config.enterProduct(newEntry)
            .then(res => {
//                console.log(res)
                return {
                    id: res,
                    usr: newEntry.usr,
                    url: url,
                    title: scraped.title,
                    price: "" + scraped.price,
                    img: scraped.imageURL,   
                }
            })
            .catch(err => {console.log(err)})

            await DB_config.createProductTable({
                id: "" + entered.id, 
                price: entered.price,
                created: today
            })
            .then(res => {
//                console.log(res)
                return res
            })
            .catch(err => {console.log(err)})

            return entered
        } else {
            return "no url"
        }  
    },

*/





    createUsersTable: async () => {
        await DB_config.createUsersTable()
        .then(console.log("user table created"))
        .catch(err => {
            console.log(err)
        })
    },


    enterUser: async ({email, pw}) => {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            console.log('alread exists');
        } else {
            const hashedPW = await bcrypt.hash(pw, 12)
    //        console.log(hashedPW)
            const enteredUser = await DB_config.enterUser(email, hashedPW);
            if(enteredUser){
    //            console.log(enteredUser)
                return enteredUser.id
            }
        }
    },

    registerUser: async ({email, pw}) => {
        const existingUser = await DB_config.findUser(email);
        if (existingUser.length > 0) { 
            console.log('already exists');
            return 'already exists'
        } else {
            const code = Math.floor((Math.random()*10000) + 1)
            const target = "http://potaski.space/api/"
            try {
                return axios.post(target, {
                    email: email,
                    code: code
                })
                .then(async function (response) {
                    console.log(response.data);
                    const hashedPW = await bcrypt.hash(pw, 12)
                    const enteredUser = await DB_config.enterUser(email, hashedPW, code);
                    if(enteredUser){
                        console.log(enteredUser)
                        return "OK"  
                    }else {
                        console.log("user not entered into DB")
                        return "not OK" 
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    return "not OK" 
                });
            } catch (error) {
                console.log(error)
                return "error" 
            } 
        }
    }, ////////////////////////////////////////////
    /*
    registerUserTEST: async ({email, pw}) => {
        const code = Math.floor((Math.random()*10000) + 1)
        const target = "http://potaski.space/api/"
        try {
             axios.post(target, {
                email: "matwolmu@gmail.com",
                code: code
            })
            .then(function (response) {
                console.log(response.data);
                return "OK" 
            })
            .catch(function (error) {
                console.log(error);
                return "not OK" 
            });
        } catch (error) {
            console.log(error)
            return "error" 
        }
    },
*/

    confirmUser: async ({code}) => {
        const confirmed = await DB_config.confirmUser(code);
        if(confirmed){
            console.log("confirmed: " + confirmed)
            return "OK"
        }
    },

    
    

    deleteProduct: async ({prodID}) => {
        await DB_config.deleteProduct(prodID)
        .then(console.log("prdouct deleted"))
        .catch(err => {
            console.log(err)
        })
    },

    getProductTimeline: async ({prodID}) => {
        const details = await DB_config.getProductTimeline(prodID)
        if (details) {
//            console.log(details)
            return details
        } else {
            console.log("error")
        }
    },
    
    getProductInfo: async ({prodID}) => {
        const details = await DB_config.getProductInfo(prodID)
        if (details) {
            return details
        } else {
            console.log("error")
        }
    },
    
      




}










