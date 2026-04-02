import dbConnect from "@/lib/db/mongooseConnect";
import { getProducts, updateProduct } from "@/lib/production";

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
    console.log("Received PUT request for product with id:", id);
    console.log("Request body:", body);
    // Implement product update logic here using the id and body
    // For example, you might call an updateProduct function that interacts with the database
    // const updatedProduct = await updateProduct(id, body);
    return Response.json(
      { message: "Product updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
};
