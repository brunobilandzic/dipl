import React from "react";
import { List, ListItem } from "../layout/preview/list";

function WarehouseAcceptances({ acceptances }) {
  return (
    <div>
      <List>
        {acceptances.map((acceptance) => (
          <WarehouseAcceptProcess
            key={acceptance._id}
            acceptance={acceptance}
          />
        ))}
      </List>
    </div>
  );
}

const WarehouseAcceptProcess = ({ acceptance }) => {
  return (
    <ListItem>
      {acceptance.product.name} - {acceptance.quantity}
    </ListItem>
  );
};

export default WarehouseAcceptances;
