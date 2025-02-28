const mysql=require("mysql")
require("dotenv").config()
const connectDB=()=>{
    //create connection
const connect = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : process.env.MYSQL_PASSWORD
})
    //connection build
connect.connect((error)=>{
    if(error)return console.log("Error occured in MYSQL connecting")
    console.log("Connected to mysql");
})
   //database creation
const dbQuery=`CREATE DATABASE IF NOT EXISTS restaurant ${process.env.DATABASE}`
connect.query(dbQuery,(error)=>{
    if(error) return console.log("Error Occured in Creating Database:"+error)
    console.log(process.env.DATABASE + "Database Created Sucessfully");
})
   //select database
connect.changeUser({database:process.env.DATABASE},(error)=>{
    if(error) console.log("Error Occured in selecting database:"+ error);
    console.log( process.env.DATABASE+"Database selected");
})   
return connect   
}
module.exports=connectDB