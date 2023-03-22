const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://gofood:gofood123@cluster0.ymtqrwm.mongodb.net/gofoodmern?retryWrites=true&w=majority'
// const mongoURI = "mongodb://gofood:gofood123@ac-iqct9bf-shard-00-00.ymtqrwm.mongodb.net:27017,ac-iqct9bf-shard-00-01.ymtqrwm.mongodb.net:27017,ac-iqct9bf-shard-00-02.ymtqrwm.mongodb.net:27017/?ssl=true&replicaSet=atlas-ds02y2-shard-0&authSource=admin&retryWrites=true&w=majority"
const mongoDB = async () => {
    // mongoose.set('strictQuery', false)
    await mongoose.connect(mongoURI, { useNewUrlParser: true }, async (err, result) => {
        if (err) console.log(err)
        else {
            console.log('Mongo connected')
            const fetched_data = await mongoose.connection.db.collection("food_items");
            fetched_data.find({}).toArray(async function (err, data) {
                const foodCategory = await mongoose.connection.db.collection("foodCategory");
                foodCategory.find({}).toArray(function (err, catData) {
                    if (err) console.log(err);
                    else {
                        global.food_items = data;
                        global.foodCategory = catData;
                    }
                })
                // if (err) console.log(err);
                // else {
                //     global.food_items = data;

                // }
            })
        }
    });
}

module.exports = mongoDB;