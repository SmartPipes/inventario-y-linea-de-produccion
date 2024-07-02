import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../../../Styled/InventoryNavBar.styled';

const CategoryList = ({ categories }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <tr>
                        <TableHeaderCell>Nombre</TableHeaderCell>
                        <TableHeaderCell>Descripción</TableHeaderCell>
                    </tr>
                </TableHead>
                <TableBody>
                    {categories.map(category => (
                        <TableRow key={category.category_id}>
                            <TableCell>{category.name}</TableCell>
                            <TableCell>{category.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CategoryList;
