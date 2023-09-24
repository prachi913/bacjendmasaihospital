const express = require("express")
const cors = require("cors");
const { connection } = require("./Config/db");
const { userRouter } = require("./Routes/userRoute");
const { appointmentRouter } = require("./Routes/appointmentRoute");
require("dotenv").config()



const app = express();
app.use(express.json());
app.use(cors())



// app.get("/",(req,res)=>{
//      res.send("hi")
// })
// app.use(auth)
app.use("/users", userRouter)
app.use("/appointment", appointmentRouter)

app.listen(process.env.port, async () => {
     try {
         await connection
         console.log(`Server is running at port ${process.env.port}`);
         console.log("Connected to DB");
     } catch (error) {
         console.log(error.message);
     }
 })