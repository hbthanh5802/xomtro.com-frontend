import { WhereConditionType } from '@/store/postFilterSlice';
import { Box, Card, CardContent, CardCover, Typography } from '@mui/joy';
import React, { Dispatch } from 'react';

interface RecommendPanelProps {
  setWhereConditions: Dispatch<React.SetStateAction<WhereConditionType>>;
}

const recommendedPlaceList = [
  {
    img: 'https://plus.unsplash.com/premium_photo-1691960159290-6f4ace6e6c4c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imgSet: undefined,
    label: 'Hà Nội',
    value: 'Thành phố Hà Nội',
  },
  {
    img: 'https://images.pexels.com/photos/941195/pexels-photo-941195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    imgSet:
      'https://images.pexels.com/photos/941195/pexels-photo-941195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1 1x, https://images.pexels.com/photos/941195/pexels-photo-941195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2 2x',
    label: 'Hồ Chí Minh',
    value: 'Thành phố Hồ Chí Minh',
  },
  {
    img: 'https://www.vietnambooking.com/wp-content/uploads/2018/09/dulich-danang-tan-huong-cuoc-song-ynghia-otp-dang-song-nhat-viet-nam-04-9-2019-01.jpg',
    label: 'Đà Nẵng',
    value: 'Thành phố Đà Nẵng',
  },
  {
    img: 'https://images.pexels.com/photos/27418881/pexels-photo-27418881/free-photo-of-phong-c-nh-thien-nhien-m-c-n-c.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    imgSet:
      'https://images.pexels.com/photos/27418881/pexels-photo-27418881/free-photo-of-phong-c-nh-thien-nhien-m-c-n-c.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1 1x, https://images.pexels.com/photos/27418881/pexels-photo-27418881/free-photo-of-phong-c-nh-thien-nhien-m-c-n-c.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2 2x',
    label: 'Huế',
    value: 'Tỉnh Thừa Thiên Huế',
  },
  {
    img: 'https://imagev3.vietnamplus.vn/w820/Uploaded/2024/hotnnz/2024_11_01/nha-tuong-niem-2-6407.jpg.webp',
    imgSet: undefined,
    label: 'Thái Nguyên',
    value: 'Tỉnh Thái Nguyên',
  },
  {
    img: 'https://bcp.cdnchinhphu.vn/334894974524682240/2024/7/3/can-tho-17200094947901208758595.jpg',
    imgSet: undefined,
    label: 'Cần Thơ',
    value: 'Thành phố Cần Thơ',
  },
  {
    img: 'https://i2.ex-cdn.com/crystalbay.com/files/content/2024/06/30/du-lich-nghe-an-3-1507.jpg',
    imgSet: undefined,
    label: 'Nghệ An',
    value: 'Tỉnh Nghệ An',
  },
  {
    img: 'https://file3.qdnd.vn/data/images/0/2023/03/31/nguyenthao/hai%20phong.jpg?dpi=150&quality=100&w=870',
    imgSet: undefined,
    label: 'Hải Phòng',
    value: 'Thành phố Hải Phòng',
  },
];
const RecommendPanel = (props: RecommendPanelProps) => {
  const { setWhereConditions } = props;
  const recommendedId = React.useId();

  return (
    <div className='tw-mb-[12px]'>
      <div className='tw-my-[12px]'>
        <Typography level='title-lg'>Xu hướng tìm kiếm:</Typography>
      </div>
      <Box
        component='ul'
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'nowrap', // Đảm bảo các item không xuống dòng
          p: 0,
          m: 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          listStyle: 'none',
          width: '100%',
          '& > li': {
            flex: '0 0 auto',
          },
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888', // Màu thanh cuộn
            borderRadius: 4,
          },
        }}
      >
        {recommendedPlaceList.map((item, index) => {
          return (
            <Card
              key={`RecommendedItem-${recommendedId}-${index}`}
              component='li'
              sx={{
                mb: 2,
                overflow: 'hidden',
                width: 150,
                flexBasis: 150,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  // transform: 'scale(1.05)',
                  width: 200,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                },
              }}
              onClick={() => setWhereConditions((prev) => ({ ...prev, provinceName: item.value }))}
            >
              <CardCover>
                <img src={item.img} srcSet={item.imgSet} loading='lazy' alt='' />
              </CardCover>
              <CardCover
                sx={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                }}
              />
              <CardContent>
                <Typography level='body-md' textColor='#fff' sx={{ fontWeight: 'lg', mt: { xs: 12, sm: 18 } }}>
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </div>
  );
};

export default RecommendPanel;
