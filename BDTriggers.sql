

DELIMITER //
CREATE TRIGGER after_product_insert
AFTER INSERT ON inv_product
FOR EACH ROW
BEGIN
    INSERT INTO inv_inventory (item_id, item_type, warehouse_id, stock)
    VALUES (NEW.product_id, 'Product', 1, 0); -- Ajusta el warehouse_id y stock inicial según tus necesidades
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_raw_material_insert
AFTER INSERT ON inv_raw_material
FOR EACH ROW
BEGIN
    INSERT INTO inv_inventory (item_id, item_type, warehouse_id, stock)
    VALUES (NEW.raw_material_id, 'RawMaterial', 1, 0); -- Ajusta el warehouse_id y stock inicial según tus necesidades
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_product_delete
AFTER DELETE ON inv_product
FOR EACH ROW
BEGIN
    DELETE FROM inv_inventory WHERE item_id = OLD.product_id AND item_type = 'Product';
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_raw_material_delete
AFTER DELETE ON inv_raw_material
FOR EACH ROW
BEGIN
    DELETE FROM inv_inventory WHERE item_id = OLD.raw_material_id AND item_type = 'RawMaterial';
END;
//
DELIMITER ;

#Trigger para OperationLog despues de que se actualiza el stock en la tabla inventory
DELIMITER //

CREATE TRIGGER trg_after_inventory_update
AFTER UPDATE ON inv_inventory
FOR EACH ROW
BEGIN
    DECLARE operation_type VARCHAR(6);
    DECLARE user_id INT;

    -- Determinar el tipo de operación (Add o Remove)
    IF NEW.stock > OLD.stock THEN
        SET operation_type = 'Add';
    ELSEIF NEW.stock < OLD.stock THEN
        SET operation_type = 'Remove';
    ELSE
        -- No hay cambio en la cantidad de stock, no se registra en el log
        SET operation_type = NULL;
    END IF;

    IF operation_type IS NOT NULL THEN
        SET user_id = 1;

        -- Aquí se debe agregar la lógica para recuperar el ID del usuario logeado
        -- por ejemplo, desde una tabla de sesión de usuarios o similar.
        -- SET user_id = (SELECT logged_user_id FROM user_sessions WHERE session_id = CURRENT_SESSION_ID);

        -- Insertar en la tabla inv_operation_log
        INSERT INTO inv_operation_log (quantity, datetime, type_operation, product_id, op_log_user_id, warehouse_id)
        VALUES (ABS(NEW.stock - OLD.stock), NOW(6), operation_type, NEW.item_id, user_id, NEW.warehouse_id);
    END IF;
END //

DELIMITER ;