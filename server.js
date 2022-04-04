var express = require ('express');
var app = express()
var  cors = require("cors")
const MongoClient = require('mongodb').MongoClient;
let projectCollection;

//Database Connection
//const uri = "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@cluster0.dku11.mongodb.net/SIT725_2022_t1?retryWrites=true&w=majority"
//const uri = "mongodb+srv://"+process.env.MONGOATLAS_USERNAME+":"+process.env.MONGOATLAS_PASSWORD+"@cluster0.dku11.mongodb.net/SIT725_2022_t1?retryWrites=true&w=majority"
const uri = "mongodb+srv://akhila:akhila2011@cluster0.dku11.mongodb.net/SIT725_2022_t1?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true})

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors())

const createColllection = (collectionName) => {
    client.connect((err,db) => {
        projectCollection = client.db().collection(collectionName);
        if(!err) {
            console.log('MongoDB Connected')
        }
        else {
            console.log("DB Error: ", err);
            process.exit(1);
        }
    })
}
const insertProjects = (project,callback) => {
    projectCollection.insert(project,callback);
}

const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}
const cardList = [
    {
        title: "CSS course",
        image: "images/CSS.png",
        link: "CSS course",
        desciption: "Happy Learning!!"
    },
    {
        title: "JS course",
        image: "images/JS.jpg",
        link: "JS course",
        desciption: "Happy Learning!!"
    }
]




app.get('/api/projects',(req,res) => {
    getProjects((err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Success", data: result})
        }
    })
})

app.post('/api/projects',(req,res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    insertProjects(newProject,(err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Project Successfully added", data: result})
        }
    })
})



var port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("App running at http://localhost:"+port)
    createColllection("courses")
})