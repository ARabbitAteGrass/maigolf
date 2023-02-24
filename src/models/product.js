const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      default: "nopic.png",
      trim: true,
    },
    category: {
      type: String,
      default: "other",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    specs: {
      brand:{
        type: String,
        required: true,
        trim: true,
      },
      unit:{
        type: Number,
        default: null,
      },
      inset:{
        type: String,
        default: null,
      },
      // volume: {
      //   type: Number,
      //   default: null,
      // },
      // length: {
      //   type: Number,
      //   default: null,
      // },
      // angle: {
      //   type: Number,
      //   default: null,
      // },
      gender: {
        type: String,
        default: "unisex",
      },
      handedness: {
        type: String,
        default: "RH/LH",
      },
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shops",
      require: true,
    },
  },
  {
    collection: "products",
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

productSchema.virtual("price_vat").get(function () {
  return this.price * 1.07;
});

const product = mongoose.model("Product", productSchema);

module.exports = product;
