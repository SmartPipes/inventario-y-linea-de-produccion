import React from 'react'
import { SideBar, MainContent, OrderContainer, PlacedOrderBoxes} from '../../../Styled/Production.styled'
import { FormContainer, Button, Label, Input, ButtonContainer } from '../../../Styled/Forms.styled'
import { Titles, SubTitle } from '../../../Styled/Global.styled'
import {useForm} from 'react-hook-form'

//This is to create a production order
export const ProductionLine = () => {

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <OrderContainer>
            <SideBar>
              <SubTitle>Placed Orders</SubTitle>
              <PlacedOrderBoxes/>
              <PlacedOrderBoxes/>
              <PlacedOrderBoxes/>
              <PlacedOrderBoxes/>
              <PlacedOrderBoxes/>
              <PlacedOrderBoxes/>
            </SideBar>

      <MainContent>
        <Titles>create an order</Titles>
          <FormContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <Label>Product</Label>
              <Input type="text" name="product" {...register("product")} />
            </div>
            <div className="form-control">
              <Label>Quantity</Label>
              <Input type="number" name="qty" {...register("qty")} />
            </div>
            <div className="form-control">
              <Label>Warehouse</Label>
              <Input type="text" name="warehouse" {...register("warehouse")} />
            </div>
            <div className="form-control">
              <Label>Factory</Label>
              <Input type="text" name="factory" {...register("factory")} />
            </div>
            <div className="form-control">
              <label></label>
              <ButtonContainer>
              <Button type="submit">Place Order!</Button>
              </ButtonContainer>
            </div>
          </form>
        </FormContainer>
    </MainContent>
    </OrderContainer>
  )
}
