const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const shopController = require("../controllers/shopController");
const passportJWT = require("../middleware/passportJWT");
const checkAdmin = require("../middleware/checkAdmin");

/* GET shop listing. */
router.get("/", shopController.index);
router.get("/product", shopController.showProduct);
router.get("/:id", shopController.showShop);
router.get("/product/:id", shopController.showProductId);

router.post(
  "/",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage("กรุณาป้อนชื่อร้านค้าด้วย")
      .isString()
      .withMessage("ชื่อร้านค้าไม่ถูกต้อง"),
    body("location.lat")
      .not()
      .isEmpty()
      .withMessage("กรุณาป้อนละติจูดด้วย")
      .isNumeric()
      .withMessage("ละติจูดต้องเป็นตัวเลขเท่านั้น"),
    body("location.lng")
      .not()
      .isEmpty()
      .withMessage("กรุณาป้อนลองจิจูดด้วย")
      .isNumeric()
      .withMessage("ลองจิจูดต้องเป็นตัวเลขเท่านั้น"),
  ],
  shopController.insertShop
);
router.post(
  "/product",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  [
    body("name")
      .not()
      .isEmpty()
      .withMessage("กรุณาป้อนชื่อสินค้าด้วย")
      .isString()
      .withMessage("ชื่อสินค้าไม่ถูกต้อง"),
    body("price")
      .not()
      .isEmpty()
      .withMessage("กรุณาราคาสินค้าด้วย")
      .isNumeric()
      .withMessage("ราคาสินค้าต้องเป็นตัวเลขเท่านั้น"),
    body("shopId")
      .not()
      .isEmpty()
      .withMessage("กรุณาระบุรหัสร้านค้าขายสินค้าด้วย")
      .isString()
      .withMessage("รหัสร้านค้าไม่ถูกต้อง"),
    body("specs.volume")
      .isNumeric()
      .withMessage("ปริมาตรต้องเป็นตัวเลขเท่านั้น"),
    body("specs.length")
      .isNumeric()
      .withMessage("ความยาวต้องเป็นตัวเลขเท่านั้น"),
    body("specs.angle").isNumeric().withMessage("มุมต้องเป็นตัวเลขเท่านั้น"),
    body("specs.gender")
      .isIn(["male", "female", "unisex"])
      .withMessage("เพศไม่ถูกต้อง"),
    body("specs.handedness")
      .isIn(["RH", "LH", "RH/LH"])
      .withMessage("มือไม่ถูกต้อง"),
  ],
  shopController.insertProduct
);
router.post("/:id/follow", [passportJWT.isLogin], shopController.followShop);
router.post(
  "/:id/unfollow",
  [passportJWT.isLogin],
  shopController.unfollowShop
);

router.put(
  "/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  [
    body("name").isString().withMessage("ชื่อร้านค้าไม่ถูกต้อง"),
    body("location.lat")
      .isNumeric()
      .withMessage("ละติจูดต้องเป็นตัวเลขเท่านั้น"),
    body("location.lng")
      .isNumeric()
      .withMessage("ลองจิจูดต้องเป็นตัวเลขเท่านั้น"),
  ],
  shopController.updateShop
);
router.put(
  "/product/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  [
    body("name").isString().withMessage("ชื่อสินค้าไม่ถูกต้อง"),
    body("price").isNumeric().withMessage("ราคาสินค้าต้องเป็นตัวเลขเท่านั้น"),
    body("specs.volume")
      .isNumeric()
      .withMessage("ปริมาตรต้องเป็นตัวเลขเท่านั้น"),
    body("specs.length")
      .isNumeric()
      .withMessage("ความยาวต้องเป็นตัวเลขเท่านั้น"),
    body("specs.angle").isNumeric().withMessage("มุมต้องเป็นตัวเลขเท่านั้น"),
    body("specs.gender")
      .isIn(["male", "female", "unisex"])
      .withMessage("เพศไม่ถูกต้อง"),
    body("specs.handedness")
      .isIn(["RH", "LH", "RH/LH"])
      .withMessage("มือไม่ถูกต้อง"),
  ],
  shopController.updateProduct
);

router.delete(
  "/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  shopController.deleteShop
);
router.delete(
  "/product/:id",
  [passportJWT.isLogin, checkAdmin.isAdmin],
  shopController.deleteProduct
);

module.exports = router;
