// Create a in memory hostipal where you create 4 routes
// 1. Get- checks number of kidneys they have and their health status
// 2. Post- User can add new kidney
// 3. Put- User can replace the kidney and update the kidney status
// 4. Delete- User can remove the kidney

const express = require("express");
// const bodyParser = require("body-parser")

const app = express();
const port = 4000;

var users = [
  {
    name: "John",
    kidneys: [
      {
        status: "Healthy",
      },
      {
        status: "Not Healthy",
      },
    ],
  },
  {
    name: "Jane",
    kidneys: [
      {
        status: "Healthy",
      },
      {
        status: "Healthy",
      },
    ],
  },
  {
    name: "Jack",
    kidneys: [
      {
        status: "Not Healthy",
      },
      {
        status: "Not Healthy",
      },
    ],
  },
  {
    name: "Jill",
    kidneys: [
      {
        status: "Not Healthy",
      },
      {
        status: "Healthy",
      },
    ],
  },
];

app.use(express.json());

function KidneyStats(kidneystatus, status) {
  count = 0;
  kidneystatus.forEach((element) => {
    if (status == element.status) {
      count++;
    }
  });
  return count;
}

let userIndex = -1;

//query parameters

//added
app.get("/", (req, res) => {
  let userprompt = req.query.name;
  console.log(userprompt);

  
  if (userprompt === undefined) {
    res.send(
      `<br><br><b><div style="display: flex; justify-content: center; font-size: larger; color: #008080;">Welcome to this Hospital page<br><br>You can select an user</div></b>`
    );
  }
  const  nameStatusCheck = users.filter((user, index) => {
      if (userprompt === user.name) {
        userIndex = index;
        return true;
      }
      return false;
    });
  

  console.log(nameStatusCheck);

  if (nameStatusCheck.length === 1) {
    let numberOFKidney = nameStatusCheck[0].kidneys.length; //num of kidney
    let kidneystatus = nameStatusCheck[0].kidneys; //array of the kidney status

    let goodKidneys = KidneyStats(kidneystatus, "Healthy");
    let badKidneys = numberOFKidney - goodKidneys;

    let OverallStatus;
    if (goodKidneys > badKidneys) {
      OverallStatus = "Healthy";
    } else {
      OverallStatus = "Not Healthy";
    }

    res.send(
      `<br><br><b><div style="display: flex; justify-content: center; font-size: larger; color: #008080;">Welcome to this Hospital page ${userprompt}<br><br> Number of Kidneys: ${numberOFKidney}<br> Number of Good Kidneys = ${goodKidneys}<br> Number of Bad Kidneys = ${badKidneys}<br> Status of Kidneys = ${OverallStatus}</div></b>`
    );
  } else if (nameStatusCheck.length === 0) {
    res
      .status(411)
      .send(
        `<br><br><b><div style="display: flex; justify-content: center; font-size: larger; color: #008080;">This Hospital page doesn't have an user named ${userprompt}<br><br>You can select an user</div></b>`
      );
  } else {
    res.send(
      `<br><br><b><div style="display: flex; justify-content: center; font-size: larger; color: #008080;">Welcome to this Hospital page<br><br>You can select an user</div></b>`
    );
  }
});

//middleware
app.post("/", (req, res) => {
  if (userIndex > -1) {
    let addKidney = req.body.addStatus;
    users[userIndex].kidneys.push({
      status: addKidney,
    });

    res.json({ Updated_Stats: "Kidney_Added" });
  } else {
    res.status(411).json({
      NO_User_Selected: "Select an user to go along with these functions.",
    }); //get request is not given with queries
  }
});

app.put("/", (req, res) => {
  let badKidneys = 0;
  if (userIndex > -1) {
    users[userIndex].kidneys.forEach((element) => {
      if (element.status === "Not Healthy") {
        badKidneys++;
      }
    });
  }

  if (userIndex > -1 && badKidneys > 0) {
    users[userIndex].kidneys.forEach((element) => {
      if (element.status === "Not Healthy") {
        element.status = "Healthy";
      }
    });
    res.send(
      '<br><br><div style="display: flex; justify-content: center; font-size: larger; color: #008080;"><b>All the Bad kidneys are replaced with good ones</div></b>'
    );
  } else if (userIndex > -1 && badKidneys < 1) {
    res.send(
      '<br><br><div style="display: flex; justify-content: center; font-size: larger; color: #008080;"><b>There is no Bad Kidneys to replace<br><br>The patient\'s Kidneys are healthy</div></b>'
    );
  } else {
    res.status(411).json({
      NO_User_Selected: "Select an user to go along with these functions.",
    });
  }
});

app.delete("/", (req, res) => {
  if (userIndex > -1) {
    users[3].kidneys = users[3].kidneys.filter((element) => {
      return element.status != "Not Healthy";
    });
  } else {
    res.status(411).json({
      NO_User_Selected: "Select an user to go along with these functions.",
    });
  }
});

app.listen(port, () => {
  console.log("Connected to server at port 4000");
});
