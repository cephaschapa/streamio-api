const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { default: axios } = require("axios");

require('dotenv').config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Hello streamer"
    })
})

app.get("/get-token", (req, res) => {
  const API_KEY = process.env.VIDEOSDK_API_KEY;
  const SECRET_KEY = process.env.VIDEOSDK_SECRET_KEY;
  const options = { expiresIn: "10m", algorithm: "HS256" };
  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod", "ask_join"], // Trigger permission.
  };
  const token = jwt.sign(payload, SECRET_KEY, options);
  res.json({ token });
});

// create meeting

app.post('/create-meeting', async(req, res)=> {
    const JWT_TOKEN = req.body.token
    try {
        let options = {
            method: "POST",
            url: "https://api.videosdk.live/v1/meetings",
            headers: {
                authorization: `${JWT_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ region: "sg001", userMeetingId: "unicorn" }), // region: sg001 || uk001 || us001
            };
            
            const {data} = await axios.request(options);
            res.status(201).json({
                success: true,
                data: data
            })
            console.log(data, data)
            
    } catch (error) {
        console.log(error)
    }
})



app.listen(port, () => {
    console.log(`StreamIO Server listening at http://localhost:${port}`);
});