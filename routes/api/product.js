const express = require("express")
const productServiceApi = require("../../services/api/product.services")
const authMiddleware = require("../../middlewares/auth")
const upload = require("../../middlewares/multer")
const responses = require("../../utilities/responses.utils")
const { validationResult, body } = require("express-validator")
const productRouterApi = express.Router()
const fsUtils = require("../../utilities/fs.utils")
const mysqlconn = require("../../utilities/mysql.utils")
const idGeneratorUtils = require("../../utilities/id-generator.utils")
const moment = require("moment")
const path = require("path")
const { generateUUIDV4 } = require("../../utilities/id-generator.utils")
/**
 * This is an example on how to implement mysql query with promise
 */

// GET all books data
productRouterApi.get("/", async (req, res, next) => {
    try {
        // GET all books data
        const products = await productServiceApi.getAll()
        responses.Success(res, products)
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error)
    }
})

// Get Product By ID User
productRouterApi.get("/user/:id", async (req, res, next) => {
    try {
        const product_user = await productServiceApi.getByUserId(req.params.id)
        if (!product_user.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            })
        }
        responses.Success(res, product_user)
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error)
    }
})

// Get Product By ID Kategori
productRouterApi.get("/kategori/:id", async (req, res, next) => {
    try {
        const product_kategori = await productServiceApi.getByKategoriId(
            req.params.id,
        )
        if (!product_kategori.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            })
        }
        responses.Success(res, product_kategori)
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error)
    }
})

productRouterApi.post(
    "/gambar",
    upload.fields([{ name: "fotoproduk" }]),
    async (req, res, next) => {
        const errors = validationResult(req)
        const files = req.files
        if (!errors.isEmpty()) {
            if (files && files["fotoproduk"]) {
                await fsUtils.deleteOne("./" + files["fotoproduk"][0].path)
            }
            return responses.BadRequest(res, errors.array())
        }
        console.log(req.files["fotoproduk"])

        if (
            files &&
            files["fotoproduk"] &&
            !files["fotoproduk"][0].mimetype.startsWith("image")
        ) {
            await fsUtils.deleteOne("./" + files["fotoproduk"][0].path)
            return responses.BadRequest(res, {
                message: "file must be an image",
            })
        }

        try {
            let link_foto_fotoproduk = ""
            if (files && files["fotoproduk"]) {
                await fsUtils.ensureDir("./public/data/uploads/gambar_produk")
                link_foto_fotoproduk =
                    "data/uploads/gambar_produk/" +
                    `${idGeneratorUtils.generateUUIDV4()}_${moment().format(
                        "YYYY-MM-DD",
                    )}${path.extname(files["fotoproduk"][0].filename)}`

                // Move Original File
                await fsUtils.moveOrRename(
                    "./" + files["fotoproduk"][0].path,
                    `./public/${link_foto_fotoproduk}`,
                )
            }

            // Insert DB
            const result_insert_image = await productServiceApi.uploadgambar({
                link_foto_produk: link_foto_fotoproduk,
            })
            if (!result_insert_image) {
                return responses.InternalServerError(res, {
                    message: "Insert error",
                })
            } else {
                res.json({
                    message: "Insert Success",
                })
            }
        } catch (error) {
            if (files && files["fotoproduk"]) {
                await fsUtils.deleteOne("./" + files["fotoproduk"][0].path)
            }
            return responses.InternalServerErrorCatch(res, error)
        }
    },
)

