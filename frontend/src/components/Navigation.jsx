import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <div>
      <Link to="/inventory">
        <h1>Inventory App</h1>
      </Link>
      
      <Link to="/inventory_create">
        Create Item
      </Link>
    </div>
  );
}
