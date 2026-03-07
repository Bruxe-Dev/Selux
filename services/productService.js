import Product from '../models/Product.js'
import express from 'express'

export const getProducts = async () => {
    return await Product.find()
}

export const createProducts = async (data) => {
    const product = data

    if (!product) {
        return {
            "sucess": false,
            "message": "No product data given"
        }
    }

    return await Product.create(product)
}

export const getProductById = async (id) => {
    return await Product.findById(id)
}

export const getProductByName = async (name) => {
    if (!name) {
        return {
            "sucess": false,
            "message": "No product name given"
        }
    }
    const productInfo = Product.findOne(name)

    if (!productInfo) {
        return {
            "sucess": false,
            "message": "Product not found"
        }
    }

    return await productInfo
}

export const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true })
}

export const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id,)
}