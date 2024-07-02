import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../../../Styled/InventoryNavBar.styled';

const WarehouseList = ({ warehouses }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <tr>
                        <TableHeaderCell>Almacén</TableHeaderCell>
                        <TableHeaderCell>Dirección</TableHeaderCell>
                    </tr>
                </TableHead>
                <TableBody>
                    {warehouses.map(warehouse => (
                        <TableRow key={warehouse.warehouse_id}>
                            <TableCell>{warehouse.name}</TableCell>
                            <TableCell>{warehouse.address}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default WarehouseList;
