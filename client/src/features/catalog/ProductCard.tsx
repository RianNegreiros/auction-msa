import React from "react"
import { LoadingButton } from '@mui/lab';
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import agent from '../../app/api/agent';
import { Product } from '../../app/models/product';
import { useAppDispatch } from '../../app/store/configureStore';
import { currencyFormat } from '../../app/util/util';
import { setBasket } from '../basket/basketSlice';

interface IProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: IProductCardProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    function handleAddItem(productId: number) {
        setLoading(true);
        agent.Basket.addItem(productId)
            .then((basket) => dispatch(setBasket(basket)))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' },
                }}
            />
            <CardMedia
                component='img'
                height='140'
                sx={{ objectFit: 'contain', bgcolor: 'primary.light' }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant='h5'>
                    {currencyFormat(product.price)}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {product.brand} / {product.type}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton
                    loading={loading}
                    onClick={() => handleAddItem(product.id)}
                    size='small'
                >
                    Add to cart
                </LoadingButton>
                <Button
                    component={Link}
                    to={`/catalog/${product.id}`}
                    size='small'
                >
                    View
                </Button>
            </CardActions>
        </Card>
    );
}