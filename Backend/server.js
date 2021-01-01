var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose"); // mongoose for intergrating MongoDB database

// Modals used to shape data going into MongoDB - required by Mongoose, the ODM being used
const Trip = require("./models/trip");
const Receipt = require("./models/receipt");
var app = express();

app.use(cors()); // required to access resources from remote hosts. Frontend and backend are seperate in the app so necessary
app.options("*", cors()); // cors pre-flight to enable cors policy on 'complex' request such as delete requests

app.use(bodyParser.json({ limit: "50mb" })); // required to allow for long base64 image strings
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: "100000",
    extended: true,
  })
);

// DB SETUP
mongoose.set("useUnifiedTopology", true);

let url = process.env.DATABASEURL; // database URL saved into enviornmental variable, stored on Heroku

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to DB!");
    // Lets me know Database is conencted correcly, and authentication was successful on Atlas Mongo Cloud
  })
  .catch((err) => {
    console.log("Error: ", err.message);
  });

mongoose.set("useFindAndModify", false);

app.get("/", function (req, res) {
  res.send("Expenses Tracker API");
});

// GET Initial trips route
app.get("/trips", async (req, res) => {
  try {
    const foundTrips = await Trip.find({ user: req.query.user }).exec();
    // console.log(foundTrips);
    res.send(foundTrips);
    console.log("trips sent to app!");
  } catch (err) {
    console.log(err);
  }
});

// ADD a new trip route
app.post("/trips", async (req, res) => {
  Trip.find({ tripId: req.body.tripId }, async function (err, res) {
    if (res.length === 0) {
      console.log("no trip found, add one!");
      try {
        const newTrip = await Trip.create({
          // create the new trip
          user: req.body.user,
          location: req.body.location,
          description: req.body.description,
          dateFrom: req.body.dateFrom,
          dateTo: req.body.dateTo,
          tripId: req.body.tripId,
          amount: req.body.price,
        });
        newTrip.save(); // save the newTrip into the database
        console.log("trip created");
      } catch (err) {
        console.log(err);
        return;
      }
    } else {
      console.log("Id already exsists");
    }
  });
  console.log("success");
  res.send({ success: "New trip created" });
});

// EDIT a trip route
app.put("/trips", async (req, res) => {
  console.log(new Date(req.body.dateTo).toISOString());
  await Trip.findOneAndUpdate(
    { tripId: req.body.tripId },
    {
      location: req.body.location,
      description: req.body.description,
      dateFrom: new Date(req.body.dateFrom), //convert to date
      dateTo: new Date(req.body.dateTo),
      amount: req.body.amount,
    },
    function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("trip editted");
        res.send(doc); // if no error we return a response to front end
      }
    }
  );
});

app.delete("/trips", async (req, res) => {
  try {
    console.log(req.query.tripId);
    const deletedTrip = await Trip.findOneAndDelete(
      { tripId: req.query.tripId },
      function (err, trip) {
        if (trip) {
          console.log("trip deleted");
        }
      }
    );
    const deletedReceipts = await Receipt.deleteMany(
      { tripId: req.query.tripId },
      function (err, receipts) {
        if (receipts) {
          console.log("Deleted Receipts: ", receipts.deletedCount);
        }
      }
    );
    res.send(deletedTrip);
  } catch (err) {
    console.log(err);
  }
});

// GET initial receipts route
app.get("/receipts", async (req, res) => {
  try {
    const foundReceipts = await Receipt.find({ user: req.query.user }).exec();
    res.send(foundReceipts);
    console.log("initial receipts fetched");
  } catch (err) {
    console.log(err);
  }
});

// ADD new receipt route
app.post("/receipts", async (req, res) => {
  console.log(req.body.timestamp);

  Receipt.find({ timestamp: req.body.timestamp }, async function (err, res) {
    if (res.length === 0) {
      console.log("no receipt found, add one!");
      try {
        const newReceipt = await Receipt.create({
          // create the new trip
          user: req.body.user,
          tripId: req.body.tripId,
          image: req.body.image,
          price: req.body.price,
          timestamp: req.body.timestamp,
        });
        newReceipt.save(); // save the newTrip into the database
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Id already exsists");
      return;
    }
  });
  console.log("receipt created");
  res.send({ success: "New Receipt created" });
});

// EDIT route for receipts
app.put("/receipts", async (req, res) => {
  await Receipt.findOneAndUpdate(
    { timestamp: req.body.timestamp },
    {
      price: req.body.price,
    },
    function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log("receipt editted");
        res.send({ success: "Receipt Editted" }); // if no error we return a response to front end
      }
    }
  );
});

// Delete Receipt
app.delete("/receipts", async (req, res) => {
  try {
    const deletedReceipt = await Receipt.findOneAndDelete(
      { timestamp: req.query.timestamp },
      function (err, receipt) {
        if (receipt) {
          console.log("Deleted Receipt");
          console.log(receipt);
        }
        if (err) {
          console.log(err);
        }
      }
    );
    res.send({ success: "Receipt Deleted" }); // if no error we return a response to front end
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server has started`);
});
