require("dotenv").config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);
var fs = require('fs');

var userInput = process.argv;
var command = process.argv[2];

var inputString = "";

for (var i = 3; i < userInput.length; i++) {
    if (i > 3 && i < userInput.length) {
        inputString = inputString + "+" + userInput[i];
    } else {
        inputString = inputString + userInput[i];
    }
}


switch (command) {
    case "my-tweets":
        Twitter();
        break;

    case "spotify-this-song":
        if (userInput) {
            Spotify(userInput);
        } else {
            Spotify("Dig a Pony");
        }
        break;

    case "movie-this":
        if (inputString) {
            omdbData(inputString)
        } else {
            omdbData("Mr. Nobody")
        }
        break;

    case "do-what-it-says":
        whatItSays();
        break;

    default:
        console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
        break;
}

function Twitter() {

    var userName = { screen_name: 'postconsumed', count:20 };

    client.get('statuses/user_timeline', userName, function(error, tweets, response) {

        if (!error) {

            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@postconsumed: " + tweets[i].text + " Date posted: " + tweets[i].created_at);
                console.log("----");

                //adds text to log.txt file
                fs.appendFile('log.txt', "@postconsumed: " + tweets[i].text + " Date posted: " + tweets[i].created_at);
                fs.appendFile('log.txt', "----");
            }
        }
        else {
            console.log(error);
        }
    })
}

        function Spotify(song) {
            spotify.search({ type: 'track', query: song }, function (error, data) {
                if (!error) {
                    for (var i = 0; i < data.tracks.items.length; i++) {
                        var songData = data.tracks.items[i];
                        //artist
                        console.log("Artist: " + songData.artists[0].name);
                        //song name
                        console.log("Song: " + songData.name);
                        //spotify preview
                        console.log("Preview URL: " + songData.preview_url);
                        //album
                        console.log("Album: " + songData.album.name);
                        console.log("-----------------------");

                        //log
                        fs.appendFile('log.txt', songData.artists[0].name);
                        fs.appendFile('log.txt', songData.name);
                        fs.appendFile('log.txt', songData.preview_url);
                        fs.appendFile('log.txt', songData.album.name);
                        fs.appendFile('log.txt', "-----------------------");
                    }
                } else {
                    console.log('ERROR! SOMETHING IS WRONG!');
                }
            });
        }

        function omdbData(inputString) {
            var omdbURL = 'http://www.omdbapi.com/?apikey=trilogy&t?=' + inputString + '&plot=short&tomatoes=true';

            request(omdbURL, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var body = JSON.parse(body);

                    console.log("Title: " + body.Title);
                    console.log("Release Year: " + body.Year);
                    console.log("IMdB Rating: " + body.imdbRating);
                    console.log("Country: " + body.Country);
                    console.log("Language: " + body.Language);
                    console.log("Plot: " + body.Plot);
                    console.log("Actors: " + body.Actors);
                    console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                    console.log("Rotten Tomatoes URL: " + body.tomatoURL);

                    //log
                    fs.appendFile('log.txt', "Title: " + body.Title);
                    fs.appendFile('log.txt', "Release Year: " + body.Year);
                    fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
                    fs.appendFile('log.txt', "Country: " + body.Country);
                    fs.appendFile('log.txt', "Language: " + body.Language);
                    fs.appendFile('log.txt', "Plot: " + body.Plot);
                    fs.appendFile('log.txt', "Actors: " + body.Actors);
                    fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
                    fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);

                }

                else {
                    console.log('ERROR! SOMETHING IS WRONG!')
                }

                if (inputString === "Mr. Nobody") {
                    console.log("-----------------------");
                    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                    console.log("It's on Netflix!");

                    //log
                    fs.appendFile('log.txt', "-----------------------");
                    fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                    fs.appendFile('log.txt', "It's on Netflix!");
                }
            });

        }

        function whatItSays() {
            fs.readFile('random.txt', "utf8", function (error, data) {

                if (error) {
                    return console.log(error);
                }

                var dataArray = data.split(",");

                if (dataArray[0] === "spotify-this-song") {
                    var songcheck = dataArray[1].slice(1, -1);
                    Spotify(songcheck);
                } else if (dataArray[0] === "my-tweets") {
                    var tweetname = dataArray[1].slice(1, -1);
                    Twitter(tweetname);
                } else if (dataArray[0] === "movie-this") {
                    var movie_name = dataArray[1].slice(1, -1);
                    omdbData(movie_name);
                }

            });

        }