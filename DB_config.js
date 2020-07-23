const { Pool, Client } = require('pg')
const Sequelize = require('sequelize');

/*
const connection_data = {
    user: "fuhshhcu",
    password: "BbUmDv8jyTR4yp75rcBVWurwYkAea0up",
    host: "drona.db.elephantsql.com",
    port: 5432,
    database: "fuhshhcu",
    omitNull: true
}
const connectionString = 'postgres://fuhshhcu:BbUmDv8jyTR4yp75rcBVWurwYkAea0up@drona.db.elephantsql.com:5432/fuhshhcu'
*/
const envConnec = "postgres://ofbugdwpkfgivl:cc6fe18e3014457b6b03884688458dcdc22199990d06b22924710e7213c1df82@ec2-46-137-156-205.eu-west-1.compute.amazonaws.com:5432/d7u7v3ljdp6suo"
// const envConnec = process.env.DATABASE_URL

const db = envConnec.split("/").pop()
const user = envConnec.split("/")[2].split(":")[0]
const pw = envConnec.split("/")[2].split(":")[1].split("@")[0]
const host = envConnec.split("/")[2].split(":")[1].split("@")[1]
const connection_data = {
    user: user,
    password: pw,
    host: host,
    port: 5432,
    database: db,
    omitNull: true
}



async function createALLProductsTable() {
    const name = "products"
    const client = new Client(connection_data)
    try {
        await client.connect()
        await client.query(`
        CREATE SEQUENCE ${name}_sequence
            start 1
            increment 1;

        CREATE TABLE public."${name}" (
            id serial NOT NULL ,
            "created" text COLLATE pg_catalog."default",
            usr integer,
            img text COLLATE pg_catalog."default",
            price text COLLATE pg_catalog."default",
            title text COLLATE pg_catalog."default",
            url text COLLATE pg_catalog."default",
            scraped integer,
            notification integer,
            CONSTRAINT ${name}_pkey PRIMARY KEY (id)
        )
        WITH (OIDS = FALSE)
        TABLESPACE pg_default; 
        ALTER TABLE public."${name}"
            OWNER to "${connection_data.user}";
        `);
    } catch (error) {console.log("ERROR   " + error)}
    finally{
        client.end()
    } 
}



async function createProductTable({id, price, created}) {
    const name = "product_" + id;
    const client = new Client(connection_data)
    try {
        await client.connect()
        await client.query(`
        CREATE SEQUENCE ${name}_sequence
            start 1
            increment 1;

        CREATE TABLE public."${name}" (
            id serial NOT NULL ,
            created text COLLATE pg_catalog."default",
            price text COLLATE pg_catalog."default",
            CONSTRAINT ${name}_pkey PRIMARY KEY (id)
        )
        WITH (OIDS = FALSE)
        TABLESPACE pg_default; 
        ALTER TABLE public."${name}"
            OWNER to "${connection_data.user}";
        
        INSERT INTO public."${name}" (
            id, 
            price, 
            created
        ) VALUES (
            nextval('${name}_sequence')::integer,
            '${price}'::text, 
            '${created}'::text
        );      
        `);
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}






async function enterProduct(product) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            INSERT INTO public.products (
                id,
                created,
                usr,
                img,
                price,
                title,
                url, 
                scraped,
                notification
            ) VALUES (
                nextval('products_sequence')::integer,
                'test'::text,
                ${product.usr} ::integer,
                'test'::text,
                'test'::text,
                'test'::text,
                'test'::text,
                 0 ::integer,
                 0 ::integer
            ) returning id;`)               // nextval('products_sequence')::integer,
            .then(res => {
                return res.rows[0].id
            })
            .catch (error => {
                console.log("error")  /////
            })
    } catch (error) {
        //console.log(error)
    }
    finally{
        client.end()
    } 
}

/*
INSERT INTO public.products (
                id, 
                created,
                usr,
                img,
                price,
                title,
                url, 
                scraped,
                notification
            ) VALUES (
                1::integer,
                '${product.created}'::text,
                ${product.usr} ::integer,
                '${product.img}'::text,
                '${product.price}'::text,
                '${product.title}'::text,
                '${product.url}'::text,
                 0 ::integer,
                 0 ::integer
            ) returning usr;`)

*/


