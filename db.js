
const dataJson = 'userpoints.json';
const fs = require('fs');


function addPointsInDatabase(user, points) {

	if (user == "KlymeneArts") {
		return;
	}

	checkPoints(user).then( (result) => {
		var body = JSON.parse(fs.readFileSync(dataJson).toString());
		/*the user exists in the database*/
		if (result.exists) {
			finalPoints = result.points + points;
			body["leaderboard"].find(obj => obj.user == user).points = finalPoints;
			
		} /*user doesnt exist in the database*/
		else {
			let userObj = {"user": user, "points": points};
			body["leaderboard"].push(userObj);
		}
		fs.writeFileSync(dataJson, JSON.stringify(body));
	});
	
}

// returns a resolved promise with an object {exists: bool, points: int}, where exists is
// if the user exists
// returns a promise because i used to use a mysql db and now i use a json file
function checkPoints(user) {

    return new Promise((resolve, reject)=> {
		var body = JSON.parse(fs.readFileSync(dataJson).toString());
		let userobj = body["leaderboard"].find(obj => obj.user == user);
		if (userobj == null) {
			resolve({exists: false, points: 0});
		} else {
			resolve({exists: true, points: userobj.points});
		}
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
						resolve("You don't have enough Anna Points.");
					}
					else {
						var negatedPoints = pointsToAdd * -1;
						addPointsInDatabase(user, negatedPoints);
						addPointsInDatabase(recipient, pointsToAdd);
						resolve("success");
					}
				}
				else {
					resolve("You don't exist on the leaderboard yet!");
				}
			});
		}
	});
}

// returns resolved promise with the lb 
function leaderboard() {

	return new Promise((resolve, reject) => {
		var body = JSON.parse(fs.readFileSync(dataJson).toString());
		let results = body["leaderboard"].sort((a, b) => {
			if (a.points > b.points) {
				return -1;
			} else if (a.points < b.points) {
				return 1;
			} else {
				return 0;
			}
		});
		var lb = ``;
		if (results.length == 0) {
			lb = "No one is on the leaderboard...yet.";
		}
		for (var i = 0; i < results.length; i++) {
			lb += `${i + 1}.) **${results[i].user}**: ${results[i].points} Anna Points `;
			if (i == 0) {
				lb += ":crown:";
			}
			lb += "\n";
		}
		resolve(lb);
	});
}	


module.exports = {addPointsInDatabase, checkPoints, giveAnnaPoints, leaderboard};
