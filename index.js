const axios = require("axios");

axios.get('https://lm-models.s3.ir-thr-at1.arvanstorage.ir/cars.json')
.then((res) =>{
    console.log(res);
})
.catch((error) =>{
    console.log(error)
})