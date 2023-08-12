const ProductModel = require("../models/Product");

class ProductController {
  // get all products
  async getAllProducts(_req, res) {
    try {
      const products = await ProductModel.find().populate("category", "name");

      if (!products)
        return res
          .status(422)
          .json({ success: false, message: "Products not found!!" });

      const formatedProducts = products.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          name: product.name,
          img: product.photos[0],
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get products success!",
        products: formatedProducts,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get product buy category
  async getProductsByCategory(req, res) {
    const { category } = req.query;

    try {
      const products = await ProductModel.find().populate("category", "name");

      if (!products)
        return res
          .status(422)
          .json({ success: false, message: "Products not found!!" });

      if (category === "All") {
        const formatedProducts = products.map((product) => {
          return {
            _id: product._id,
            category: product.category.name,
            long_desc: product.long_desc,
            img: product.photos[0],
            name: product.name,
            short_desc: product.short_desc,
            price: product.price,
          };
        });

        return res.status(200).json({
          success: true,
          message: "Get products success!",
          products: formatedProducts,
        });
      }

      const suitableProduct = products.filter(
        (product) => product.category.name === category
      );
      const formatedProducts = suitableProduct.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          img: product.photos[0],
          name: product.name,
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get products success!",
        products: formatedProducts,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //   get product by id
  async getProductById(req, res) {
    const { productId } = req.params;

    try {
      const product = await ProductModel.findOne({ _id: productId }).populate(
        "category",
        "name"
      );

      if (!product)
        return res
          .status(422)
          .json({ success: false, message: "Product not found!!" });

      const formatedProduct = {
        _id: product._id,
        category: product.category.name,
        long_desc: product.long_desc,
        name: product.name,
        short_desc: product.short_desc,
        price: product.price,
        photos: product.photos,
      };

      return res.status(200).json({ success: true, product: formatedProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  //   get product by id admin
  async getProductByIdAdmin(req, res) {
    const { productId } = req.params;

    try {
      const product = await ProductModel.findOne({ _id: productId });

      if (!product)
        return res
          .status(422)
          .json({ success: false, message: "Product not found!!" });

      const formatedProduct = {
        _id: product._id,
        category: product.category,
        long_desc: product.long_desc,
        name: product.name,
        short_desc: product.short_desc,
        price: product.price,
        photos: product.photos,
      };

      return res.status(200).json({ success: true, product: formatedProduct });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get top trending products
  async getTrendingProducts(_req, res) {
    try {
      const products = await ProductModel.find()
        .populate("category", "name")
        .limit(8);

      if (!products)
        return res
          .status(422)
          .json({ success: false, message: "Products not found!!" });

      const formatedProducts = products.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          name: product.name,
          img: product.photos[0],
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get products success!",
        products: formatedProducts,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // get related products
  async getRelatedProducts(req, res) {
    const { productId } = req.params;
    try {
      const product = await ProductModel.findOne({ _id: productId });
      if (!product)
        return res.status(403).json({ message: "Product not found" });

      const products = await ProductModel.find({
        category: product.category,
      }).populate("category", "name");

      if (!products)
        return res.status(404).json({ message: "Product not found" });

      const suitableProduct = products.filter((product) => {
        return product._id.toString() !== productId.toString();
      });

      const formatedProduct = suitableProduct.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          name: product.name,
          img: product.photos[0],
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Get related products success",
        products: formatedProduct,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // search products
  async searchProducts(req, res) {
    const { searchTerm } = req.query;
    try {
      const regex = new RegExp(searchTerm, "i");

      const foundProducts = await ProductModel.find({ name: regex });

      if (foundProducts.length === 0) {
        return res
          .status(422)
          .json({ success: false, message: "No product were found!" });
      }

      const formatedProduct = foundProducts.map((product) => {
        return {
          _id: product._id,
          category: product.category.name,
          long_desc: product.long_desc,
          name: product.name,
          img: product.photos[0],
          short_desc: product.short_desc,
          price: product.price,
        };
      });

      return res.status(200).json({
        success: true,
        message: "Search products success",
        products: formatedProduct,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // create a new product
  async createProduct(req, res) {
    const { category, long_desc, short_desc, name, price } = req.body;
    try {
      const isExistProduct = await ProductModel.findOne({ name: name });

      if (isExistProduct)
        return res
          .status(403)
          .json({ success: false, message: "Product is exist!" });

      const newProduct = await ProductModel.create({
        name,
        price,
        long_desc,
        short_desc,
        category,
      });

      if (!newProduct)
        return res
          .status(403)
          .json({ success: false, message: "Can't creat product" });

      return res.status(201).json({
        success: true,
        message: "Product created successfully!",
        product: newProduct,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // delete a product
  async deleteProduct(req, res) {
    const { productId } = req.query;
    try {
      const product = await ProductModel.findById(productId);
      if (!product)
        return res
          .status(403)
          .json({ success: false, message: "Product is not exist!" });

      await ProductModel.deleteOne({ _id: product._id });

      return res
        .status(200)
        .json({ success: true, message: "Delete product success" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //update a product
  async updateProduct(req, res) {
    const { category, long_desc, short_desc, name, price } = req.body;
    const { productId } = req.query;
    try {
      const product = await ProductModel.findOne({ _id: productId });
      if (!product)
        return res
          .status(403)
          .json({ success: "false", message: "Product is not exist!" });

      const result = await ProductModel.findByIdAndUpdate(
        { _id: product._id },
        {
          category,
          long_desc,
          short_desc,
          name,
          price,
        },
        { new: true }
      );

      if (!result)
        return res
          .status(403)
          .json({ success: "false", message: "Can not update product!" });
      return res.status(200).json({
        success: true,
        message: "Updated product successfully",
        product: result,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
