// diff between nodejs and browser 
// Ans . Browser - global object = window 
// we do not have file system access
// browser have web apis {dom} 
// node js - global object =global
// can not perform dom
//  writing drone interface  , terminla create , native , servers we can made and a lot more.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js"
// Load environment variables from `.env` file
dotenv.config({});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
// api's

app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);

app.listen(PORT, () => {
    connectDB(); 
    console.log(`Server running at port ${PORT}`);
});
