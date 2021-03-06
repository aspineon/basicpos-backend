const express = require("express");
const router = express.Router();
const branch = require("./models/branch_schema");
const jwt = require("./jwt");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");
router.get("/branch", jwt.verify, async (req, res) => {
  try {
    let data = await branch.find({}).sort({ created: -1 });
    res.json({
      result: "success",
      message: "Fetch Branch Successfully",
      data: data,
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});
router.get("/branch/:id", async (req, res) => {
  try {
    let data = await branch.findById({ _id: req.params.id });
    res.json({
      result: "success",
      message: "Fetch Single Branch Successfully",
      data: data,
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});

router.post("/branch", async (req, res) => {
  // console.log(req)
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      // console.log(files)
      let doc = await branch.create(fields);
      await uploadImage(files, doc);
      res.json({ result: "success", message: "Update Brach data successfully" });
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});


uploadImage = async (files, doc) => {
  if (files.frontimage != null) {
    var fileExtention = files.frontimage.name.split(".").pop();
    doc.frontimage = `${Date.now()}+${doc.name}.${fileExtention}`;
    var newpath =
      path.resolve(__dirname + "/uploaded/images/branch/frontimage") + "/" + doc.frontimage;

    if (fs.exists(newpath)) {
      await fs.remove(newpath);
    }
    await fs.move(files.frontimage.path, newpath);

    // Update database
    await branch.findOneAndUpdate({ _id: doc.id }, doc);
  }
};
router.put("/branch", async (req, res) => {

  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      let doc = await branch.findByIdAndUpdate({ _id: fields.id }, fields);
      await uploadImage(files, doc);
      res.json({ result: "success", message: "Update Brach data successfully" });
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});
router.delete("/branch/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    let response = await branch.findOneAndDelete({ _id: req.params.id });

    res.json({
      result: "success",
      message: "Delete Branch Successfully",
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});
module.exports = router;
