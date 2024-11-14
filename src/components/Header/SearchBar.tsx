import { IconButton, Input } from '@mui/joy';
import React from 'react';
import { IoIosSearch } from 'react-icons/io';

const SearchBar: React.FC = () => {
  return (
    <div>
      <Input
        size='md'
        placeholder='Nhập thông tin tìm kiếm của bạn'
        endDecorator={
          <IconButton variant='solid' color='primary' sx={{ width: 60 }}>
            <IoIosSearch size={22} />
          </IconButton>
        }
        fullWidth
        sx={{
          boxShadow: 'sx',
          '--Input-decoratorChildHeight': '32px',
        }}
      />
    </div>
  );
};

export default SearchBar;
