import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Tooltip } from "@mui/material";

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)', 

  backgroundColor: alpha(theme.palette.common.white, 0.25),
  display: 'flex',
  justifyContent: 'center',
  alignItems:'center',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: '-100px',
  
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft:'0px',
  marginTop:'24px',
  marginRight:'247px',

}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  marginLeft:'0px',
  marginRight:'0px',
  marginTop:'30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems:'center',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

export default function SearchBar({ placeholder, value, onChange, tooltipTitle }) {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Tooltip title={tooltipTitle}>
      <StyledInputBase
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        inputProps={{ 'aria-label': 'search' }}
      /></Tooltip>
    </Search>
  );
}
