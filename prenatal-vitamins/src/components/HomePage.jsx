import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';

import VitaminList from './VitaminList';
import Pagination from './Pagination';
import FilterBar from './FilterBar';
import { Typography } from '@mui/material';

function HomePage() {
    const [vitamins, setVitamins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVitamin, setSelectedVitamin] = useState('');
    const [amount, setAmount] = useState('');
    const [filteredVitamins, setFilteredVitamins] = useState([]);
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;
    const vitaminsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('prenatal-vitamins.json');
            const data = await response.json();
            setVitamins(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        let newFilteredVitamins = vitamins;

        if (searchTerm) {
            newFilteredVitamins = newFilteredVitamins.filter(vitamin => vitamin.general_info.brand.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (selectedVitamin && amount) {
            newFilteredVitamins = newFilteredVitamins.filter(vitamin => {
                const vitaminInfo = vitamin.vitamins.find(v => v.name === selectedVitamin);
                return vitaminInfo && parseFloat(vitaminInfo.amount) >= parseFloat(amount);
            });
        }

        setFilteredVitamins(newFilteredVitamins);
    }, [vitamins, searchTerm, selectedVitamin, amount]);

    const startIndex = (page - 1) * vitaminsPerPage;
    const selectedVitamins = filteredVitamins.slice(startIndex, startIndex + vitaminsPerPage);

    const vitaminOptions = [...new Set(vitamins.flatMap(vitamin => vitamin.vitamins.map(v => v.name)))];

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
        }}>
            <Typography variant="h4">Prenatal Vitamins</Typography>
            <FilterBar
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                selectedVitamin={selectedVitamin}
                onVitaminChange={(e) => setSelectedVitamin(e.target.value)}
                amount={amount}
                onAmountChange={(e) => setAmount(e.target.value)}
                onFilterClick={() => setFilteredVitamins(vitamins)}
                vitaminOptions={vitaminOptions}
            />
            <VitaminList vitamins={selectedVitamins} />
            <Pagination totalVitamins={filteredVitamins.length} vitaminsPerPage={vitaminsPerPage} />
        </Box>
    );
}

export default HomePage;
