import { fetchManager } from "@/lib/auth/fetchSessionData";
import { PRODUCTION_MANAGER } from "@/lib/constants/users/managerTypes";
import dbConnect from "@/lib/db/mongooseConnect";
import {
  createProduct,
  deleteProducts,
  getProducts,
  updateProduct,
} from "@/lib/production/product";

export const GET = async (req) => {
  try {
    await dbConnect();
    const products = await getProducts();

    return Response.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching managers:", error);
    return Response.json(
      { error: "Failed to fetch managers" },
      { status: 500 },
    );
  }
};

export const PUT = async (req) => {
  try {
    await dbConnect();
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();
    const product = await updateProduct({
      _updatedProduct: body,
      productId: id,
    });
    return Response.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
};

export const POST = async (req) => {
  try {
    await dbConnect();
    const body = await req.json();
    const product = await createProduct({
      _newProductData: body,
    });

    return Response.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req) => {
  try {
    await dbConnect();
    const idsString = req.nextUrl.searchParams.get("ids");
    const productIds = idsString.split(",");
    const product = await deleteProducts({ productIds });

    return Response.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
};
