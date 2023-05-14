import { FileHandle } from "./file-handle.model";

export interface Product{
    productId: number,
    productName: String,
    productDescription: string,
    productDiscountedPrice: number,
    productActualPrice: number,
    productImages: FileHandle[]
}