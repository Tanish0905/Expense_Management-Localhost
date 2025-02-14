import React, { useState,useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {useMediaQuery,Dialog,DialogTitle,DialogContent, Button,Table, Select, Box, FormControl, InputLabel, MenuItem,  TextField, TableContainer, TableHead, TableRow, TableCell, TableBody, DialogActions, Stack, TablePagination } from "@mui/material"; 
import {message } from 'antd';  
import { motion } from "framer-motion";  // For animations
import moment from "moment"
import axios from "axios";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const useStyles = makeStyles( ( theme ) => ( {
  container: {
    [ theme.breakpoints.down( 'sm' ) ]: {
      paddingTop: '50px',
      paddingLeft: '10px',
      paddingRight: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    [ theme.breakpoints.between( 'sm', 'lg' ) ]: {
      paddingTop: '50px',
      display: 'grid',
      paddingX: '20px',
      gap: '30px',
      gridTemplateColumns: 'repeat(12, 1fr)',
      width: '100%',
      height: '800px',
      gridTemplateRows: 'repeat(10, 1fr)',
      overflow: 'hidden',
    },
    [ theme.breakpoints.up( 'lg' ) ]: {
      padding: '25px',
      paddingTop: '10px',
      display: 'grid',
      gap: '20px',
      gridTemplateColumns: 'repeat(12, 1fr)',
      width: '100%',
      height: '600px',
      gridTemplateRows: 'repeat(10, 1fr)',
      overflow: 'hidden',
    }
  },
  box: {
    border: '1px solid #ddd',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)"
    },
  },
  dropdownSection: {
    [ theme.breakpoints.up( 'sm' ) ]: {
      gridColumn: '1 / span 12',
      gridRow: '1 / span 2'
    }
  },
  Table: {
    [ theme.breakpoints.up( 'sm' ) ]: {
      padding: '20px',
      paddingLeft: '0px',
      paddingRight:'0px',
      gridColumn: '1 / span 8',
      gridRow: '3 / span 8'
    }
  },
  PieChart: {
    padding: '20px',
    [ theme.breakpoints.up( 'sm' ) ]: {
      gridColumn: '9 / span 4',
      gridRow: '3 / span 8'
    }
  },
  filterSection: {
    display: 'flex',
    padding: '20px',
    justifyContent: 'space-between',
    // alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  selectStyle: {
    minWidth: '150px',
    // padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    "&:hover": {
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    }
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    width:'120px',
    '& span': {
      display: 'inline-block',
    },
    '&:hover span': {
      display: 'none',
    },
    '&:hover::before': {
      content: "'➕'", 
      display: 'block',
      textAlign: 'center',
    },
    backgroundColor: '#6200ea', // Default background color for button
    color: 'white', // Default text color
    "&:hover": {
      backgroundColor: '#c634ee', // Change background on hover
      color: '#f1f1f1', // Change text color on hover
    }
  },  tablePagination: {
    "& .MuiTablePagination-toolbar": {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: '10px',
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
      }
    },
    "& .MuiTablePagination-selectLabel": {
      margin: 0,
    },
    "& .MuiTablePagination-displayedRows": {
      margin: 0,
      [theme.breakpoints.up('sm')]: {
        marginLeft: 'auto',
      },
    },
    "& .MuiTablePagination-spacer": {
      display: 'none',
    },
    "& .MuiTablePagination-actions": {
      display: 'flex',
      gap: '0.25rem',
    },
  },
} ) );
const HomePageDashboard = () => {
  const isMobile = useMediaQuery( '(max-width:600px)' );
  const classes = useStyles();
  const [ showAddModal, setShowAddModal ] = useState( false );
  const [showEditModal, setShowEditModal] = useState(false);

  const [ refreshPage, setRefreshPage ] = useState( false );
  const [allTransaction, setAllTransaction] = useState([]);
  const [ frequency, setFrequency ] = useState( "365" );
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [editable, setEditable] = useState(null);

  const [formValues, setFormValues] = useState({
    amount: "",
    category: "",
    date: "",
    type: "",
  } );

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const getAllTransactions = async () => {

      if ((selectedDate[0] !== null && selectedDate[1] !== null && selectedDate?.length !== 0 && frequency === 'custom') || frequency !=="custom") {
        try {
          const user = JSON.parse( localStorage.getItem( "user" ) );
          const res = await axios.post( `${process.env.REACT_APP_API_URL}/transactions/get-transaction`, {
            userid: user._id,
            frequency,
            selectedDate,
            type,
          } );
          setAllTransaction( res.data );
        } catch ( error ) {
          message.error( "Fetch Issue With Tranction" );
        }
      }
  };
    getAllTransactions();
  }, [frequency, selectedDate, type,refreshPage]);

  //delete handler
  const handleDelete = async ( record ) => {

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/transactions/delete-transaction`, {
        transacationId: record._id,
      } );
      setRefreshPage(!refreshPage)
      message.success( "Transaction Deleted!" );
    } catch (error) {
      message.error("unable to delete");
    }
  };

  // form handling
  const handleAddSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
        await axios.post(`${process.env.REACT_APP_API_URL}/transactions/add-transaction`, {
          ...formValues,
          userid: user._id,
        });
        message.success("Transaction Added Successfully");
      // }
      setShowAddModal(false);
      setFormValues( { amount: "", category: "", date: "", type: "" } ); // Reset form
      setRefreshPage(!refreshPage)
    } catch (error) {
      message.error("Failed to add transaction");
    }
  };

   const handleEditSubmit = async (event) => {
     event.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
        await axios.post(`${process.env.REACT_APP_API_URL}/transactions/edit-transaction`, {
          payload: {
            ...formValues,
            userId: user._id,
          },
          transactionId: editable._id,
        });
        message.success("Transaction Updated Successfully");    
        setShowEditModal(false);
        setEditable(null);
        setFormValues( { amount: "", category: "", date: "", type: "" } ); // Reset form
        setRefreshPage(!refreshPage)
      } catch (error) {
        message.error("Failed to Edit transaction");
      }
  };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Handle page change
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0); // Reset to first page
    };

    // Slice data for pagination
    const paginatedData = allTransaction.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <motion.div 
        className={classes.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      {/* Top Filter Box */}
        <motion.div 
          className={`${classes.box} ${classes.dropdownSection}`}
          whileHover={{ scale: 1.02 }}
        >
          <div className={classes.filterSection} style={{alignItems:isMobile? 'left': "center",}} >
          <div style={ { display: "flex", alignItems:isMobile? 'left': "center", gap: "30px",flexDirection: isMobile ? 'column' : 'row', } }>
            <FormControl sx={{mr:2}}>
              <InputLabel id="frequency-label">Select Range</InputLabel>
              <Select
                labelId="frequency-label"
                id="frequency-select"
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
                label="Select Range"
                className={classes.selectStyle}
              >
                <MenuItem value="7">📅 LAST 1 Week</MenuItem>
                <MenuItem value="30">📆 LAST 1 Month</MenuItem>
                <MenuItem value="365">📊 LAST 1 Year</MenuItem>
                <MenuItem value="custom">⚙️ Custom</MenuItem>
              </Select>
            </FormControl>

            {/* Show RangePicker only when frequency is "custom" */}
              { frequency === "custom" && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateRangePicker  onChange={(values) => setSelectedate(values)} localeText={{ start: 'Check-in', end: 'Check-out' }} />
                </LocalizationProvider>
              ) }
            <FormControl sx={{ml: isMobile? 0 :2}}>
              <InputLabel id="type-label">Select Type</InputLabel>
              <Select
                labelId="type-label"
                id="type-select"
                value={type}
                onChange={(event) => setType(event.target.value)}
                label="Select Type"
                className={classes.selectStyle}
              >
                <MenuItem value="all">📂 ALL Types</MenuItem>
                <MenuItem value="income" sx={{color:'green'}} >💰 INCOME</MenuItem>
                <MenuItem value="expense" sx={{color:'red'}}>💸 EXPENSE</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Add New Button */}
          <Box>
            <Button
              variant="contained"
              className={classes.button}
                onClick={ () => {
                  setShowAddModal( true )
                  setEditable( false )
                }
              }
            >
              <span>Add New</span>
            </Button>
          </Box>
        </div>
        </motion.div>

        {/* Table Section */}
          <motion.div 
            className={`${classes.box} ${classes.Table}`} 
            whileHover={{ scale: 1.02 }}
        >
          { paginatedData?.length !== 0 ?
            <TableContainer style={ { borderRadius: '16px' } } >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={ { whiteSpace: 'nowrap' } }>Date</TableCell>
                    <TableCell style={ { whiteSpace: 'nowrap' } }>Amount</TableCell>
                    <TableCell style={ { whiteSpace: 'nowrap' } }>Type</TableCell>
                    <TableCell style={ { whiteSpace: 'nowrap' } }>Category</TableCell>
                    <TableCell style={ { whiteSpace: 'nowrap' } }>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {paginatedData?.map( ( row ) => (
                    <TableRow key={ row.id }>
                      <TableCell style={ { whiteSpace: 'nowrap' } }>{ moment( row?.date ).format( "YYYY-MM-DD" ) }</TableCell>
                      <TableCell style={ { whiteSpace: 'nowrap' } }>{ row?.amount }</TableCell>
                      <TableCell style={ { whiteSpace: 'nowrap' } }>{ row?.type }</TableCell>
                      <TableCell style={ { whiteSpace: 'nowrap' } }>{ row?.category }</TableCell>
                      <TableCell style={ { whiteSpace: 'nowrap' } }>
                        <EditIcon
                          onClick={ () => {
                            setEditable( row );
                            setFormValues( { amount: row?.amount, category: row?.category, date: row?.date, type: row?.type } ); // Reset form
                            setShowEditModal( true );
                          } }
                          style={ { cursor: "pointer", marginRight: "10px" } }
                        />
                        <DeleteIcon
                          onClick={ () => handleDelete( row ) }
                          style={ { cursor: "pointer", color: "red" } }
                        />
                      </TableCell>
                    </TableRow>
                  ) ) }
                </TableBody>
              </Table>
              
              <TablePagination
                className={ classes.tablePagination } // Use the class defined in useStyles
                rowsPerPageOptions={ [ 5, 10, 25 ] }
                component="div"
                count={ allTransaction.length }
                rowsPerPage={ rowsPerPage }
                page={ page }
                onPageChange={ handleChangePage }
                onRowsPerPageChange={ handleChangeRowsPerPage }
              />
            </TableContainer> : 
            <Box sx={{height:'200px',display:'flex',justifyContent:'center',alignItems:'center'}}>
              <h4>No Data Found !!</h4> 
            </Box> }
          </motion.div>

        {/* PieChart Section */}
        <motion.div 
          className={`${classes.box} ${classes.PieChart}`} 
          whileHover={{ scale: 1.02 }}
        >
            <AnalyticsDashboard allTransaction={allTransaction} />
        </motion.div>
      </motion.div>
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} fullWidth maxWidth="sm" sx={{maxHeight:'110%'}}>
        <DialogTitle>Add Transaction</DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddSubmit} style={{marginTop:'10px'}}>
              <Stack spacing={2}>
                <TextField 
                  label="Amount" 
                  name="amount" 
                  value={formValues.amount} 
                  onChange={handleChange} 
                  fullWidth 
                  variant="outlined"
                  required 
                />
                <FormControl fullWidth>
                  <InputLabel id="select-category">Category</InputLabel>
                  <Select
                    name="category"
                    required
                    labelId="select-category"
                    id="demo-simple-select"
                    value={formValues.category}
                    onChange={handleChange}
                    label="Category" // Add this line
                  >
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Shopping">Shopping</MenuItem>
                    <MenuItem value="Bills">Bills</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Investment">Investment</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterMoment} locale="deDE">
                  <DatePicker
                    value={formValues.date ? moment(formValues.date) : null} // Convert to moment object if it's a string
                    onChange={(newValue)=>setFormValues({
                        ...formValues,
                        date: newValue ? newValue.toISOString() : "", // Convert to ISO string or empty if null
                    } )}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    required
                  />
                </LocalizationProvider>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select required name="type" value={formValues.type} onChange={handleChange} >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            <DialogActions>
              <Button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditable(null);
                    setFormValues({ amount: "", category: "", date: "", type: "" });
                  }}
                  color="secondary"
              >
                Cancel
              </Button>
              <Button type="submit" color="primary" variant="contained">Save</Button>
              </DialogActions>
            </form>
          </DialogContent>
      </Dialog>
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} fullWidth maxWidth="sm" sx={{maxHeight:'110%'}}>
        <DialogTitle>Edit Transaction</DialogTitle>
          <DialogContent>
            <form onSubmit={handleEditSubmit} style={{marginTop:'10px'}}>
              <Stack spacing={2}>
                <TextField 
                  label="Amount" 
                  name="amount" 
                  value={formValues.amount} 
                  onChange={handleChange} 
                  fullWidth 
                  variant="outlined"
                  required 
                />
                <FormControl fullWidth>
                  <InputLabel id="select-category">Category</InputLabel>
                  <Select
                    name="category"
                    required
                    labelId="select-category"
                    id="demo-simple-select"
                    value={formValues.category}
                    onChange={handleChange}
                    label="Category" // Add this line
                  >
                    <MenuItem value="Food">Food</MenuItem>
                    <MenuItem value="Shopping">Shopping</MenuItem>
                    <MenuItem value="Bills">Bills</MenuItem>
                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                    <MenuItem value="Investment">Investment</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterMoment} locale="deDE">
                  <DatePicker
                    value={formValues.date ? moment(formValues.date) : null} // Convert to moment object if it's a string
                    onChange={(newValue)=>setFormValues({
                        ...formValues,
                        date: newValue ? newValue.toISOString() : "", // Convert to ISO string or empty if null
                    } )}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    required
                  />
                </LocalizationProvider>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select required name="type" label='Type' value={formValues.type} onChange={handleChange} >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <DialogActions>
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditable(null);
                    setFormValues({ amount: "", category: "", date: "", type: "" });
                  }}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" variant="contained">Save</Button>
              </DialogActions>
            </form>
          </DialogContent>
      </Dialog>
      </>
  );
};

export default HomePageDashboard;
