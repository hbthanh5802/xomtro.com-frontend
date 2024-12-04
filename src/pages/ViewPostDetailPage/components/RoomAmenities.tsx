import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import { Table } from '@mui/joy';
import React from 'react';

interface RoomAmenitiesProps {
  data: PostCardDataType;
}
const RoomAmenities = (props: RoomAmenitiesProps) => {
  const { detail } = props.data;

  const tableData = React.useMemo(() => {
    if (!detail) return [];
    return [
      { name: 'Nội thất cơ bản', value: detail.hasFurniture },
      { name: 'Sẵn kết nối Internet', value: detail.hasInternet },
      { name: 'Bảo vệ', value: detail.hasSecurity },
      { name: 'Điều hoà', value: detail.hasAirConditioner },
      { name: 'Thang máy', value: detail.hasElevator },
      { name: 'Vệ sinh khép kín', value: detail.hasPrivateBathroom },
      { name: 'Tủ lạnh', value: detail.hasRefrigerator },
      { name: 'Máy giặt', value: detail.hasWashingMachine },
      { name: 'Chỗ để xe', value: detail.hasParking },
      { name: 'Cho phép nuôi thú cưng', value: detail.allowPets },
    ];
  }, [detail]);

  return (
    <div>
      <Table borderAxis='both' aria-label='basic table'>
        <thead>
          <tr>
            <th>Tên dịch vụ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td className={item.value ? 'tw-text-primaryColor' : ''}>{item.value ? 'Có' : 'Không'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RoomAmenities;
