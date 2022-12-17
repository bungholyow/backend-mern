const express = require("express");
const app = express();
require("dotenv/config")

const cors = require("cors");
const { default: mongoose } = require("mongoose");

app.use(cors({ origin: true }));
app.use(express.json());

// app.get("/", (req, res) => {
//     return res.json("hello there.....")
// })

//user autentikasi rute
const userRoute = require("./routes/auth");
app.use("/api/users", userRoute);

// link Artis 
const artistsRoute = require("./routes/artists");
app.use("/api/artists/", artistsRoute);

//link  Album 
const albumRoute = require("./routes/albums");
app.use("/api/albums/", albumRoute);

//link  Lagu 
const songRoute = require("./routes/songs");
app.use("/api/songs/", songRoute);

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true });
mongoose.connection
    .once("open", () => console.log("Konek"))
    .on("error", (error) => {
        console.log(`Error : ${error}`);
    });

app.listen(process.env.PORT || 4000, () => console.log("tersambung ke port 4000"));



