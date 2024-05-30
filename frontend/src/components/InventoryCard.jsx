
export function InventoryCard({item}) {
  return (
    <div>
          <h3>{item.item_name}</h3>
          <p>{item.item_type}</p>
          <p>{item.stock}</p>
          <hr />
        </div>
  )
}

