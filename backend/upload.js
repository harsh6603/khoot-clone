const multer = require('multer');
const CustomError = require('./utils/CustomError');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let [media] = file.mimetype.split("/");
        if (media == "image") {
            cb(null, "./images");
        } else {
            cb(null, "./csvs");
        }
    },
    filename: (req, file, cb) => {
        let ext = file.originalname.split(".")[1];
        cb(null, Date.now() + "." + ext);
    }
})

const imageFilter = (req, file, cb) => {
    let [media, type] = file.mimetype.split("/");

    if (media != "image") {
        cb(new Error("only images are allowed"));
        return;
    }
    if (type != "png" && type != 'jpeg') {
        cb(new Error("jpeg/png images are allowed"));
        return;
    }
    cb(null, true);
}

const csvFilter = (req, file, cb) => {
    let [name, ext] = file.originalname.split(".");
    if (ext == "csv") {
        cb(null, true);
    } else {
        cb(new CustomError(400, "only csv files are allowed"));
    }
}

const uploadImage = multer({
    storage,
    fileFilter: imageFilter,
});

const uploadCsv = multer({
    storage,
    fileFilter: csvFilter
})

module.exports = { uploadImage, uploadCsv };

