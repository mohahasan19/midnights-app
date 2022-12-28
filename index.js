const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
dotenv.config();

const swal = require("sweetalert");
//var popupS = require('popups');
const app = express();
const port = process.env.PORT || "8080";

//const { default: SpotifyWebApi } = require('spotify-web-api-js');
var SpotifyWebApi = require('spotify-web-api-node');
var Spotify = require('spotify-web-api-js');
const { midnight_features } = require("./midnight_features.js");
const alert = require("alert");

var s = new Spotify();
let access_token;

var spotifyjs = new Spotify({
    
})

var spotifyApi = new SpotifyWebApi({
    clientId : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET
    //accessToken: 'BQB3CTwjo2MJP6KXsVwbiuRpKpJyixUMsQy8uYr_4m9MpuXRkMPscJGolpTtEu8VwxY4WL0CCzKH2hHCNl50Q4OrMx9wM19CAEdIAJ5KQts9Ob7cgt4'
});


spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token is ' + data.body['access_token']);
    spotifyApi.setAccessToken(data.body['access_token']);
    access_token = data.body['access_token'];
    console.log(access_token);
  }, function(err) {
    console.log('Something went wrong!', err);
});

//spotifyApi.setAccessToken(access_token);


//taylor swift id: 06HL4z0CvFAxyc27GXpf02

let midnights = {
    "Lavender Haze": "5jQI2r1RdgtuT8S3iG8zFC",
    "Maroon": "3eX0NZfLtGzoLUxPNvRfqm",
    "Anti-Hero": "0V3wPSX9ygBnCm8psDIegu",
    "Snow On The Beach (feat. Lana Del Rey)": "1wtOxkiel43cVs0Yux5Q4h",
    "You're On Your Own, Kid": "4D7BCuvgdJlYvlX5WlN54t",
    "Midnight Rain": "3rWDp9tBPQR9z6U5YyRSK4",
    "Question...?": "0heeNYlwOGuUSe7TgUD27B",
    "Vigilante Shit": "1xwAWUI6Dj0WGC3KiUPN0O",
    "Bejeweled": "3qoftcUZaUOncvIYjFSPdE",
    "Labyrinth": "0A1JLUlkZkp2EFrosoNQi0",
    "Karma": "7KokYm8cMIXCsGVmUvKtqf",
    "Sweet Nothing": "0wavGRldH0AWyu2zvTz8zb",
    "Mastermind": "7FmYn9e7KHMXcxqGSj9LjH"
};

const compareTrack = (score) => {
    let closest_id = null;
    let sum = 0;
    let lowest_difference;
    for (let i = 0; i<midnight_features.length; i++) {
        sum = midnight_features[i].acousticness+midnight_features[i].danceability+midnight_features[i].energy+midnight_features[i].instrumentalness+midnight_features[i].liveness+midnight_features[i].speechiness
        +midnight_features[i].tempo+midnight_features[i].valence+midnight_features[i].mode;
        if (i===0) {
            lowest_difference=Math.abs(score-sum);
            closest_id = midnight_features[i].id;
        } else {
            if (Math.abs(score-sum)<lowest_difference) {
                lowest_difference = Math.abs(score-sum);
                closest_id = midnight_features[i].id;
            }
        }
    }
    for (const property in midnights) {
  if (midnights[property]==closest_id) {
    alert("Closest song from midnights: "+property);
  }
  
}
}

const getTrackFeatures = (track_id) => {
    //let track_id = document.getElementById("track_id");
    spotifyApi.getAudioFeaturesForTrack(track_id, function(err, data) {
        if (err) {
            console.log(err)
        } else {
        let danceability = data.body.danceability;
        let energy = data.body.energy;
        let mode = data.body.mode;
        let speechiness = data.body.speechiness;
        let acousticness = data.body.acousticness;
        let instrumentalness = data.body.instrumentalness;
        let liveness = data.body.liveness;
        let valence = data.body.valence;
        let tempo = data.body.tempo;

        let final_score = danceability+energy+mode+speechiness+acousticness+instrumentalness+liveness+valence+tempo;
        compareTrack(final_score);
        }
    })
}
/*
spotifyApi.getAudioFeaturesForTracks(["7FmYn9e7KHMXcxqGSj9LjH", "0wavGRldH0AWyu2zvTz8zb", "7KokYm8cMIXCsGVmUvKtqf", "0A1JLUlkZkp2EFrosoNQi0", "3qoftcUZaUOncvIYjFSPdE", "1xwAWUI6Dj0WGC3KiUPN0O",
"5jQI2r1RdgtuT8S3iG8zFC", "3eX0NZfLtGzoLUxPNvRfqm", "0V3wPSX9ygBnCm8psDIegu", "1wtOxkiel43cVs0Yux5Q4h", "4D7BCuvgdJlYvlX5WlN54t", "3rWDp9tBPQR9z6U5YyRSK4", "0heeNYlwOGuUSe7TgUD27B",],
 function(err, data) {
    if (err) {
        console.log("iuhuh " +err);
    } else {
        
        for (let i=0; i < data.body.audio_features.length; i++) {
            //console.log(JSON.stringify(data.body.items[i]["id"]));
            //console.log(JSON.stringify(data.body.items[i]["name"]));
            midnight_features.push(data.body.audio_features[i]);
        }
        console.log(midnight_features);
    }
})

*/

//app.use(bodyParser.urlencoded({ extended: true }))
 app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post('/', (req, res) => {
    //res.send(req.body["track_id"]);
    getTrackFeatures(req.body["track_id"])
    //console.log(req);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})