const ComputeRating = async (user, arrayName, body, searchedProblem) => {
    
    const userItemArray = user[arrayName]
    var oldRating = userItemArray.find(problem => problem.id == body.id)
    const newRatedProblems = userItemArray.filter(problem => problem.id != body.id)
    var totalRating = searchedProblem.rating * searchedProblem.ratingsCount
    
    var oldRatingReset = false

    console.log(`TOTAL RATING: ${totalRating}`)

    if(oldRating){
        console.log(`oldRating: ${oldRating}`)
        searchedProblem.ratingsCount -= 1
        totalRating -= oldRating.rating
        oldRatingReset = (Math.abs(parseFloat(oldRating.rating)-parseFloat(body.action)) < 0.1)
    }

    if(!oldRatingReset)
    {
        searchedProblem.ratingsCount += 1
        totalRating += parseFloat(body.action)
        newRatedProblems.push({id: body.id, rating: body.action})
    }
            

    console.log("BODY", body)

    console.log(`FINAL TOTAL RATING: ${totalRating}`)
    console.log(`OLD RATING: ${searchedProblem.rating}`)

    searchedProblem.rating = parseFloat(totalRating / searchedProblem.ratingsCount)


    console.log(`NEW RATING: ${searchedProblem.rating}`)
    user[arrayName] = [...newRatedProblems]

    await user.save()
    await searchedProblem.save()
} 



module.exports = { ComputeRating }