// POST create new product
productRouterApi.post(
    "/",
    upload.fields([{ name: "fotoproduk" }]),
    body("nama_produk").notEmpty().withMessage("nama_produk body required"),
    body("id_kategori").notEmpty().withMessage("id_kategori body required"),
    authMiddleware.verifyToken,
    async (req, res, next) => {
        const errors = validationResult(req)
        const files = req.files

        if (!errors.isEmpty()) {
            if (files && files["fotoproduk"]) {
                await fsUtils.deleteOne("./" + files["fotoproduk"][0].path)
            }
            return responses.BadRequest(res, errors.array())
        }

        if (
            files &&
            files["fotoproduk"] &&
            !files["fotoproduk"][0].mimetype.startsWith("image")
        ) {
            await fsUtils.deleteOne("./" + files["fotoproduk"][0].path)
            return responses.BadRequest(res, {
                message: "file must be an image",
            })
        }

        const { nama_produk, id_kategori } = req.body
        const jwtData = req.user
        try {
            const id_produk = idGeneratorUtils.generateUUIDV4()
            let link_foto_fotoproduk = ""
            if (files && files["fotoproduk"]) {
                await fsUtils.ensureDir("./public/data/uploads/gambar_produk")
                link_foto_fotoproduk =
                    "data/uploads/gambar_produk/" +
                    `${idGeneratorUtils.generateUUIDV4()}_${moment().format(
                        "YYYY-MM-DD",
                    )}${path.extname(files["fotoproduk"][0].filename)}`

                // Move Original File
                await fsUtils.moveOrRename(
                    "./" + files["fotoproduk"][0].path,
                    `./public/${link_foto_fotoproduk}`,
                )
            }

            // Add Product
            const result_insert = await productServiceApi.create({
                id_produk: id_produk,
                nama_produk: nama_produk,
                id_kategori: id_kategori,
                id_user: jwtData.id_user,
                link_foto_produk: link_foto_fotoproduk,
            })

            if (!result_insert.affectedRows) {
                if (files && files["fotoproduk"]) {
                    await fsUtils.deleteOne("./" + files["fotoproduk"][0].path)
                }
                return responses.InternalServerError(res, {
                    message: "Insert Produk failed",
                })
            }
            responses.Created(res, {
                message: "Insert success",
            })
        } catch (error) {
            if (files && files["fotoproduk"]) {
                await fsUtils.deleteOne("./" + files["fotoproduk"][0].path)
            }
            return responses.InternalServerErrorCatch(res, error)
        }
    },
)

// PUT update book
productRouterApi.put(
    "/:id",
    upload.array(),
    authMiddleware.verifyToken,
    async (req, res, next) => {
        const id_produk = req.params.id
        const { nama_produk, id_kategori } = req.body
        try {
            const result_edit = await productServiceApi.update({
                id_produk,
                nama_produk,
                id_kategori,
            })
            if (!result_edit.affectedRows) {
                return responses.InternalServerError(res, {
                    message: "Update failed",
                })
            }
            responses.Success(res, {
                message: "Update success",
            })
        } catch (error) {
            return responses.InternalServerErrorCatch(res, error)
        }
    },
)

// DELETE book by id
productRouterApi.delete(
    "/:id",
    authMiddleware.verifyToken,
    async (req, res, next) => {
        const id_produk = req.params.id
        try {
            const result_delete = await productServiceApi.remove(id_produk)
            if (!result_delete.affectedRows) {
                return responses.InternalServerError(res, {
                    message: "Delete failed",
                })
            }
            responses.Success(res, {
                message: "Delete success",
            })
        } catch (error) {
            return responses.InternalServerErrorCatch(res, error)
        }
    },
)

// GET book data by id
productRouterApi.get("/:id", async (req, res, next) => {
    try {
        const product = await productServiceApi.getById(req.params.id)
        if (!product.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            })
        }
        responses.Success(res, product)
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error)
    }
})

productRouterApi.get("/andkategori:id", async (req, res, next) => {
    try {
        const product = await productServiceApi.getByIdAndKategori(
            req.params.id,
        )
        if (!product.length) {
            return responses.InternalServerError(res, {
                message: "Not Found",
            })
        }
        responses.Success(res, product)
    } catch (error) {
        return responses.InternalServerErrorCatch(res, error)
    }
})

module.exports = productRouterApi
