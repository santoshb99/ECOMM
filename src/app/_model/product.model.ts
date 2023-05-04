import { FileHandle } from "./file-handle.model";

export interface Product{
    productName: String,
    productDescription: string,
    productDiscountedPrice: number,
    productActualPrice: number,
    productImages: FileHandle[]
}