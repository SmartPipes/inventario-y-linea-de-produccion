import { useEffect, useState } from "react";
import { getAllInventory } from "../api/inventory.api";
import { InventoryCard } from "./InventoryCard";

export function InventoryList() {
  const [inventory, setInventory] = useState([]); // Array de inventarios

  useEffect(() => {
    async function loadInventory() {
      try {
        const res = await getAllInventory();
        setInventory(res.data);
      } catch (error) {
        console.error("Error loading inventory:", error);
      }
    }
    loadInventory();
  }, []);

  return (
    <div>
      {inventory.map(item => (
        <InventoryCard key={item.inventory_id} item={item} />
      ))}
    </div>
  );
}
