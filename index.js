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
                price_diff_from_average = car.price;
                mileage_diff_from_average = car.mileage;
            };
            const price_usd = car.price/convertPrice.USD.sell;

            return{
                ...car,
                price_diff_from_average,
                mileage_diff_from_average,
                price_usd
            };

        })
     fs.writeFile('cars_data.json',JSON.stringify(addDataToCars));

    } catch (error) {
        console.error(error);
    };
};

getData();