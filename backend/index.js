const express = require('express')
const app = express()
const PORT = require('./helper');
var uniqid = require('uniqid');
var cors = require('cors')

app.use(cors());
app.use(express.json());


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://okselluser:admin@123@oksell-cluster0.dsstc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const SaveContactModel = mongoose.model('SaveContact', { name: String, nameId:{ type:String,unique:true} });

app.get('/', function (req, res) {
  res.send('Hello World')
});


app.get('/getname',function(req,res){
    SaveContactModel.find({}).exec((err,data)=>{
        console.log(data);
        res.status(200).send(data);
    });
});

app.post('/savename',(req,res)=>{
    //res.status(200).send(req.body.name);
    const saveContactModel = new SaveContactModel({
                                                    name: req.body.name ,
                                                    nameId:uniqid()
                                                });
    saveContactModel.save().then(() =>{
        res.status(200).send({msg:"Data Sent Succesfully"});
    });
});

app.post('/deletename',async (req,res)=>{
    try {
        console.log(req.body.nameId);
        const deleteName=  await SaveContactModel.findOneAndDelete({ nameId: req.body.nameId });
        if(deleteName){
            res.status(200).json({
                msg:"Name Deleted Successfully"
            });
        }else{
            res.status(401).json({
                msg:"Unable to Deleted Name"
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
    
    
});
 
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `);
})