import React from "react"

import { useNavigate } from "react-router-dom"
import ResultElement from "./ResultElement"


const ResultContainer = ({ results }) => {

    const resultsDictionary = {}

    for (var i = 0; i < results.length; i++) {
        const thisResult = results[i]
        const resultDate = new Date(Date.parse(thisResult.createdAt)).toLocaleDateString("RO-ro")
        resultsDictionary[resultDate] = resultsDictionary[resultDate] ? [...resultsDictionary[resultDate], thisResult] : [thisResult]
    }

    const resultDates = Object.keys(resultsDictionary)

    return (
        <div id="ide-results" className="resultsTable">

            {
                resultDates.map((date, t) => <div key={t} className="resultsDate">
                                                <p className="date">{date}</p>
                                                {
                                                    resultsDictionary[date].map((result, i) => <ResultElement key={i} id={i} {...result} />)
                                                }
                                            </div>)
            }


            
        </div>
    )
}

export default ResultContainer