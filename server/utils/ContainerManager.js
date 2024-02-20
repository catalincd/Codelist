const { exec } = require("child_process");

const exec_async = (code) => {
    return new Promise((resolve) => {
        exec(code, (stdin, stdout, stderr) => {
            resolve({stdin, stdout, stderr})
        })
    });
}


const CreateImages = async (IMAGES) => {
    const SPECIFIC_IMAGES = IMAGES.map(image => `codelist_${image}`)

    const {stdin, stdout, stderr} = await exec_async("docker ps --format json")
    const allContainers = stdout.split('\n').filter(container => container != '').map(container => JSON.parse(container))

    console.log("Deleting old containers...")

    for(var i=0;i<allContainers.length;i++)
    {
        const container = allContainers[i]
        if(SPECIFIC_IMAGES.indexOf(container.Image) != -1)
        {
            await exec_async(`docker stop ${container.ID} && docker remove ${container.ID}`)
        }
    }

    console.log("Deleting old images...")
    
    for(var i=0;i<IMAGES.length;i++)
    {
        const image = IMAGES[i]
        const {stdout, stderr} = await exec_async(`docker image rm codelist_${image}`)
    }

    console.log("Creating new images...")

    for(var i=0;i<IMAGES.length;i++)
    {
        const image = IMAGES[i]
        const {stdout, stderr} = await exec_async(`docker build server/containers/${image} -t codelist_${image}`)
    }

    console.log("Creating new containers...")

    for(var i=0;i<IMAGES.length;i++)
    {
        const image = IMAGES[i]
        const {stdout, stderr} = await exec_async(`docker run -d --name codelist_${image}_1 codelist_${image} sleep infinity`)
    }

}

const AssignImages = async () => {
    const {stdin, stdout, stderr} = await exec_async("docker ps --format json")
    const allContainers = stdout.split('\n').filter(container => container != '').map(container => JSON.parse(container))

    var CONTAINERS = {}

    allContainers.forEach(container => {
        if(container.Image.slice(0, 9) == "codelist_")
        {
            CONTAINERS[container.Image.substring(9)] = container.ID
        }
    });

    return CONTAINERS
}



module.exports = {CreateImages, AssignImages}