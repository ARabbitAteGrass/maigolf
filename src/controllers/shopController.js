const { validationResult } = require("express-validator");

const Shop = require("../models/shop");
const Product = require("../models/product");
const User = require("../models/user");
const config = require("../config");
const { saveImageToDisk } = require("../utils");

exports.index = async (req, res, next) => {
  try {
    const shops = await Shop.find()
      .select("name photo description location")
      .sort({ _id: -1 });

    const shopWithPhotoDomain = shops.map((shop, index) => {
      return {
        id: shop._id,
        name: shop.name,
        description: shop.description,
        photo: `${config.DOMAIN}/images/${shop.photo}`,
        location: shop.location,
      };
    });

    res.status(200).json({
      data: shopWithPhotoDomain,
    });
  } catch (error) {
    next(error);
  }
};

exports.showShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).populate("products");

    if (!shop) {
      const error = new Error("ไม่พบร้านค้า");
      error.statusCode = 404;
      throw error;
    }

    shop.photo = `${config.DOMAIN}/images/${shop.photo}`;
    shop.product = shop.products.map((product, index) => {
      product.photo = `${config.DOMAIN}/images/${product.photo}`;
      return product;
    });

    res.status(200).json({
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

exports.insertShop = async (req, res, next) => {
  try {
    const { name, location, photo, description } = req.body;

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let shop = new Shop({
      name: name,
      location: location,
      description: description,
      // photo: photo && (await saveImageToDisk(photo)),
    });
    await shop.save();

    res.status(201).json({
      message: "เพิ่มข้อมูลเรียบร้อยแล้ว",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteShop = async (req, res, next) => {
  try {
    const { id } = req.params;

    const shop = await Shop.deleteOne({
      _id: id,
    });

    if (shop.deletedCount === 0) {
      const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบร้านค้า");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: "ลบข้อมูลเรียบร้อยแล้ว",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateShop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, location, photo } = req.body;

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const shop = await Shop.updateOne(
      { _id: id },
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(location && { location }),
        // ...(photo && { photo: await saveImageToDisk(photo) }),
      }
    );

    if (shop.nModified === 0) {
      const error = new Error("ไม่สามารถแก้ไขข้อมูลได้ / ไม่พบบริษัท");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: "แก้ไขข้อมูลเรียบร้อยแล้ว",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.showProduct = async (req, res, next) => {
  try {
    const products = await Product.find().populate("shop");

    const productsWithPhotoDomain = products.map((product, index) => {
      product.shop &&
        (product.shop.photo = `${config.DOMAIN}/images/${product.shop.photo}`);
      return {
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        specs: product.specs,
        photo: `${config.DOMAIN}/images/${product.photo}`,
        shop: product.shop,
      };
    });

    res.status(200).json({
      data: productsWithPhotoDomain,
    });
  } catch (error) {
    next(error);
  }
};

exports.showProductId = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("shop");

    if (!product) {
      const error = new Error("ไม่พบร้านค้า");
      error.statusCode = 404;
      throw error;
    }

    product.photo = `${config.DOMAIN}/images/${product.photo}`;
    product.shop.photo = `${config.DOMAIN}/images/${product.shop.photo}`;

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.insertProduct = async (req, res, next) => {
  try {
    const { name, price, category, description, specs, photo, shopId } =
      req.body;

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    let product = new Product({
      name,
      price,
      category,
      description,
      specs,
      // photo: photo && (await saveImageToDisk(photo)),
      shop: shopId,
    });
    await product.save();

    res.status(201).json({
      message: "เพิ่มข้อมูลเรียบร้อยแล้ว",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.deleteOne({
      _id: id,
    });

    if (product.deletedCount === 0) {
      const error = new Error("ไม่สามารถลบข้อมูลได้ / ไม่พบร้านค้า");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: "ลบข้อมูลเรียบร้อยแล้ว",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, specs, photo /*, shop*/ } =
      req.body;

    // validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("ข้อมูลที่ได้รับมาไม่ถูกต้อง");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }

    const product = await Product.updateOne(
      { _id: id },
      {
        ...(name && { name }),
        ...(price && { price }),
        ...(category && { category }),
        ...(description && { description }),
        ...(specs && { specs }),
        // ...(photo && { photo: await saveImageToDisk(photo) }),
        // shop,
      }
    );

    if (product.nModified === 0) {
      const error = new Error("ไม่สามารถแก้ไขข้อมูลได้ / ไม่พบสินค้า");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: "แก้ไขข้อมูลเรียบร้อยแล้ว",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.followShop = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const shopId = req.params.id;
    console.log(userId, shopId);
    const shop = await Shop.findById(shopId);

    if (!shop) {
      const error = new Error("ไม่พบร้านค้า");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.updateOne(
      { _id: userId },
      {
        $addToSet: {
          following: shopId,
        },
      }
    );

    if (user.nModified === 0) {
      const error = new Error("ไม่สามารถแก้ไขข้อมูลได้ / ติดตามแล้ว");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: `ติดตาม ${shopId} เรียบร้อยแล้ว`,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.unfollowShop = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const shopId = req.params.id;
    console.log(userId, shopId);
    const shop = await Shop.findById(shopId);

    if (!shop) {
      const error = new Error("ไม่พบร้านค้า");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.updateOne(
      { _id: userId },
      {
        $pull: {
          following: shopId,
        },
      }
    );

    if (user.nModified === 0) {
      const error = new Error("ไม่สามารถแก้ไขข้อมูลได้ / ไม่ได้ติดตาม");
      error.statusCode = 400;
      throw error;
    } else {
      res.status(200).json({
        message: `เลิกติดตาม ${shopId} เรียบร้อยแล้ว`,
      });
    }
  } catch (error) {
    next(error);
  }
};
