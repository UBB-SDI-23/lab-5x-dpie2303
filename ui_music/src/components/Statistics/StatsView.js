import React, { useState, useEffect, useCallback,useContext } from 'react';
import { ButtonGroup, Button, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../api';
import { AuthContext } from '../../contexts/AuthContext';


const StatsView = () => {
    const [data, setData] = useState([]);
    const [view, setView] = useState('sales');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { userPaginationSize} = useContext(AuthContext);


    const fetchData = useCallback(async () => {
        let url = view === 'sales' ? '/api/record_company_average_sales/' : '/api/artist_average_royalty/';
        
        try {
            const response = await api.get(url, {
                params: {
                    page: page,
                    page_size: userPaginationSize,
                }
            });

            setData(response.data.results);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error(`Error fetching data: ${error}`);
        }
    }, [view, page,userPaginationSize]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleViewChange = (newView) => {
        setView(newView);
        setPage(1);
    };


    return (
        <div>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
                <Button onClick={() => handleViewChange('sales')}>Average Sales</Button>
                <Button onClick={() => handleViewChange('royalty')}>Average Royalty</Button>
            </ButtonGroup>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">{view === 'sales' ? 'Average Sales' : 'Average Royalty'}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row[view === 'sales' ? 'avg_sales_per_album' : 'average_royalty']}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
        </div>
    );
}

export default StatsView;