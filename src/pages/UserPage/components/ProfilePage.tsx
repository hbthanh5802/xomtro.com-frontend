import { Box, Button, Chip, Divider, Tab, TabList, Tabs, Typography, tabClasses } from '@mui/joy';
import React from 'react';
// Icons
import { RiEqualizer3Line } from 'react-icons/ri';

const ProfilePage: React.FC = () => {
  const [index, setIndex] = React.useState(0);
  return (
    <div className='tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden'>
      <Box sx={{ flexGrow: 1, overflowX: 'hidden', backgroundColor: 'background.body' }}>
        <div className='tw-p-[24px] tw-space-y-4'>
          <div className='tw-flex tw-justify-between tw-items-center'>
            <Typography
              level='h4'
              endDecorator={
                <Chip size='sm' variant='solid' color='primary'>
                  20
                </Chip>
              }
            >
              Bài đăng
            </Typography>
            <Button variant='soft' color='neutral' startDecorator={<RiEqualizer3Line className='tw-text-[18px]' />}>
              Bộ lọc
            </Button>
          </div>
          <Divider orientation='horizontal'>
            <Chip variant='soft' color='primary' size='sm'>
              Loại bài đăng
            </Chip>
          </Divider>
        </div>
        <Tabs aria-label='Pipeline' value={index} onChange={(event, value) => setIndex(value as number)}>
          <TabList
            sx={{
              justifyContent: 'center',
              [`&& .${tabClasses.root}`]: {
                flex: 'initial',
                bgcolor: 'transparent',
                '&:hover': {
                  bgcolor: 'transparent',
                },
                [`&.${tabClasses.selected}`]: {
                  color: 'primary.plainColor',
                  '&::after': {
                    height: 2,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    bgcolor: 'primary.500',
                  },
                },
              },
            }}
          >
            <Tab indicatorInset>
              Cho thuê{' '}
              <Chip size='sm' variant='soft' color={index === 0 ? 'primary' : 'neutral'}>
                14
              </Chip>
            </Tab>
            <Tab indicatorInset>
              Tìm phòng{' '}
              <Chip size='sm' variant='soft' color={index === 1 ? 'primary' : 'neutral'}>
                20
              </Chip>
            </Tab>
            <Tab indicatorInset>
              Tìm người ở ghép{' '}
              <Chip size='sm' variant='soft' color={index === 2 ? 'primary' : 'neutral'}>
                8
              </Chip>
            </Tab>
            <Tab indicatorInset>
              Pass đồ{' '}
              <Chip size='sm' variant='soft' color={index === 3 ? 'primary' : 'neutral'}>
                8
              </Chip>
            </Tab>
          </TabList>
          {/* <Box
            sx={(theme) => ({
              '--bg': theme.vars.palette.background.surface,
              background: 'var(--bg)',
              boxShadow: '0 0 0 100vmax var(--bg)',
              clipPath: 'inset(0 -100vmax)',
            })}
          >
            <TabPanel value={0}>Deals</TabPanel>
            <TabPanel value={1}>Library</TabPanel>
            <TabPanel value={2}>Products</TabPanel>
          </Box> */}
        </Tabs>
      </Box>
    </div>
  );
};

export default ProfilePage;
