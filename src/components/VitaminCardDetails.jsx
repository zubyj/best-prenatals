// VitaminCardDetails.jsx
import React, { useState, useEffect } from 'react';

// MaterialUI imports
import { Card, CardContent, Typography, Button, Collapse, Grid, Box, Table, TableRow, TableCell, TableBody, Modal, Alert } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Load the json of FDA vitamin values
import fdaVitaminValues from '../fda-rdv.json'


function VitaminCardDetails({ vitamin, showVitamins, handleToggleVitamins, open, handleClose }) {
    const [missingNutrients, setMissingNutrients] = useState([]);
    const [lowNutrients, setLowNutrients] = useState([]);
    const [openMissingNutrients, setOpenMissingNutrients] = useState(false);
    const [openLowNutrients, setOpenLowNutrients] = useState(false);

    useEffect(() => {
        const missing = [];
        const low = [];

        vitamin.vitamins.forEach(vitaminInfo => {
            const fdaValue = fdaVitaminValues[vitaminInfo.name];
            let name = vitaminInfo.name.toLowerCase();
            if ((!fdaValue || Number(vitaminInfo.amount) === 0) &&
                name !== "magnesium" &&
                name !== "calcium" &&
                name !== "added sugars") {
                missing.push({
                    name: vitaminInfo.name,
                    amount: vitaminInfo.amount,
                    unit: vitaminInfo.unit,
                });
            } else if (Number(vitaminInfo.amount) < fdaValue &&
                name !== "magnesium" &&
                name !== "calcium" &&
                name !== "added sugars") {
                low.push({ name: vitaminInfo.name, amount: vitaminInfo.amount, unit: vitaminInfo.unit, recommended: fdaValue });
            }
        });

        setMissingNutrients(missing);
        setLowNutrients(low);
    }, [vitamin]);


    const handleToggleMissingNutrients = () => setOpenMissingNutrients(!openMissingNutrients);
    const handleToggleLowNutrients = () => setOpenLowNutrients(!openLowNutrients);

    const formatToEmoji = (format) => {
        switch (format) {
            case 'Gummy':
                return '🍬';
            case 'Pill':
                return '💊';
            case 'Liquid':
                return '🥤';
            default:
                return '';
        }
    };

    // Function to divide an array into chunks of 3 vitamins
    const chunk = (arr, len) => {
        var chunks = [],
            i = 0,
            n = arr.length;
        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }
        return chunks;
    }

    // Divide vitamin array into chunks of 2
    const vitaminChunks = chunk(vitamin.vitamins, 2);

    const url = new URL(vitamin.general_info.url);
    const hostname = url.hostname;
    // Split the hostname by dot "."
    const parts = hostname.split(".");

    let domain;
    if (parts[0] === 'www') {
        // If the hostname starts with 'www', take the second part
        domain = parts[1];
    } else {
        // Otherwise, take the first part
        domain = parts[0];
    }

    const totalVitamins = parseInt(vitamin.general_info.num_low_vitamins) + parseInt(vitamin.general_info.num_missing_vitamins);


    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                'display': 'flex',
                'justifyContent': 'center',
                'alignItems': 'center',
            }}
            data-aos="zoom-in"
        >
            <Card>
                <CardContent sx={{
                    'display': 'flex',
                    'flexDirection': 'column',
                    'alignItems': 'center',
                    'gap': '25px',
                    'width': '300px',
                    'maxHeight': '75vh',
                    'background-image': 'linear-gradient(to top, #0250c5 0%, #d43f8d 100%)',
                    'overflowY': 'auto',
                }} >
                    <Box sx={{
                        'backgroundColor': '#fff',
                        'padding': '20px',
                        'borderRadius': '10px',
                        'width': '240px',
                        'textAlign': 'center'

                    }}>
                        <Typography fontSize={20}>{vitamin.general_info.brand_name}</Typography>
                        <hr />
                        <Typography fontSize={20} fontWeight={700}>{vitamin.general_info.product_name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: 'white', width: '300px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Card>
                                    <Typography
                                        variant="body1"
                                        padding={1}
                                        minWidth={30}
                                        fontWeight={700}
                                        border={'2px solid black'}
                                        style={{
                                            borderColor: vitamin.general_info.num_low_vitamins <= 3 ? 'green' :
                                                vitamin.general_info.num_low_vitamins <= 8 ? '#ff8c00' :
                                                    vitamin.general_info.num_low_vitamins <= 10 ? 'red' :
                                                        'red',
                                            color: vitamin.general_info.num_low_vitamins <= 3 ? 'green' :
                                                vitamin.general_info.num_low_vitamins <= 8 ? '#ff8c00' :
                                                    vitamin.general_info.num_low_vitamins <= 10 ? 'red' :
                                                        'red',
                                        }}
                                    >
                                        {totalVitamins}</Typography></Card>
                                <Typography variant="subtitle2" marginTop={1.5} fontWeight={700}>Warnings</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Card><Typography variant="body1" padding={1}>{vitamin.general_info.format} {formatToEmoji(vitamin.general_info.format)}</Typography></Card>
                                <Typography variant="subtitle2" marginTop={2} fontWeight={700}>Format</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Card><Typography variant="body1" padding={1} minWidth={30} textAlign={'center'}>{vitamin.general_info.serving_size}</Typography></Card>
                                <Typography variant="subtitle2" marginTop={2} textAlign={'center'} fontWeight={700}>Serving Size</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Button variant="contained" color="success" size='large' href={vitamin.general_info.url} target='_blank'>
                        <ShoppingCartIcon />
                        <Typography fontSize="small" marginLeft={2}>
                            Shop Now
                        </Typography>
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        {missingNutrients.length > 0 &&
                            <>
                                <Button variant="contained" size="small" color="error" style={{ width: "300px" }} onClick={handleToggleMissingNutrients}>
                                    Warning: {missingNutrients.length} Nutrients Missing {openMissingNutrients ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </Button>
                                <Collapse in={openMissingNutrients}>
                                    <Alert severity="error">
                                        <Table>
                                            <TableBody>
                                                {missingNutrients.map((nutrient, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: 'none', fontSize: '8pt', padding: '5px' }}>
                                                            {nutrient.name} is missing
                                                            <br />
                                                            {nutrient.amount} {nutrient.unit} recommended by FDA.
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Alert>
                                </Collapse>
                            </>
                        }
                    </Box>
                    <Box sx={{ marginBottom: '20px', textAlign: 'center' }}>
                        {lowNutrients.length > 0 &&
                            <>
                                <Button variant="contained" size="small" color="warning" style={{ width: "300px" }} onClick={handleToggleLowNutrients}>
                                    Warning: {lowNutrients.length} Nutrients Very Low {openLowNutrients ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </Button>
                                <Collapse in={openLowNutrients}>
                                    <Alert severity="warning">
                                        <Table>
                                            <TableBody>
                                                {lowNutrients.map((nutrient, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell sx={{ border: 'none', fontSize: '8pt', padding: '5px' }}>
                                                            {nutrient.name.toLowerCase() === 'choline' ? (
                                                                <>
                                                                    Only {nutrient.amount} {nutrient.unit} of {nutrient.name}.
                                                                    <br />
                                                                    We are looking for 231 {nutrient.unit} of {nutrient.name} as the FDA recommends 550 {nutrient.unit} of {nutrient.name} per day, but studies show that pregnant women already consume 319 {nutrient.unit} via diet.
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Only {nutrient.amount} {nutrient.unit} of {nutrient.name}.
                                                                    <br />
                                                                    {nutrient.recommended} {nutrient.unit} recommended by FDA.
                                                                </>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                            </TableBody>
                                        </Table>
                                    </Alert>
                                </Collapse>
                            </>
                        }
                    </Box>
                    <Button variant="outlined" style={{ width: '300px', backgroundColor: '#fff', marginTop: '20px' }} onClick={handleToggleVitamins}>
                        {showVitamins ? 'Hide Nutrient List' : 'Show Full Nutrient List'}
                        {showVitamins ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </Button>
                    <Collapse in={showVitamins} >
                        <Typography variant="h5" color="white" fontWeight={700} sx={{ textAlign: 'center', paddingY: '20px' }}>Vitamins</Typography>
                        <Table sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                            <TableBody>
                                {vitaminChunks.map((vitaminChunk, index) => (
                                    <TableRow key={index} margin={0} padding={0}>
                                        {vitaminChunk.map((vitaminInfo, subIndex) => (
                                            <TableCell sx={{ border: '2px solid lightcyan', padding: '5px' }}>
                                                <Alert sx={{ width: '120px', height: '50px', fontSize: '12px' }} severity={Number(vitaminInfo.amount) === 0 ? 'error' : Number(vitaminInfo.amount) < fdaVitaminValues[vitaminInfo.name] ? 'warning' : 'success'}>
                                                    {vitaminInfo.name}
                                                    <br />
                                                    {vitaminInfo.amount} {vitaminInfo.unit}
                                                </Alert>
                                            </TableCell >
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Collapse>

                    <hr />
                </CardContent >
            </Card >
        </Modal >
    );
}

export default VitaminCardDetails;
