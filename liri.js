require("dotenv").config();

// npm requirements 

var fs = require("fs");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");

// Variables to handle inputs

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var type = process.argv[2];
var title = process.argv[3];

// Switch case to handle the input type

switch (type) {
    case ("concert-this"): concertThis(); break;
    case ("movie-this"): movieThis(); break;
    case ("spotify-this-song"): spotifyThis(); break;
    case ("do-what-it-says"): doWhat(); break;

    default: console.log("Enter 'node liri.js' then" + "\r\n" + "\r\n" +
        "concert-this" + "\r\n" + "-or-" + "\r\n" +
        "movie-this" + "\r\n" + "-or-" + "\r\n" +
        "spotify-this-song" + "\r\n" + "\r\n" + "and the band, movie or song in quotations" + "\r\n" + "\r\n" +
        "or simply enter 'node liri.js do-what-it-says'"
    )
}


// If type = concert-this

function concertThis() {
    var queryURL = "https://rest.bandsintown.com/artists/" + title + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("Venue: " + response.data[i].venue.name);
                console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date: " + moment(response.data[i].datetime).format("DD/MM/YYYY"));
                console.log("---- ---- ---- ----");

                

                fs.writeFile("log.txt", title, function(err) {
                    if (err) throw err;
                    // console.log(title);
                  });

            }
        }
    );

}

// If type = movie-this

function movieThis() {

    // If no title entered

    if (title === undefined) {
        var queryUrl = "http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(
            function (response) {
                console.log("Title: " + response.data.Title)
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            })

    } else {

        var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(
            function (response) {
                console.log("Title: " + response.data.Title)
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            })
    }
}

// If type = spotify-this 

function spotifyThis() {

    if (title === undefined) {
        spotify
            .search({
                type: 'track',
                query: 'sign+ace+of+base'
            })
            .then(function (response) {

                console.log("Artist: " + response.tracks.items[0].artists[0].name);
                console.log("Song Title: " + response.tracks.items[0].name);
                console.log("Preview URL (if available): " + response.tracks.items[0].preview_url);
                console.log("Album: " + response.tracks.items[0].album.name);
                console.log("Length: " + response.tracks.items[0].duration_ms + " ms");

            })

            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });

    } else {
        spotify
            .search({
                type: 'track',
                query: title
            })
            .then(function (response) {

                console.log("Artist: " + response.tracks.items[0].artists[0].name);
                console.log("Song Title: " + response.tracks.items[0].name);
                console.log("Preview URL (if available): " + response.tracks.items[0].preview_url);
                console.log("Album: " + response.tracks.items[0].album.name);
                console.log("Length: " + response.tracks.items[0].duration_ms + " ms");

            })

            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });

    }
}

// If type = do-what-it-says

function doWhat() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        var array = data.split(",");
        title = array[1];

        spotifyThis();
    })
}

