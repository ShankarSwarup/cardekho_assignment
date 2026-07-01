import mongoose from 'mongoose';
import { UserModel } from '../models/User.js';

const run = async () => {
  const URI = "mongodb://shankargummala58_db_user:Shankar%402001@ac-d0gcfvl-shard-00-00.hlaulsq.mongodb.net:27017,ac-d0gcfvl-shard-00-01.hlaulsq.mongodb.net:27017,ac-d0gcfvl-shard-00-02.hlaulsq.mongodb.net:27017/cardekho?ssl=true&authSource=admin";
  try {
    console.log("Connecting using standard connection string...");
    await mongoose.connect(URI);
    console.log("Connected successfully!");
    const count = await UserModel.countDocuments({});
    console.log("Users count in DB:", count);
    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("Connection failed:", err);
  }
};
run();
