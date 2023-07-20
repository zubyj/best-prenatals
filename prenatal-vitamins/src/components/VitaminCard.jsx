import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function VitaminCard({ vitamin }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5">{vitamin.general_info.brand}</Typography>
                <Typography variant="subtitle1">{vitamin.general_info.pill_type}</Typography>
                {/* Add more fields as needed */}
            </CardContent>
        </Card>
    );
}

export default VitaminCard;
