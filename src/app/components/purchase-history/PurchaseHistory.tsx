
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination, 
  IconButton, 
  Collapse, 
  TextField, 
  InputAdornment,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { RootState } from '../../redux/store';
import { useMember } from '../../hooks/useMember';
import { useAlertService } from '../../hooks/useAlertService';
import { ActivityHistory, LOB } from '../../types';
import NoData from '../common/no-data/NoData';
import { formatCurrency } from '../../utils/formatters';
import './PurchaseHistory.scss';

interface RowProps {
  row: any;
}

const Row: React.FC<RowProps> = ({ row }) => {
  const [open, setOpen] = useState(false);
  
  const getSign = (val: number) => (val > 0 ? '+' : '');
  
  return (
    <>
      <TableRow className="example-element-row" hover>
        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
        <TableCell>{row.type}</TableCell>
        <TableCell>{row.bookingId || '-'}</TableCell>
        <TableCell>{row.location || '-'}</TableCell>
        <TableCell>{row.gaming ? 'Gaming' : row.desc}</TableCell>
        <TableCell>
          <Box className="p-5 highlight">
            {row.spend ? formatCurrency(row.spend) : '-'}
          </Box>
        </TableCell>
        <TableCell>
          <Box 
            className={`p-5 highlight ${
              row.total > 0 
                ? 'earns' 
                : row.total < 0 
                ? 'spends' 
                : 'no-transactions'
            }`}
          >
            {row.total ? row.total.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '-'}
          </Box>
        </TableCell>
        <TableCell>
          <Box 
            className={`p-5 highlight ${
              row.serviceStatusPoints > 0 
                ? 'earns' 
                : row.serviceStatusPoints < 0 
                ? 'spends' 
                : 'no-transactions'
            }`}
          >
            {row.serviceStatusPoints 
              ? row.serviceStatusPoints.toLocaleString('en-US', { maximumFractionDigits: 0 }) 
              : '-'}
          </Box>
        </TableCell>
        <TableCell>
          <Box 
            className={`p-5 highlight ${
              row.basePoints > 0 
                ? 'earns' 
                : row.basePoints < 0 
                ? 'spends' 
                : 'no-transactions'
            }`}
          >
            {row.basePoints 
              ? row.basePoints.toLocaleString('en-US', { maximumFractionDigits: 0 }) 
              : '-'}
          </Box>
        </TableCell>
        <TableCell>
          {row.isExpandable && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      
      {row.isExpandable && (
        <TableRow className="example-detail-row">
          <TableCell colSpan={10} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={3}>
                <Box display="flex" justifyContent="space-around" gap={3}>
                  <Box flex="50%" className="m-30 w-50p">
                    {row.nestedData?.length ? (
                      row.nestedData.map((data: any, index: number) => (
                        <Box key={index} mb={3}>
                          <Typography variant="h6">{data.title}</Typography>
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" justifyContent="space-between">
                              <Typography>{data.subTotal?.key}</Typography>
                              <Typography>{formatCurrency(data.subTotal?.value)}</Typography>
                            </Box>
                            
                            {data.offers.map((offer: any, i: number) => (
                              <Box 
                                key={i} 
                                display="flex" 
                                justifyContent="space-between" 
                                alignItems="center" 
                                className="color-green"
                              >
                                <Typography>{offer.key}</Typography>
                                <Typography>{formatCurrency(offer.value)}</Typography>
                              </Box>
                            ))}
                            
                            <Box display="flex" justifyContent="space-between">
                              <Typography>{data.tax?.key}</Typography>
                              <Typography>{formatCurrency(data.tax?.value)}</Typography>
                            </Box>
                            
                            {data.gratuity && (
                              <Box display="flex" justifyContent="space-between">
                                <Typography>{data.gratuity?.key}</Typography>
                                <Typography>{formatCurrency(data.gratuity?.value)}</Typography>
                              </Box>
                            )}
                            
                            <Box 
                              display="flex" 
                              justifyContent="space-between" 
                              className="font-size-medium mb-20"
                            >
                              <Typography fontWeight="bold">{data.total?.key}</Typography>
                              <Typography fontWeight="bold">
                                {formatCurrency(data.total?.value)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : row.gaming ? (
                      <Box>
                        <Typography variant="h6">Casino</Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Cash In</Typography>
                            <Typography>{formatCurrency(row.gaming.coinIn)}</Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Cash Out</Typography>
                            <Typography>{formatCurrency(row.gaming.coinOut)}</Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Wager Amount</Typography>
                            <Typography>{formatCurrency(row.gaming.wagerAmount)}</Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Free Play Credit</Typography>
                            <Typography>{formatCurrency(row.gaming.fpCredit)}</Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Session Start Time</Typography>
                            <Typography>
                              {new Date(row.gaming.sessionStartDate).toLocaleString()}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Session End Time</Typography>
                            <Typography>
                              {new Date(row.gaming.sessionEndDate).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <NoData>No transactions found.</NoData>
                    )}
                  </Box>
                  
                  <Box flex="50%" className="m-30 w-50p">
                    {row.summary && (
                      <Box>
                        <Typography variant="h6">Summary</Typography>
                        <Box>
                          {row.summary.map((summary: any, i: number) => (
                            <Box 
                              key={i} 
                              display="flex" 
                              justifyContent="space-between" 
                              alignItems="center" 
                              className="font-size-medium mb-20"
                            >
                              <Typography color="textSecondary">{summary.key}</Typography>
                              <Typography>{formatCurrency(summary.value)}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const PurchaseHistory: React.FC = () => {
  const memberInfo = useSelector((state: RootState) => state.member);
  
  const { getActivityHistory } = useMember();
  const { errorAlert } = useAlertService();
  
  const [activityHistory, setActivityHistory] = useState<ActivityHistory[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const ACTIVITY_TYPE_ACCRUAL = 'Accrual';
  const ACTIVITY_STATUS_PROCESSED = 'Processed';
  const TAX_SKU = 'Tax';
  const GRATUITY = 'Gratuity';
  const DISCOUNT_SKU = 'Discount';
  
  useEffect(() => {
    if (memberInfo?._id) {
      getActivityHistory();
    }
  }, [memberInfo]);
  
  const getActivityHistory = async () => {
    setIsLoading(true);
    
    try {
      const response = await getActivityHistory(memberInfo._id);
      
      // Filter processed activities
      const history = response.filter((history) => history.status === ACTIVITY_STATUS_PROCESSED);
      
      // Sort by date (newest first)
      history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setActivityHistory(history);
      prepareTableData(history);
    } catch (error: any) {
      errorAlert(error?.error?.error || error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const prepareTableData = (history: ActivityHistory[]) => {
    const formattedData = history.map(formatHistory);
    
    formattedData.forEach((data) => {
      data.nestedData = getNestedData(data.lineItems);
      data.summary = getSummary(data.nestedData);
    });
    
    setTableData(formattedData);
    setFilteredData(formattedData);
  };
  
  const formatHistory = (history: ActivityHistory) => {
    const pointsValue = getTotalPurse(history.result?.data?.purses);
    
    return {
      date: history.date,
      bookingId: history?.ext?.folioId ? history.ext.folioId : '-',
      location: history?.location?.name ?? '-',
      desc: history.result?.data?.desc ?? '-',
      total: getPurseValue(history.result?.data?.purses, 'Status Points'),
      serviceStatusPoints: getPurseValue(history.result?.data?.purses, 'GCGC Status Points'),
      rewardUsed: pointsValue < 0 ? Math.abs(pointsValue) : 0,
      spend: history.value,
      basePoints: pointsValue,
      lob: history?.ext?.lob,
      type: history.type,
      value: history.value,
      id: history._id,
      isExpandable: history.type === ACTIVITY_TYPE_ACCRUAL,
      expanded: false,
      gaming: (history?.ext?.gaming),
      lineItems: history.lineItems.map((item: any) => ({ ...item, lob: history?.ext?.lob })),
      summary: {}
    };
  };
  
  const getPurseValue = (purses: any, type: string) => {
    const selectedPurse = purses?.find((purse: any) => purse.name === type);
    if (selectedPurse) {
      return selectedPurse?.new - selectedPurse?.prev;
    }
    return 0;
  };
  
  const getTotalPurse = (purses: any, isStatus: boolean = false) => {
    const selectedPurse = purses?.filter((purse: any) => isStatus ? purse.name.includes('Status') : !purse.name.includes('Status'));
    if (selectedPurse?.length) {
      return selectedPurse.reduce((acc: number, purse: any) => (purse.new - purse.prev) + acc, 0);
    }
    return 0;
  };
  
  const getNestedData = (lineItems: any) => {
    const nestedData: any = [];
    
    for (const key of Object.keys(LOB)) {
      const filteredItems = lineItems.filter((lineItem: any) => lineItem?.lob?.toUpperCase() === key);
      
      if (filteredItems.length) {
        nestedData.push({
          title: LOB[key as keyof typeof LOB],
          subTotal: { key: 'Subtotal', value: getTotal(filteredItems, 'Normal') },
          offers: getOffers(filteredItems, DISCOUNT_SKU),
          tax: { key: TAX_SKU, value: getTotal(filteredItems, TAX_SKU) },
          gratuity: { key: GRATUITY, value: getTotal(filteredItems, GRATUITY) },
          total: { key: 'Total ' + LOB[key as keyof typeof LOB], value: getTotal(filteredItems) }
        });
      }
    }
    
    return nestedData;
  };
  
  const getOffers = (lineItems: any, type: string) => {
    const discountItems = lineItems.filter((item: any) => item.type === type);
    const uniqueItems: Set<string> = new Set(discountItems.map((item: any) => item.itemSKU));
    
    return Array.from(uniqueItems).map((uniq) => ({
      key: uniq, 
      value: discountItems
        .filter((item: any) => item.itemSKU === uniq)
        .reduce((a: number, v: any) => a + v.itemAmount, 0)
    }));
  };
  
  const getTotal = (lineItems: any, type: string = '') => {
    return lineItems
      .filter((item: any) => !type || (type && item.type === type))
      .reduce((acc: number, val: any) => acc + val.itemAmount, 0);
  };
  
  const getSummary = (nestedData: any) => {
    if (nestedData.length) {
      const summaryData = nestedData.map((data: any) => ({ 
        key: data.title, 
        value: data.total.value 
      }));
      
      summaryData.push({ 
        key: 'Total Charges', 
        value: summaryData.reduce((acc: number, v: any) => acc + v.value, 0) 
      });
      
      return summaryData;
    }
    
    return null;
  };
  
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value) {
      const filtered = tableData.filter((row) => 
        row.desc.toLowerCase().includes(value) ||
        row.type.toLowerCase().includes(value) ||
        (row.location && row.location.toLowerCase().includes(value)) ||
        (row.bookingId && row.bookingId.toLowerCase().includes(value))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(tableData);
    }
    
    setPage(0);
  };
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" flexDirection="column" className="w-1300 mt-20" gap={3}>
        <Card className="border-gray w-100p">
          <CardContent className="pt-20">
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="flex-end" 
              gap={3} 
              className="points-header pl-15 pr-15"
            >
              <Box display="flex" alignItems="center">
                <Typography variant="h6" className="mt-13 mr-10 font-size-medium">
                  Activity History
                </Typography>
                <IconButton className="refresh-btn" onClick={getActivityHistory}>
                  <RefreshIcon />
                </IconButton>
              </Box>
              
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box className="ph-table overflow-y-auto">
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow className="agreement-table-row">
                      <TableCell>Date</TableCell>
                      <TableCell>Activity</TableCell>
                      <TableCell>Folio #</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell>Total Spend</TableCell>
                      <TableCell>Status Points</TableCell>
                      <TableCell>SP Status Points</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell aria-label="row actions">&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <Row key={index} row={row} />
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={