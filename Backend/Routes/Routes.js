
const express = require("express")
const multer =require("multer")
const jwt = require("jsonwebtoken")
const fs=require("fs") //to create folder/directory ...no need to install

const { handleResponse, handleError } = require("../Responses/Responses")
const { generateotp, verifyotp } = require("../Services/OtpService/OTPService")
const { otptoemailforverification } = require("../Services/EmailService/EmailService")
const { checkUserDetails } = require("../Middlewares/CheckUserDetails")
const Users = require("../Tables/UserTable")
const Category = require("../Tables/CategoryTable")
const Menu =require("../Tables/MenuTable")

const Routes = express.Router()
require("dotenv").config()

const storage = multer.diskStorage({  //this create a folder 
    destination: (req, file, cb) => {   //cb =>callback fnc
        // console.log(file);
        fs.mkdir("./uploads/",{recursive:true},(err)=>{  //fs make dictorary /folder.....recursive ..if foldr h to existing ko choose krega or usme kam krnge nhi to create new
            if(err) return cb(err,null)
            else cb(null, 'uploads/');
        })
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload=multer({storage:storage})
const deleteImage=(path)=>{
    fs.unlink(path,(error)=>{
        console.log("Error Occured in deleting the image:"+error);        
    })
}

Routes.get("/", (req, resp) => handleResponse(resp, 200, "Server Health is Okay!"))

Routes.post("/verifyUser", async (req, resp) => {
    const { name, phone, email, password } = req.body
    if (!name || !phone || !email || !password) return handleResponse(resp, 404, "All fields are required")

    const dbQuery = `Select * from ${process.env.USER_TABLE} where email='${email}'`  //find with email
    Users.query(dbQuery, async (error, results) => { //ek se jdya obj aa skte h to ARRAY OF OBJ aayga
        if (error) return handleError(resp, error)
        if (results.length !== 0) return handleResponse(resp, 404, "Account related to this email is already exists")
        const otp = generateotp(email)
        return await otptoemailforverification(resp, email, otp)
    })
})

Routes.post("/createUser", async (req, resp) => {
    const { name, phone, email, password, otp } = req.body
    if (!name || !phone || !email || !password) return handleResponse(resp, 404, "All fields are required")

    const dbQuery = `Select * from ${process.env.USER_TABLE} where email='${email}'`  //find with email
    Users.query(dbQuery, async (error, results) => {
        if (error) return handleError(resp, error)
        if (results.length !== 0) return handleResponse(resp, 404, "Account related to this email is already exists")
        if (!otp) return handleResponse(resp, 404, "Enter the otp")
        const result = verifyotp(email, otp)
        if (!result.status) return handleResponse(resp, 401, result.message)

        const Query = `INSERT INTO \`${process.env.USER_TABLE}\` (\`name\`, \`phone\`, \`email\`, \`password\`, \`role\`) VALUES (?, ?, ?, ?, 'owner');`;   //? m variable ki value aaygi
        Users.query(Query, [name, phone, email, password], (error, result) => {
            if (error) return handleError(resp, error)
            return handleResponse(resp, 201, "Account Created Successfully", result)
        })
    })
})

Routes.post("/login", (req, resp) => {
    const { email, password } = req.body
    if (!email || !password) return handleResponse(resp, 404, "All fields are required")

    const dbQuery = `Select * from ${process.env.USER_TABLE} where email='${email}'`
    Users.query(dbQuery, (error, results) => {  //results m array aata h 
        if (error) return handleError(resp, error)
        if (results.length === 0) return handleResponse(resp, 401, "Invalid Email")
        if (results[0].password !== password) return handleResponse(resp, 401, "Invalid Password")
        const payload = {
            id: results[0].id
        }
        const token = jwt.sign(payload, process.env.JWT_KEY)
        return handleResponse(resp, 202, "Login Successfully", { token, role: results[0].role })
    })
})


Routes.post('/createCategory', checkUserDetails, (req, resp) => {
    const { name } = req.body;

    if (!name) return handleResponse(resp, 404, "Category name is required")

    // Check if category exists
    const checkQuery = `SELECT id FROM ${process.env.CATEGORY_TABLE} WHERE name = '${name}' and user_id='${req.user.id}'`;
    Category.query(checkQuery, (error, results) => {
        if (error) return handleError(resp, error)

        if (results.length !== 0) {
            return handleResponse(resp, 400, "This Category already exists.")
        }

        // Insert if not exists
        const insertQuery = `INSERT INTO ${process.env.CATEGORY_TABLE} (name,user_id) VALUES (?,?)`;
        Category.query(insertQuery, [name, req.user.id], (error, result) => {
            if (error) return handleError(resp, error)

            return handleResponse(resp, 201, "Category Created Successfully", result)
        });
    });
});

Routes.get('/getAllCategories', checkUserDetails, (req, resp) => {
    const Query = `SELECT * FROM ${process.env.CATEGORY_TABLE} where user_id=? ` ;

    Category.query(Query, [req.user.id], (error, results) => {
        if (error) return handleError(resp, error)
        return handleResponse(resp, 202, "Categories fetched successfully", results)
    });
});

Routes.post("/addMenus",checkUserDetails,upload.single("image"),(req,resp)=>{ //upload.none() 
    const { itemname, price, category,description} = req.body;   //item ki image save krani hogi to usko test krne ke lie body ke andr form-data lenge raw nhi
     
    if (!itemname || !price || !category)  {
            if(req.file) deleteImage("./uploads/"+req.file.filename) 
            return handleResponse(resp,404,"All fields are require")
        }

    if(!req.file) return handleResponse(resp,404,"Plz upload the image")
     
     const categoryQuery=`Select id from ${process.env.CATEGORY_TABLE} where name='${category}' and user_id='${req.user.id}'`  //category ki id search krne ke lie
     Category.query(categoryQuery,(error,results)=>{
        if(error){
            deleteImage("./uploads/"+req.file.filename)
            return handleError(resp,error)
        } 
        if(results.length===0) {
            deleteImage("./uploads/"+req.file.filename)
            return handleResponse(resp,404,"This category not exists in your category list")
        }
        
        const category_id=results[0].id
 
         const insertQuery=`INSERT INTO ${process.env.MENU_TABLE} (itemname, price, category_id, description, image, user_id) VALUES (?, ?, ?, ?, ? , ?)`
         Menu.query(insertQuery,[itemname,price,category_id,description,"./uploads/"+req.file.filename , req.user.id],(error,result)=>{
            if(error) {
                deleteImage("./uploads/"+req.file.filename)
                return handleError(resp,error)
            }
            return handleResponse(resp,201,"Menu created Successfully",result)
         })  
     })
 })

 Routes.get('/getAllItems',checkUserDetails,(req, resp) => {
    const query=`SELECT menu_items.id, menu_items.itemname, menu_items.image, menu_items.price, menu_items.description, menu_items.category_id,categories.name AS category_name FROM menu_items JOIN categories ON menu_items.category_id = categories.id where menu_items.user_id='${req.user.id}' ORDER BY menu_items.id ASC`
   
    Menu.query(query, (error, results) => {
        if (error) return handleError(resp,error);
        if(results.length===0) return handleResponse(resp,400,"Table is empty")
        return handleResponse(resp,202,"Fetched successfully",results)
    });
});

Routes.get('/getAllItem/:category',checkUserDetails,(req, resp) => {
    const {category}=req.params
    if(!category) return handleResponse(resp,404,"Category is required")
    
    const CategoryQuery=`Select id from ${process.env.CATEGORY_TABLE} where name=? and user_id=?`
    Category.query(CategoryQuery,[category,req.user.id],(error,results)=>{
        if (error) return handleError(resp,error)
        if(results.length===0) return handleResponse(resp,400,"Category is not found")
        
        const category_id=results[0].id

        const query=`SELECT menu_items.id, menu_items.itemname, menu_items.image, menu_items.price, menu_items.description, menu_items.category_id, categories.name AS category_name FROM menu_items JOIN categories ON menu_items.category_id = categories.id where menu_items.user_id='${req.user.id}' and menu_items.category_id='${category_id}' ORDER BY menu_items.id ASC`
        Menu.query(query, (error, responses) => {
            if (error) return handleError(resp,error);
            
            if(responses.length===0) return handleResponse(resp,400,"Table is empty")
            return handleResponse(resp,202,"Fetched successfully",responses)
        });
    })
});



module.exports = Routes    
