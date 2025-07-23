import React, { useState } from 'react';
import { TablePagination, Box } from '@mui/material';

const PaginationTableWrapper = ({ data, rowsPerPage = 5, renderTable }) => {
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {renderTable(paginatedData)}
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
    </Box>
  );
};

export default PaginationTableWrapper;
