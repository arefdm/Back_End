const startTime = Date.now();
const axios = require("axios");
const fs = require("fs/promises");

async function getData(){
    try {
        const [carsData,averageData,convertedPrice] = await Promise.all([
           axios.get('https://lm-models.s3.ir-thr-at1.arvanstorage.ir/cars.json'),
           axios.get('https://lm-models.s3.ir-thr-at1.arvanstorage.ir/market_prices.json'),
           axios.get('https://baha24.com/api/v1/price') 
        ]);
        
        const cars = carsData.data;
        const averages = averageData.data;
        const convertPrice = convertedPrice.data;

        const addDataToCars = cars.map(car =>{
            let price_diff_from_average;
            let mileage_diff_from_average;
            const averagecar = averages.find(average => average.brand === car.brand && average.model === car.model && average.year === car.year);
            if(averagecar){
                price_diff_from_average = car.price - averagecar.average_price;
                mileage_diff_from_average = car.mileage - averagecar.average_mileage;
            }else{
                price_diff_from_average = 0;
                mileage_diff_from_average = 0;
            };
            const price_usd = car.price/convertPrice.USD.sell;

            return{
                ...car,
                price_diff_from_average,
                mileage_diff_from_average,
                price_usd
            };
        
        });

    fs.writeFile('cars_data.json',JSON.stringify(addDataToCars));

    } catch (error) {
        console.error(error);
    };

};

async function readFile(filePath){
    try {
        const data = await fs.readFile(filePath,{encoding: 'utf8'});
        return data;
    } catch (error) {
        console.log(error);
    }
};

function mostExist(data){
    const count = {};
    data.map((car) =>{
        if(count[`${car.brand} ${car.model}`]){
            count[`${car.brand} ${car.model}`] += 1;
        }else{
            count[`${car.brand} ${car.model}`] = 1;
        }
    });
    const countOfMostCar = Object.keys(count).reduce((max,car) =>{
        if(count[car]>max){
            return count[car];
        }else{
            return max;
        }
    },0);
    let result = [];
    for(let car in count){
        if(count[car] === countOfMostCar){
            result.push(car);
        }
    };
    return result;
};

function mostExpesive(data){
    const sortedByPrice = data.sort((a,b) =>{
        return b.price - a.price;
    });
    let result = [];
    for (let i = 0; i < 3; i++) {
        result.push(sortedByPrice[i])
        
    };
    return result;
}

function diffMostMinExpensive(data){
    const sortedByPrice = data.sort((a,b) =>{
        return b.price_usd - a.price_usd;
    });
    const diffMostMinPrice= sortedByPrice[0].price - sortedByPrice[sortedByPrice.length-1].price;
    return diffMostMinPrice; 
};

function color(data){
    const countColor = {};
    data.map((car) =>{
        if(countColor[car.color]){
            countColor[car.color] += 1;
        }else{
            countColor[car.color] = 1;
        }
    });
    return countColor;
};

function lowestPrice(data){
    const sortedBy = data.sort((a,b) =>{
        return a.price - b.price;
    });
    let lowestCar = {};
    sortedBy.map((car) =>{
        if(!lowestCar[`${car.brand} ${car.model}`]){
            lowestCar[`${car.brand} ${car.model}`] = car.price;
        }
    });
    return lowestCar;

};

function lowestMileage(data){
    const sortedBy = data.sort((a,b) =>{
        return a.mileage - b.mileage;
    });
    let lowestCar = {};
    sortedBy.map((car) =>{
        if(!lowestCar[`${car.brand} ${car.model}`]){
            lowestCar[`${car.brand} ${car.model}`] = car.mileage;
        }
    });

    return lowestCar;

};

function mostFirePrice(data){
    const absoluteDiff = data.map((car) =>{
        car.price_diff_from_average = Math.abs(car.price_diff_from_average);
        return car;
    });
    const sortedBy = absoluteDiff.sort((a,b) =>{
        return a.price_diff_from_average - b.price_diff_from_average;
    });

    let result = [];
    for (let i = 0; i < 5; i++) {
        result.push(sortedBy[i])
        
    };

    return result;
};

function mostFireMileage(data){
    const absoluteDiff = data.map((car) =>{
        car.mileage_diff_from_average = Math.abs(car.mileage_diff_from_average);
        return car;
    });
    const sortedBy = absoluteDiff.sort((a,b) =>{
        return a.mileage_diff_from_average - b.mileage_diff_from_average;
    });

    let result = [];
    for (let i = 0; i < 5; i++) {
        result.push(sortedBy[i])
        
    };

    return result;
};



getData()
.then(() =>{
    readFile('D:\cars_data.json')
.then((data) =>{
    const arrayData = JSON.parse(data);
    console.log('Q1 ===========================>\n',mostExist(arrayData));
    console.log('Q2 ===========================>\n',mostExpesive(arrayData));
    console.log('Q3 ===========================>\n',diffMostMinExpensive(arrayData));
    console.log('Q4 ===========================>\n',color(arrayData));
    console.log('Q5 ===========================>\nlowest price',lowestPrice(arrayData),'\nlowest mileage',lowestMileage(arrayData));
    console.log('Q6 ===========================>\n',mostFirePrice(arrayData));
    console.log('Q7 ===========================>\n',mostFireMileage(arrayData));
    const endTime = Date.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`Execution completed in ${executionTime} seconds.`);
}).catch((error) => {
    console.error(error);
});
})
.catch((error) =>{
    console.error(error);
});



