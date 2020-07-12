// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req,res){
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email

  var data = {
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);
  const url = 'https://us4.api.mailchimp.com/3.0/lists/59822c7639';

  const options={
    method:"POST",
    auth:"m10hit:dc385f49848a39ee2c26d8f48443052d-us4"
  };

  const request = https.request(url,options,function(response){
    response.on("data",function(data){
      sub_data = JSON.parse(data)
      if(response.statusCode !== 200){
        res.sendFile(__dirname+"/failure.html")
      }else{
        res.sendFile(__dirname+"/success.html")
      }
    });
  });

  request.write(jsonData);
  request.end();

  // var options = {
  //   url:'https://us4.api.mailchimp.com/3.0/lists/59822c7639',
  //   method:"POST",
  //   headers:{
  //     "Authorization": "mohit1 dc385f49848a39ee2c26d8f48443052d-us4"
  //   },
  //   body: jsonData
  // }
  //
  // request(options, function(error,response,body){
  //   if (error || response.statusCode !== 200){
  //     res.sendFile(__dirname + "/failure.html");
  //   }
  //   else if(response.statusCode === 200){
  //     res.sendFile(__dirname + "/success.html");
  //   }
  // })
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000 ,function(){
  console.log("Server is running on port 3000");
});

// API Key
// dc385f49848a39ee2c26d8f48443052d-us4

// List Id
// 59822c7639
