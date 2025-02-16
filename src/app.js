require("dotenv").config(); // Load environment variables
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require('express-session');
const publicStaticPath = path.join(__dirname, "../public")
const temp_path = path.join(__dirname, "../views")

const app = express();

const nodemailer = require('nodemailer');

/* Load API key */
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY is missing in the .env file");
    process.exit(1); // Stop the server if API_KEY is not set
}

/* hasing functions */
const argon2 = require('argon2');

async function hashPassword(plainPassword) {
    try {
        const hash = await argon2.hash(plainPassword);
        return hash;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function verifyPassword(hashedPassword, plainPassword) {
    try {
        const match = await argon2.verify(hashedPassword, plainPassword);
        return match;
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
}

/* hasing functions */

/* managing the sessions */
const expressSession = session({
    secret: apiKey, // Use the API key as the secret
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge:12000000}
  });
  app.use(expressSession);
/* managing the sessions */

/* connecting database */

const mongoose = require("mongoose");
const { type } = require("os");

const uri = 'mongodb://localhost:27017/cbit_placement_cell';
mongoose.connect(uri).then(()=>{
    console.log("connection successful with database")
}).catch((error)=>{
    console.log(error);
});
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    name: String,
    mobile: Number,
    password: String
})
const userDetails = mongoose.model('all_Users', userSchema);
const jobPostingSchema = new Schema({
    companyName: { type: String, required: true },
    companyDomain: { type: String, required: true },
    availableVacancies: { type: Number, required: true },
    eligibility: { type: String, required: true },
    minimumQualifications: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobType: { type: String, required: true },
    role: { type: String, required: true },
    lastdate: {type: Date, required: true},
    status: {type:Boolean, required:true}
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

const contacts = new Schema({
    name: {type:String, required:true},
    email: {type: String, required:true},
    phone: {type:Number, required:true },
    message: {type:String, required:true}
})
const newcontact = mongoose.model('Messages', contacts);


const recruitedSchema = new Schema({
    companyName: { type: String, required: true },
    companyDomain: { type: String, required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true },
    jobType: { type: String, required: true },
    role: {type:String, required:true}
  });
  
  const Recruited = mongoose.model("Recruited", recruitedSchema);

/* connecting db ends */
app.set("view engine", "ejs");

app.set("views", temp_path);

app.use(express.static(publicStaticPath))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* code starts here */
/* code ends here */

function uname(){
    if(req.session.user.username){
        console.log("he")
        return req.session.user.username;
    } else{
        return "login"
    }
}


app.get("/", (req, res)=>{
    const username = req.session.user && req.session.user.username ? req.session.user.username : "LOGIN";
    
    
    res.render('home', {username: username});
})
app.get("/login", (req, res)=>{

    res.render('login');
})
app.get("/signin", (req, res)=>{
    res.render('signIn');
})
app.get('/for_rec',(req, res)=>{
    const username = req.session.user && req.session.user.username ? req.session.user.username : "LOGIN";

    res.render('for_rec', {username: username})
})
app.get("/contact_us", (req,res)=>{
    const username = req.session.user && req.session.user.username ? req.session.user.username : "LOGIN";

    res.render("contact_us", {username: username})
})
/* app.get("/placement_requrt", (req,res)=>{
    res.render("placement_requrt")
}) */
app.get("/oppurtunity_add", (req, res)=>{
    const username = req.session.user && req.session.user.username ? req.session.user.username : "LOGIN";
    res.render("oppurtunity_add", {username: username});
}); 
app.get("/recruited", async (req, res) => {
    const username = req.session.user && req.session.user.username ? req.session.user.username : "LOGIN";
    let stu = await Recruited.find({}, { _id: 0, __v: 0 });
    res.render("recruited", { students: stu, username:username });
  });

  app.get("/stats",async (req,res)=>{
    const username = req.session.user && req.session.user.username ? req.session.user.username : "LOGIN";
    let r = await Recruited.find({},{companyName:1,year:1,section:1,jobType:1,_id:0})

    res.render("stats.ejs",{rec:r, username:username});
  });

app.get("/add_rec",  (req, res)=>{
    res.render("add_rec");
})

/* app.get("/exp", (req,res)=>{
    res.render("exp")
})
*/


/* placement drive */

app.get("/placement_drive", async (req, res) => {
    const username = req.session.user && req.session.user.username ? req.session.user.username : "login";
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const updateResult = await JobPosting.updateMany(
            { lastdate: { $lt: today } },
            { $set: { status: false } }
        );
        const fo = await JobPosting.find();
        res.render("placement_drive", { companyList: fo, username:username });
    } catch (error) {
        console.error('Error finding object:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
/* placement drive */

/* sign in performing */

app.post('/signin', async (req, res)=>{
    const username = req.body.name;
    req.session.user = { username};
    const hashedPassword = await hashPassword(req.body.password);
    const userdets = new userDetails({
        email: req.body.mail,
        password: hashedPassword,
        name: req.body.name,
        mobile: Number(req.body.mobile),
        roll: Number(req.body.roll)
    })
    userdets.save().then(saving_obj=>{
        console.log("Object registered successfully");
    }).catch(e=>{
        console.log("error occured", e);
    })
    res.redirect("/");
})
/* sign in performing */


/* adding recruitment */
app.post('/adding_rec', (req, res) => {
    const { companyname, role, companydomain, section, year, jobtype } = req.body;

    const newRecruited = new Recruited({
        companyName: companyname,
        companyDomain: companydomain,
        role: role,
        section: section,
        year: year,
        jobType: jobtype
    });

    newRecruited.save()
        .then(savedRecruited => {
            console.log("Recruited data added successfully");
            res.redirect('/'); 
        })
        .catch(error => {
            console.log("Error occurred while adding recruited data:", error);
            res.status(500).send("Error occurred while adding recruited data");
        });
});
/* adding recruitment */


/* adding oppurtunity */

app.post('/add_oppr', (req, res)=>{

    const newJobPosting = new JobPosting({
        companyName: req.body.companyname,
        companyDomain: req.body.companydomain,
        availableVacancies: Number(req.body.availseats), 
        eligibility: req.body.eligibilty,
        minimumQualifications: req.body.quals,
        jobDescription: req.body.jobdesc,
        jobType: req.body.jobtype,
        lastdate: req.body.lastdate,
        role: req.body.role,
        status: true
    });

    
    newJobPosting.save()
        .then(savedJob => {
            console.log("Job posted successfully");
            res.redirect('/placement_drive'); 
        })
        .catch(error => {
            console.log("Error occurred while posting the job", error);
            res.status(500).send("Error occurred while posting the job"); 
        });

});


/* adding oppurtunity */


/* sending mail */
app.post('/contact',  async (req, res) => {
    
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'mrranger970@gmail.com',
            pass: 'erqc enlz jxzd flnb'
        }
    });
    const newmessage = new newcontact({
        name: name,
        email: email,
        phone: Number(phone),
        message: message
    })
    newmessage.save().then(saving_obj=>{
        console.log("Object registered successfully");
    }).catch(e=>{
        console.log("error occured", e);
    })

    const mailOptions = {
        from: 'mrranger970@gmail.com',
        to: 'mohammedshujathnawaz@gmail.com', 
        subject: 'New Message from Contact Form',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
    };

  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Error sending email' });
        } else {
            res.redirect("/")
        }
    });
});

