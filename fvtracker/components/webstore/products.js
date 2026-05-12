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

const ProductsTilesGrid = ({ title, products: tiles }) => {
  return (
    <>
      <div>
        <AppTilesGrid>
          {tiles.map((tile, index) => (
            <ProductTile index={index} tile={tile} />
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

function ProductTile({ index, tile }) {
  return (
    <AppTile key={index} tile={tile}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="listitemheader">{tile.name}</h3>
          <p className="listitemDescription">{tile.description}</p>
        </div>
        <div>
          <p>Price: ${tile.price}</p>
        </div>
      </div>
    </AppTile>
  );
}
