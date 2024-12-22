import useDebounce from '@/hooks/useDebounce';
import locationService, { GetAutoCompleteProps } from '@/services/location.service';
import { useAppStore } from '@/store/store';
import { AutoCompleteResponseType, GeocodingForwardResponseType } from '@/types/location.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { Button, Chip, Divider, IconButton, Input, InputProps, Tooltip, Typography } from '@mui/joy';
import React from 'react';
import { IoIosCloseCircle, IoIosSearch } from 'react-icons/io';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const handleGenerateSearchResult = (
  searchValue: string,
  searchResult: AutoCompleteResponseType[],
  handleSearchResultClick: (searchResultValue: AutoCompleteResponseType) => void,
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const searchId = React.useId();
  return (
    <div className='tw-relative tw-max-w-[600px] tw-max-h-[40dvh] tw-overflow-y-auto'>
      {!searchResult.length && (
        <div className='tw-py-[24px]'>
          <Typography level='title-md'>Không có thấy kết quả tìm kiếm</Typography>
        </div>
      )}
      <div>
        <header className='tw-sticky tw-top-0 tw-left-0 tw-p-1 tw-flex tw-items-start tw-gap-1 tw-mb-2 tw-bg-white tw-shadow'>
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
  );
};

interface LocationSearchBarProps {
  onSelectedResult: (selectedData: AutoCompleteResponseType, locationPoint: GeocodingForwardResponseType) => void;
}
const LocationSearchBar = (props: LocationSearchBarProps & InputProps) => {
  const { onSelectedResult, ...others } = props;
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [searchResult, setSearchResult] = React.useState<AutoCompleteResponseType[]>([]);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const debounceSearchValue = useDebounce(searchValue, 600);
  const tooltipRef = React.useRef<HTMLDivElement | null>(null);

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
        setTooltipOpen(true);
      } catch (error) {
        console.log(handleAxiosError(error));
      } finally {
        setLoading(false);
      }
    },
    [userLocation],
  );

  const handleSearchResultClick = async (searchResultValue: AutoCompleteResponseType) => {
    if (!debounceSearchValue || !searchResultValue) {
      toast.error('Vui lòng nhập kết quả tìm kiếm');
      return;
    }
    setLoading(true);
    try {
      const geoCodingResponse = await locationService.getGeocodingForward(searchResultValue.description);
      if (onSelectedResult) onSelectedResult(searchResultValue, geoCodingResponse.data);
      handleReset();
      setTooltipOpen(false);
    } catch (error) {
      console.log(handleAxiosError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchValue('');
    setSearchResult([]);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltipOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <React.Fragment>
      <Tooltip
        // open={true}
        placement='bottom-start'
        open={tooltipOpen}
        title={
          <div ref={tooltipRef} className='tw-animate-fade tw-animate-duration-300'>
            {handleGenerateSearchResult(debounceSearchValue, searchResult, handleSearchResultClick)}
          </div>
        }
        variant='outlined'
        id={`search-result-tooltip`}
      >
        <Input
          variant='outlined'
          size='md'
          placeholder='Nhập địa điểm bạn muốn tìm kiếm...'
          disabled={loading}
          value={searchValue}
          onChange={handleChangeInput}
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
            '--Input-decoratorChildHeight': '38px',
            '&::before': {
              border: '1.5px solid var(--Input-focusedHighlight)',
              transform: 'scaleX(0)',
              left: '2.5px',
              right: '2.5px',
              bottom: 0,
              top: 'unset',
              transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
              borderRadius: 0,
              borderBottomLeftRadius: '64px 20px',
              borderBottomRightRadius: '64px 20px',
            },
            '&:focus-within::before': {
              transform: 'scaleX(1)',
            },
          }}
          {...others}
        />
      </Tooltip>
    </React.Fragment>
  );
};

export default LocationSearchBar;
