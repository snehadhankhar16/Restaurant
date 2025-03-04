const connection=require('../Connection')()
require("dotenv").config()
const createCategoryTableQuery= `CREATE TABLE IF NOT EXISTS ${process.env.CATEGORYTABLE}(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES ${process.env.USER_TABLE} (id) ON DELETE CASCADE 
 )`
  //delete cascade-----user ko delete kerege to uski category automatic delete hojyge
connection.query(createCategoryTableQuery,(err)=>{
    if(err){
        console.error(`Error creating ${process.env.CATEGORY_TABLE} table: ${err}`);
    }
    else{
        console.log(`Table ${process.env.CATEGORY_TABLE} is ready`);
        
    }
})  
module.exports=connection