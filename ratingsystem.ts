//this is the rating system for the application. We will calculate a user's rating everytime they complete a project.
//Parameters involved : 
//oldRating : the user's current rating
//score : the user's score in the project (out of 1)
//toughness : the difficulty tag of the project (1 for beginner, 2 for intermediate, 3 for advanced)
//The function returns the new rating of the user after the project is completed.

function getNewRating(oldRating: number, score: number, toughness: number): number {
    let p = 2000;
    if (toughness === 1) {
        p = 800;
    } else if (toughness === 2) {
        p = 1400;
    }

    const a = 2 * score - 1;
    const b = 1.0 / (1.0 + Math.pow(10, (p - oldRating) / 400.0));

    let k = 10;
    if (oldRating < 1200) {
        if (a - b >= 0) {
            k = 40;
        } else {
            k = 20;
        }
    } else if (oldRating < 1800) {
        k = 20;
    }

    let r = 1;
    if (a - b > 0 && oldRating - p > 200) {
        r = 0.5;
    }

    let newRating = (a - b) * 3.0 * k * r + oldRating;
    return newRating;
}

