import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../../../Styled/InventoryNavBar.styled';

const SupplierList = ({ suppliers }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <tr>
                        <TableHeaderCell>Proveedor</TableHeaderCell>
                        <TableHeaderCell>RFC</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell>Teléfono</TableHeaderCell>
                        <TableHeaderCell>Dirección</TableHeaderCell>
                        <TableHeaderCell>Rating</TableHeaderCell>
                    </tr>
                </TableHead>
                <TableBody>
                    {suppliers.map(supplier => (
                        <TableRow key={supplier.supplier_id}>
                            <TableCell>{supplier.name}</TableCell>
                            <TableCell>{supplier.RFC}</TableCell>
                            <TableCell>{supplier.email}</TableCell>
                            <TableCell>{supplier.phone}</TableCell>
                            <TableCell>{supplier.address}</TableCell>
                            <TableCell>{supplier.rating}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SupplierList;
