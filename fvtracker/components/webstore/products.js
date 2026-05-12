import { useSelector } from "react-redux";
import { LoadingFullScreen } from "../layout/loading";
import { AppTile, AppTilesGrid } from "../layout/preview/tile";

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

const ProductsTilesGrid = ({ products: tiles }) => {
  return (
    <>
      <div>
        <AppTilesGrid>
          {tiles.map((tile, index) => (
            <AppTile key={index} tile={tile}>
              <h3>{tile.name}</h3>
              <p>{tile.description}</p>
              <p>Price: ${tile.price}</p>
            </AppTile>
          ))}
        </AppTilesGrid>
      </div>
    </>
  );
};
