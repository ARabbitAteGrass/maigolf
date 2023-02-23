const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const passportJWT = require("../middleware/passportJWT");

/* GET users listing. */
router.get("/", [passportJWT.isLogin], userController.profile);
router.get("/feed", [passportJWT.isLogin], userController.feed);

router.post(
  "/",
  [
    body("name").not().isEmpty().withMessage("กรุณาป้อนชื่อ-สกุลด้วย"),
    body("email")
      .not()
      .isEmpty()
      .withMessage("กรุณาป้อนอีเมลด้วย")
      .isEmail()
      .withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("กรุณาป้อนรหัสผ่านด้วย")
      .isLength({ min: 5 })
      .withMessage("รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษร"),
  ],
  userController.register
);
router.post(
  "/login",
  [
    body("email")
      .not()
      .isEmpty()
      .withMessage("กรุณาป้อนอีเมลด้วย")
      .isEmail()
      .withMessage("รูปแบบอีเมลไม่ถูกต้อง"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("กรุณาป้อนรหัสผ่านด้วย")
      .isLength({ min: 5 })
      .withMessage("รหัสผ่านต้องมีอย่างน้อย 5 ตัวอักษร"),
  ],
  userController.login
);

module.exports = router;
