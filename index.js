const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta1app',
    password: "MYcupoftea@12#$"
  });

let getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
     
    ];
} 

// let q = "INSERT INTO user (id, username, email,password) VALUES ?";
// let data = [];
// for (let i=1; i<=100; i++) {
//     data.push(getRandomUser());
// } 



// try {
//     connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
// }) 
// } catch (err) {
//         console.log(err);
//     }
//HOME route
app.get('/', (req,res) => {
  let q = "select Count(*) from user";
  try {
  connection.query(q, (err, result) => {
    if (err) throw err;
    let count = result[0]['Count(*)']
    res.render("home.ejs", { count });
  });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }

});

//SHOW ROUTE
app.get("/users", (req,res) => {
  let q = "select * from user";
  try {
    connection.query(q, (err, users) => {
    if (err) throw err;
    
    res.render("show.ejs", {users});
    })
  } catch (err) {
    res.send("Some error in DB");
    console.log(err);
  }
});

// EDIT ROUTE
app.get("/users/:id/edit", (req,res) => {
  let { id } = req.params;
  let q = `select * from user where id='${id}'`;

  try{
    connection.query(q, (err,result) => {
      if (err) throw err;
      let user = result[0];
      // console.log(user);
      res.render("edit.ejs", {user});
  })
  } catch (err) {
     console.log(err);
     res.send("some error in database");
  }
});

// UPDATE ROUTE
app.patch("/users/:id", (req, res) => {
   let { id } = req.params;
   let {password: formPassword, username: newUser} = req.body;
   let q = `Select * from user where id='${id}'`;
   
   try {
     connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        console.log(user);
        console.log(req.body);
        // res.send("patch req working");
          if (user.password != formPassword) {
            res.send("Wrong password"); }
          else {
            let q2 = `Update user set username= '${newUser}' where id= '${id}'`;
            connection.query(q2, (err, result) => {
            res.redirect("/users");
            // res.send('success');
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.send("Some error in DB");
    }
});


// to get a form for a new user
app.get("/users/new", (req,res) => {
  res.render("new.ejs");
});

// ADD ROUTE
app.post("/users/new", (req, res) => {
  let data = [];
  let { id } = req.params;
  let { username, email, password } = req.body;
  let newId = uuidv4();
  let q = `Insert into user (id, username, email, password) values ("${newId}", "${username}", "${email}", "${password}")`;
  data.push(q);
  
  try {
    connection.query(q, [data], (err, result) => {
      if (err) throw err;
      res.redirect("/users");
    });
  } catch (err) {
    res.send("Some error in database");
  }
});

//DELETE Route
app.delete('/users/:id', (req,res) => {
  let { id } = req.params;

  let q = `Delete from user where id = "${id}"`;

  try {
     connection.query(q,  (err, result) => {
       if (err) throw err;
       res.redirect("/users");
       console.log(`user deleted`);
      
     })  

  } catch (err) {
     console.log(err);
     res.send("Some error in DB");
  }
});
  
app.listen(8080, () => {
    console.log("app is listening to port 8080")
});