async function createUsersTable() {
    const client = new Client(connection_data)
    try {
        await client.connect()
        await client.query(`
        CREATE SEQUENCE users_sequence
            start 1
            increment 1;

        CREATE TABLE public.users (
            id serial NOT NULL ,
            email text COLLATE pg_catalog."default",
            pw text COLLATE pg_catalog."default",
            registered integer,
            CONSTRAINT users_pkey PRIMARY KEY (id)
        )
        WITH (OIDS = FALSE)
        TABLESPACE pg_default; 
        ALTER TABLE public.users
            OWNER to "${connection_data.user}";     
        `);
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function enterUser(email, pw, code) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            INSERT INTO public.users (
                id, 
                email, 
                pw,
                registered
            ) VALUES (
                nextval('users_sequence')::integer,
                '${email}'::text,
                '${pw}'::text,
                '${code}'::integer 
            ) returning id;`)
            .then(res => {
                return res.rows[0].id
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function setNotificationValue(prodID, notification) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            SELECT * FROM public.products WHERE id=${prodID};
            `)
            .then(async res => {
                console.log(res.rows)
                if(res.rows.length == 1){
                    await client.query(`
                    UPDATE public.products SET notification = ${notification} WHERE id = ${prodID};
                    `)
                    .catch(err => {console.log("err")})
                }else {
                    console.log("err")
                } 
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function getAllProducts(userID) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            SELECT * FROM public.products WHERE scraped=0;
            `)
            .then(async res => {
            //    console.log(res.rows)
                if(res.rows.length == 1){
                    // semd and set ALL to 0
                    await client.query(`
                    UPDATE public.products SET scraped = 0;
                    `)
                    .catch(err => {console.log("err")})
                    return res.rows[0]
                }else {
                    // send and set to 1
                    await client.query(`
                    UPDATE public.products SET scraped = 1 WHERE id = ${res.rows[0].id};
                    `)
                    .catch(err => {console.log("err")})
                    return res.rows[0]
                } 
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function getAllByUserID(userID) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            SELECT id, created, usr, img, price, title, url, notification FROM public.products
            WHERE usr=${userID};
            `)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function deleteProduct(prodID) {
    const client = new Client(connection_data)
    console.log("drop: " + prodID)
    try {
        await client.connect()
        return await client.query(`
            DELETE FROM public.products
            WHERE id=${prodID};

            DROP TABLE public.product_${prodID};
            `)
            .then(res => {
                return res
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 

}


async function deleteUser(userID) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            DELETE FROM public.users
            WHERE id=${userID};
            `)
            .then(async x => {
                return await client.query(`
                    SELECT id FROM public.products WHERE usr = ${userID};
                    
                `) 
            })
            .then(async res => {
                res.rows.forEach(async item => {
                    console.log("item.id: " + item.id)
                    await client.query(`
                        DROP TABLE public.product_${item.id};
                    `)
                })
            })
            .then(async y => {
                await client.query(`
                    DELETE FROM public.products WHERE usr=${userID};
                    `)
                return "OK"
            }) 
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function getProductTimeline(prodID) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            SELECT * FROM public.product_${prodID};
            `)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}
async function getProductInfo(prodID) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`
            SELECT img, price, title, notification FROM public.products WHERE id = ${prodID};
            `)
            .then(res => {
                return res.rows[0]
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function findUser(name) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`SELECT * FROM public.users WHERE email = '${name}';`)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}


async function confirmUser(code) {
    const client = new Client(connection_data)
    try {
        await client.connect()
        return await client.query(`UPDATE public.users SET registered = 0 WHERE registered = ${code};`)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
}

async function updateProduct({id, price}) {
    setTimeout(async function(){
        const client = new Client(connection_data)
        try {
            await client.connect()
            return await client.query(`UPDATE public.products SET price = ${price} WHERE id = ${id};`)
                .then(res => {
                    return res
                })
                .catch (error => console.log(error))
        } catch (error) {console.log(error) }
        finally{
            client.end()
        } 
    }, 2000);    
}










async function test(id, name) {


    const testConnect = {
        user: "ofbugdwpkfgivl",
        password: "cc6fe18e3014457b6b03884688458dcdc22199990d06b22924710e7213c1df82",
        host: "ec2-46-137-156-205.eu-west-1.compute.amazonaws.com",
        port: 5432,
        database: "d7u7v3ljdp6suo",
        omitNull: true
    }
    const client = new Client(testConnect)
        try {
            await client.connect()
            return await client.query(`
                INSERT INTO public.test (
                    id, 
                    test
                ) VALUES (
                    ${id}::integer, 
                    '${name}'::text
                );
                `)
                .then(res => {
                    return "sheesh"
                })
                .catch (error => console.log(error))
        } catch (error) {console.log(error)}
        finally{
            client.end()
        }

      
}


async function showTest() {
    const testConnect = {
        user: "ofbugdwpkfgivl",
        password: "cc6fe18e3014457b6b03884688458dcdc22199990d06b22924710e7213c1df82",
        host: "ec2-46-137-156-205.eu-west-1.compute.amazonaws.com",
        port: 5432,
        database: "d7u7v3ljdp6suo",
        omitNull: true
    }
    const client = new Client(process.env.DATABASE_URL)
    try {
        await client.connect()
        return await client.query(`
            SELECT * FROM public.test;`)
            .then(res => {
                return res.rows
            })
            .catch (error => console.log(error))
    } catch (error) {console.log(error)}
    finally{
        client.end()
    } 
    
}



//------

const sequelize = new Sequelize(
    connection_data.database, 
    connection_data.user, 
    connection_data.password, {
    host: connection_data.host,
    dialect: 'postgres',

    pool: {
        max: 100,
        min: 0,
        acquire: 90000,
        idle: 90000
      }
});


exports.connection_data = connection_data
exports.createALLProductsTable = createALLProductsTable
exports.createProductTable = createProductTable
exports.enterProduct = enterProduct
exports.createUsersTable = createUsersTable
exports.enterUser = enterUser
exports.getAllByUserID = getAllByUserID
exports.deleteProduct = deleteProduct
exports.getProductTimeline = getProductTimeline
exports.getProductInfo = getProductInfo
exports.findUser = findUser
exports.confirmUser = confirmUser
exports.updateProduct = updateProduct
exports.getAllProducts = getAllProducts
exports.setNotificationValue = setNotificationValue
exports.deleteUser = deleteUser


exports.test = test
exports.showTest = showTest


 exports.sequelize = sequelize



 