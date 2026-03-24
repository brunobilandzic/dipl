export function HarvestingModal({ isOpen, onCancel, onConfirm }) {
  const [newHarvest, setNewHarvest] = useState({});

  useEffect(() => {
    if (!cultivation?._id) return;
    if (!crops?.generalTypes?.length) return;

    setNewHarvest(
      initialNewHarvest_WId
        ? initialNewHarvest_WId({ cultivationId: cultivation?._id })
        : {},
    );
  }, [cultivation?._id]);

  return <>{JSON.stringify(newHarvest, null, 2)}</>;
}

const initialChooseNewEnd = {
  isOpen: false,
  choice: null,
  x: null,
  y: null,
};

const initialNewHarvest_WId = ({ cultivationId }) => {
  // we are choosing variaty when clicking on it
  return {
    cultivationId: cultivationId || null,
    variety: {
      _id: null,
      name: null,
    },
    harvestPlan: null,
    toHarvestCells: [],
    harvestedAt: new Date("2026-03-10T00:00:00Z"),
    beginX: null,
    beginY: null,
    endX: null,
    endY: null,
  };
};

const prepareHarvestBody = (newHarvest) => ({
  cultivationId: newHarvest.cultivationId,
  cropVarietyId: newHarvest.variety._id,
  relativeCoords: newHarvest.toHarvestCells,
  harvestedAt: newHarvest.harvestedAt,
  plantingPlanId: newPlantage.plantingPlan?._id,
});
