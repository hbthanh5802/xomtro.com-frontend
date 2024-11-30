import useDebounce from '@/hooks/useDebounce';
import locationService, { GetAutoCompleteProps } from '@/services/location.service';
import { useAppStore } from '@/store/store';
import { AutoCompleteResponseType } from '@/types/location.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { Button, Chip, Divider, IconButton, Input, Option, Select, selectClasses, Typography } from '@mui/joy';
import queryString from 'query-string';
import React from 'react';
import { IoIosCloseCircle, IoIosSearch } from 'react-icons/io';
import { MdLocationPin } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const placeholderList: Record<string, string> = {
  location: 'Nhập địa điểm bạn muốn tìm kiếm...',
};

interface MobileSearchBarProps {
  setSearchNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileSearchBar = (props: MobileSearchBarProps) => {
  const { setSearchNavOpen } = props;
  const searchId = React.useId();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [searchType, setSearchType] = React.useState('location');
  const [searchValue, setSearchValue] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<AutoCompleteResponseType[]>([]);
  const debounceSearchValue = useDebounce(searchValue, 600);

  // Lắng nghe click bên ngoài Tooltip để ẩn nó
  // useClickOutside(tooltipRef, () => {
  //   setTooltipOpen(false);
  //   setSearchResult([]);
  // });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSearchResult([]);
  };

  const { userLocation } = useAppStore(
    useShallow((state) => ({
      userLocation: state.userLocation,
    })),
  );

  const handleSearchValue = React.useCallback(
    async (value: string) => {
      setLoading(true);
      try {
        const searchParams: GetAutoCompleteProps = {
          searchValue: value,
          ...(userLocation?.longitude && { longitude: userLocation.longitude }),
          ...(userLocation?.latitude && { latitude: userLocation.latitude }),
          ...(userLocation && { radius: 200 }),
        };
        if (!value.trim()) return [];
        const response = await locationService.getAutoComplete(searchParams);
        setSearchResult(response.data);
      } catch (error) {
        console.log(handleAxiosError(error));
      } finally {
        setLoading(false);
      }
    },
    [userLocation],
  );

  const handleSearchResultClick = (searchResultValue: AutoCompleteResponseType) => {
    if (!debounceSearchValue || !searchResultValue) {
      console.error('Invalid search data');
      return;
    }
    handleReset();
    setSearchNavOpen(false);
    const qr = queryString.stringify({
      searchType,
      searchValue: debounceSearchValue,
      searchResult: searchResultValue.description,
    });
    navigate(`/search?${qr}`);
  };

  const handleReset = () => {
    setSearchValue('');
    setSearchResult([]);
  };

  React.useEffect(() => {
    if (debounceSearchValue.trim()) {
      // handleSearchValue(debounceSearchValue.trim());
    }
  }, [debounceSearchValue, handleSearchValue]);

  return (
    <React.Fragment>
      <Input
        variant='outlined'
        size='md'
        placeholder={placeholderList[searchType]}
        value={searchValue}
        onChange={handleChangeInput}
        startDecorator={
          <React.Fragment>
            <Select
              size='md'
              variant='plain'
              value={searchType}
              onChange={(_, value) => setSearchType(value!)}
              slotProps={{
                listbox: {
                  variant: 'outlined',
                },
              }}
              sx={{
                p: 0.5,
                gap: 1,
                '--ListItem-radius': 'var(--joy-radius-sm)',
                '--ListItem-padding': 1,
                [`& .${selectClasses.indicator}`]: {
                  transition: '0.2s',
                  [`&.${selectClasses.expanded}`]: {
                    transform: 'rotate(-180deg)',
                  },
                },
              }}
            >
              <Option value='location'>
                <MdLocationPin />
                Địa điểm
              </Option>
            </Select>
            <Divider orientation='vertical' />
          </React.Fragment>
        }
        endDecorator={
          <React.Fragment>
            {searchValue.trim() && (
              <IconButton onClick={handleReset}>
                <IoIosCloseCircle />
              </IconButton>
            )}
            <Button
              loading={loading}
              variant='plain'
              color='primary'
              sx={{ width: 60 }}
              onClick={() => handleSearchValue(debounceSearchValue)}
            >
              <IoIosSearch size={24} />
            </Button>
          </React.Fragment>
        }
        fullWidth
        sx={{
          boxShadow: 'sx',
          '--Input-decoratorChildHeight': '38px',
        }}
      />
      {!!searchResult.length && (
        <div className='tw-relative tw-mt-[24px]'>
          <div>
            <header className='tw-sticky tw-top-0 tw-left-0 tw-py-4 tw-flex tw-items-start tw-gap-1 tw-mb-2 tw-shadow'>
              <Chip size='sm' variant='solid' color='primary'>
                {searchResult.length}
              </Chip>
              <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-2'>
                <Typography level='title-sm'>{`Kết quả tìm kiếm cho:`}</Typography>
                <Typography color='primary' level='body-sm' noWrap>
                  {searchValue}
                </Typography>
              </div>
            </header>
            {searchResult.map((searchItem, index) => {
              return (
                <React.Fragment key={`search-result-item-${searchId}-${index}`}>
                  <div
                    className='tw-flex tw-flex-col tw-gap-1 tw-p-2 tw-rounded tw-border tw-border-transparent hover:tw-border-slate-50 hover:tw-bg-slate-100 tw-duration-150 tw-cursor-pointer'
                    onClick={() => handleSearchResultClick(searchItem)}
                  >
                    <div>
                      <Typography color='neutral' variant='plain' level='title-sm'>
                        {searchItem.mainText}
                      </Typography>
                      <Typography level='body-sm'>{searchItem.subText}</Typography>
                      <Typography textColor={`#94a3b8`} level='body-xs'>
                        {searchItem.description}
                      </Typography>
                    </div>
                  </div>
                  <Divider></Divider>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default MobileSearchBar;
