import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  hands: Array,
  money: Number,
});

const Player = mongoose.model("player", PlayerSchema);

export default Player;
