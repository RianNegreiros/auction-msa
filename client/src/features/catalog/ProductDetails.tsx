import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import {
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Product } from '../../app/models/product';
import agent from '../../app/api/agent';
import NotFound from '../../app/errors/NotFound';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { removeItem, setBasket } from '../basket/basketSlice';

export default function ProductDetails() {
    const { basket } = useAppSelector((state) => state.basket);
    const dispatch = useAppDispatch();

    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product>();
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(0);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const item = basket?.items.find((i) => i.productId === product?.id);

    useEffect(() => {
        if (item) setQuantity(item.quantity);

        agent.Catalog.details(parseInt(id))
            .then((response) => setProduct(response))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [id, item]);

    function handleInputChange(event: any) {
        if (event.target.value >= 0) {
            setQuantity(parseInt(event.target.value));
        }
    }

    function handleUpdateCart() {
        setSubmitting(true);

        if (!item || quantity > item.quantity) {
            const updatedQuantity = item ? quantity - item.quantity : quantity;

            agent.Basket.addItem(product?.id!, updatedQuantity)
                .then((basket) => dispatch(setBasket(basket)))
                .catch((error) => console.log(error))
                .finally(() => setSubmitting(false));
        } else {
            const updatedQuantity = item.quantity - quantity;
            agent.Basket.removeItem(product?.id!, updatedQuantity)
                .then(() =>
                    dispatch(
                        removeItem({
                            productId: product?.id!,
                            quantity: updatedQuantity,
                        })
                    )
                )
                .catch((error) => console.log(error))
                .finally(() => setSubmitting(false));
        }
    }

    if (loading)
        return <LoadingComponent message='Loading product details...' />;

    if (!product) return <NotFound />;

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img
                    src={product.pictureUrl}
                    alt={product.name}
                    style={{ width: '100%' }}
                />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3'>{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant='h4' color='secondary'>
                    ${(product.price / 100).toFixed(2)}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            onChange={handleInputChange}
                            variant='outlined'
                            type='number'
                            label='Quantity in Cart'
                            fullWidth
                            value={quantity}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            disabled={
                                item?.quantity === quantity ||
                                (!item && quantity === 0)
                            }
                            loading={submitting}
                            onClick={handleUpdateCart}
                            sx={{ height: '55px' }}
                            color='primary'
                            size='large'
                            variant='contained'
                            fullWidth
                        >
                            {item ? 'Update Quantity' : 'Add to Cart'}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}