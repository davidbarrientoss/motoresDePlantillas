const { json, urlencoded } = require("express")
const express = require("express")
const fs = require("fs")

const app = express()

let PORT = 8080

let server=app.listen(PORT,()=>{
    console.log("listening")
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const pathToProducts="products.json"

app.post("/products", async (req,res)=>{
    if(fs.existsSync(pathToProducts)){
        try {
            let data = await fs.promises.readFile(pathToProducts, "utf-8");
            let parsedProducts = JSON.parse(data);

            let idd = parsedProducts[parsedProducts.length - 1].id;
            let product = req.body;
            product.id=idd+1;
            parsedProducts.push(product)
            await fs.promises.writeFile(pathToProducts, JSON.stringify(parsedProducts,null,2))
            console.log(parsedProducts)
            return {status : "success", message:"added 1 product"}
        }catch (error){throw error}
    }else{
        try{
            let product=req.body
            console.log(req.body)
            product.id=1;
            await fs.promises.writeFile(pathToProducts,JSON.stringify([product],null,2))
            return {status :"success", message:"the first product has been added"}
        }catch(error){throw error}
        }
})

app.set("views","./views")
app.set("view engine","ejs")

app.get("/",(req,res)=>{
    res.render("main")
})

app.get("/products",async(req,res)=>{
    if (fs.existsSync(pathToProducts)){    
    let productArray=JSON.parse(await fs.promises.readFile(pathToProducts,"utf-8"))
    res.render("products",{productArray:productArray})}

    res.render("products",{productArray:null})
})
