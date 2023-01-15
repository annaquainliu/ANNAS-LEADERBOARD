const mysql = require('mysql');

const connection = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"percabethstash",
    database : "annalb"
});

function connectToDatabase() {

	connection.connect(function(err) {
		if (err) {
		  	console.log("Error in the connection");
		  	console.log(err);
		}
		else {
			console.log(`Database Connected`);
		}
	});
	// connection.end();
}

function addPointsInDatabase(user, points) {

	if (user == "KlymeneArts") {
		return;
	}

	checkPoints(user).then( (result) => {
		/*the user exists in the database*/
		if (result.exists) {
			finalPoints = result.points + points;
			console.log("initial points after adding is", finalPoints);
			connection.query(`UPDATE annalb.leaderboard SET points=${finalPoints} WHERE person='${user}';`,
			(error, results, fields) => {
				if (error) {
					console.log(error);
				}
			});
		} /*user doesnt exist in the database*/
		else {
			console.log("inserting new row");
			connection.query(`INSERT INTO annalb.leaderboard VALUES ('${user}', ${points});`
			, (error, results, fields) => {
				if (error) {
					console.log(error);
				}
			});
		}
	});
	
}

function checkPoints(user) {

    let checkPointsVal = `SELECT points FROM annalb.leaderboard WHERE person='${user}';`;

    return new Promise((resolve, reject)=> {
        connection.query(checkPointsVal, function(error, results, fields) {
            var success = true;
            var inventoryPoints = 0;
    
            if (error) {
                console.log(error);
            }
    
            if (results.length == 1) {
                inventoryPoints = results[0].points;
            }
            else if (results.length == 0) {
                success = false;
            }

            return resolve({exists: success, points: inventoryPoints});

        });
    });
}

function giveAnnaPoints(user, recipient, pointsToAdd) {

	return new Promise((resolve, reject) => {
		if (user == "KlymeneArts") {
			addPointsInDatabase(recipient, pointsToAdd);
			resolve("success");
		}
		else {
			checkPoints(user).then((result) => {
				if (result.exists) {
					if (pointsToAdd > result.points) {
						resolve("not enough points");
					}
					else {
						var negatedPoints = pointsToAdd * -1;
						addPointsInDatabase(user, negatedPoints);
						addPointsInDatabase(recipient, pointsToAdd);
						resolve("success");
					}
				}
				else {
					resolve("user not exist");
				}
			});
		}
	});
}

function leaderboard() {

	return new Promise((resolve, reject) => {
		let getData = 'SELECT * FROM annalb.leaderboard ORDER BY points DESC';
		connection.query(getData, (error, results, fields) => {
			var lb = ``;
			if (error) {
				console.log(error);
				reject(error);
			}
			if (results.length == 0) {
				lb = "No one is on the leaderboard...yet.";
			}
			for (var i = 0; i < results.length; i++) {
				lb += `${i + 1}.) **${results[i].person}**: ${results[i].points} Anna Points `;
				if (i == 0) {
					lb += ":crown:";
				}
				lb += "\n";
			}
			resolve(lb);
		});

	});
}	

module.exports = { connectToDatabase, addPointsInDatabase, checkPoints, giveAnnaPoints, leaderboard};