const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: "nopic.png",
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    location: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },
  },
  {
    collection: "shops",
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

shopSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "shop",
});

const shop = mongoose.model("Shops", shopSchema);

module.exports = shop;
