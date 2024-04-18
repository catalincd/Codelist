import React from "react"

const Example = ({stdin, stdout, inputName, inputValue, outputName, outputValue}) => {
    return (
        <div className="ide-example">
            <div className="ide-example-tab ide-example-input">
                <h5>{stdin? "STDIN" : inputName}</h5>
                <p>{inputValue}</p>
            </div>
            <div className="ide-example-tab  ide-example-output">
                <h5>{stdout? "STDOUT" : outputName}</h5>
                <p>{outputValue}</p>
            </div>
        </div>
    )
}

export default Example