const rp = require('request-promise');
const DomParser = require('dom-parser');

const scrapeProduct =  (url) => {
    return rp(url)
    .then(function (body) {
        const parser = new DomParser()
        const dom = parser.parseFromString(body)
        
        const title = getTitle(dom)
        const price = getPrice(dom)
        const imageURL = getImageUrl(dom)

        return {
            title: title,
            price, price,
            imageURL: imageURL
        }    
    })
    .catch(err => {
        console.log(err)
    })
}

const scrapePriceOnly =  (url) => {
    
    
    return rp(url)
    .then(function (body) {

        if (body){
            return "body"
        } else {return "nobody"}

        const parser = new DomParser()
        const dom = parser.parseFromString(body)
        
        return getPrice(dom)
   
    })
    .catch(err => {
        console.log("err")
    })
}







const getTitle = (dom) => {
    const titleRaw = dom.getElementById('productTitle').innerHTML
    return titleRaw.trim()
}
const getPrice = (dom) => {
    const prices = dom.getElementsByClassName('offer-price')
    const buyboxprice = dom.getElementById('price_inside_buybox')
    if(buyboxprice){
        tmp = buyboxprice.innerHTML.replace(",", ".")
        return parseFloat(tmp.substr(0, tmp.length - 2))
    } 
    else if(prices){
        if(prices.length > 0){
            tmp = prices[0].innerHTML.replace(",", ".")
            return parseFloat(tmp.substr(0, tmp.length - 2))
        }
    }
}


const getImageUrl = (dom) => {
    const imgTarget_1 = dom.getElementById('img-canvas')
    const imgTarget_2 = dom.getElementById('imgTagWrapperId')
    const imgTarget_3 = dom.getElementById('altImages')
    const imgTarget_4 = dom.getElementsByClassName('imgTagWrapper')
    if(imgTarget_1){
        res = getIMG_1(imgTarget_1) 
        if(res){
            return res
        }               
    }
    if(imgTarget_2){
        res = getIMG_2(imgTarget_2.length)
        if(res){
            return res
        }
    }
    if(imgTarget_3){
        res = getIMG_3(imgTarget_3)
        if(res){
            return res
        }
    }
    if(imgTarget_4){
        res = getIMG_4(imgTarget_4)
        if(res){
            return res
        }
    }
}

const getIMG_1 = (target) => {
    imageSRC = target.getElementsByTagName("img")[0].getAttribute("data-a-dynamic-image") 
    return imageSRC.split("&quot;")[1]
}

const getIMG_2 = (target) => {
    try {
        imageSRC = target.getElementsByTagName("img")
        if(imageSRC.length > 0){
            srcAtt = imageSRC[0].getAttribute("src")
            return imageSRC
        }
    } catch (error) {
        
    }
}

const getIMG_3 = (target) => {
    imgTags = target.getElementsByTagName("img")
    if(imgTags.length > 0){
        refLink = imgTags[0].getAttribute("src") 
        return refLink
    }
}

const getIMG_4 = (target) => {
    if(target.length > 0){
        const imgTags = target[0].getElementsByTagName("img");
        if(imgTags.length > 0){
            refLink = imgTags[0].getAttribute("src")
            if (startsWith(refLink, "http")){
                return refLink
            }
        }  
    }
}

function startsWith(str, word) {
    return str.lastIndexOf(word, 0) === 0;
}

module.exports = {
    scrapeProduct: scrapeProduct,  
	scrapePriceOnly: scrapePriceOnly
}