/* sending mail */

/* apply for opportunity */
app.get("/placement_drive/:zz", async (req, res)=>{

    const jobid = req.params.zz;
    try {
        const foundObject = await JobPosting.findOne({ _id: jobid });

        res.render("oppt", {
            companyName: foundObject.companyName,
            companyDomain: foundObject.companyDomain,
            availableVacancies: foundObject.availableVacancies,
            eligibility: foundObject.eligibility,
            minimumQualifications: foundObject.minimumQualifications,
            jobDescription: foundObject.jobDescription,
            jobType: foundObject.jobType,
            lastdate: foundObject.lastdate,
            role: foundObject.role
        });
    } catch (error) {
        console.error('Error finding object:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
   
})
/* apply for opportunity */



/* log in performing */
app.post('/login', async (req, res) => {
    try {
        

        const plainPassword = req.body.password;
        
        const foundObject = await userDetails.findOne({ email: req.body.mail });

        if (foundObject) {
            const isPasswordMatch = await verifyPassword(foundObject.password, plainPassword);
            
            if (isPasswordMatch) {
                console.log('Object found');
                const username = foundObject.name;
                req.session.user = { username };
                res.redirect("/");
            } else {
                console.log('Authentication failed');
                res.render("login");
            }
        } else {
            console.log('User not found');
            res.render("login");
        }
    } catch (error) {
        console.error('Error finding object:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/* log in performing */

/* testing api */

/* testing api */


/* listening the port */
app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on port 3000  http://localhost:3000/");
  });
/* listening the port */