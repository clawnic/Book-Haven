const express = require('express');
const Book = require('./book.model.js');
const router = express.Router();


//import controller functions 
const {postBook,getAllBooks,getSingleBook,UpdateBook,deleteABook} = require('./book.controller.js');
const  verifyAdminToken = require("../middleware/verifyAdminToken.js");


router.post("/create-book",verifyAdminToken,postBook)
router.get("/", getAllBooks);
router.get("/:id", getSingleBook);
router.put("/edit/:id",verifyAdminToken,  UpdateBook);
router.delete("/:id",verifyAdminToken,  deleteABook)

module.exports = router;