import { useSelector } from "react-redux";
import { LoadingFullScreen } from "../layout/loading";
import { AppTile, AppTilesGrid } from "../layout/preview/tile";
import { FaShoppingCart } from "react-icons/fa";
import { getIngredientsList } from "@/lib/utils/production/products";

export const ProductList = ({}) => {
  const products = useSelector(
    (state) => state.webstore.products.filteredItems,
  );
  console.log("Products in ProductList:", products);

  if (!products) {
    return <LoadingFullScreen />;
  }

  return (
    <div>
      <ProductsTilesGrid products={products} />
    </div>
  );
};

const ProductsTilesGrid = ({ title, products }) => {
  return (
    <>
      <div>
        <AppTilesGrid>
          {products.map((product, index) => (
            <ProductTile index={index} product={product} />
          ))}
          <AppTile />
          <AppTile />
          <AppTile />
          <AppTile />
          <AppTile />
          <AppTile />
        </AppTilesGrid>
      </div>
    </>
  );
};

function ProductTile({ index, product }) {
  const productActions = [
    {
      component: (
        <ProductActionComponent
          onClick={() => {
            console.log("clicked cart");
          }}
        >
          <FaShoppingCart />
        </ProductActionComponent>
      ),
      onClick: () => {
        console.log("adding to cart");
      },
    },
  ];
  return (
    <AppTile key={index} tile={product}>
      <div className=" flex flex-col justify-between h-full">
        <div className="">
          <h3 className="listitemheader">{product.name}</h3>
          <p className="listitemDescription break-words line-clamp-20">
            {product.description}
            dvsdvasvd dasvsad asvd asvd asvd asvd asvd asvd asvd asvd asvd asvd
            asvd asvd
          </p>
        </div>

        <div>
          {" "}
          <div className="text-sm mt-2">
            Sastojci: {getIngredientsList({ ingredients: product.ingredients })}
          </div>
          <div className="flex justify-between items-center h-fit">
            <p className="text-xl">${product.price}</p>
            <div>
              <ProductActions actions={productActions} />
            </div>
          </div>
        </div>
      </div>
    </AppTile>
  );
}

const ProductActions = ({ actions }) => {
  return (
    <div>
      {actions.map((action, index) => (
        <div className="" key={index}>
          {action.component}
        </div>
      ))}
    </div>
  );
};

const ProductActionComponent = ({ onClick, children }) => {
  return (
    <>
      <div
        className="text-xl hover:text-2xl hover:font-bold "
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick();
        }}
      >
        {children}
      </div>
    </>
  );
};
