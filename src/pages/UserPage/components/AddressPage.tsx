import ModalLayout from '@/components/ModalLayout';
import RHFSelect from '@/components/RHFSelect';
import RHFTextArea from '@/components/RHFTextArea';
import useUrl from '@/hooks/useUrl.hook';
import addressService from '@/services/address.service';
import locationService from '@/services/location.service';
import { useAppStore } from '@/store/store';
import { InsertAddressDataType } from '@/types/address.type';
import { SelectOptionItemType } from '@/types/common.type';
import { AddressSelectSchemaType } from '@/types/schema.type';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { DevTool } from '@hookform/devtools';
import {
  Button,
  Chip,
  DialogActions,
  DialogTitle,
  Divider,
  Dropdown,
  LinearProgress,
  ListDivider,
  Menu,
  MenuButton,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/joy';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
// Icons
import { handleAxiosError } from '@/utils/constants.helper';
import { FaHouseFlag } from 'react-icons/fa6';
import { IoIosMore } from 'react-icons/io';
import { MdAdd, MdDeleteForever, MdEdit, MdOutlineInfo } from 'react-icons/md';

interface AddressFormProps {
  onSuccess?: () => void;
  mode: 'edit' | 'add';
  addressData?: AddressSelectSchemaType | null;
}

function AddressForm(props: AddressFormProps) {
  const queryClient = useQueryClient();
  const { onSuccess, mode, addressData } = props;
  const [loading, setLoading] = React.useState(false);

  const defaultAddressCode = addressData?.addressCode?.split('-');

  const methods = useForm<InsertAddressDataType>({
    defaultValues: {
      provinceName: mode === 'add' ? '' : `${defaultAddressCode?.[0]}-${addressData?.provinceName}`,
      districtName: mode === 'add' ? '' : `${defaultAddressCode?.[1]}-${addressData?.districtName}`,
      wardName: mode === 'add' ? '' : `${defaultAddressCode?.[2]}-${addressData?.wardName}`,
      detail: mode === 'add' ? '' : addressData?.detail,
    },
    mode: 'all',
  });
  const {
    control,
    watch,
    formState: { isValid },
  } = methods;
  const [selectedProvinceValue, selectedDistrictValue] = watch(['provinceName', 'districtName']);
  const provinceCode = selectedProvinceValue?.split('-')[0] || defaultAddressCode?.[0];
  const districtCode = selectedDistrictValue?.split('-')[0] || defaultAddressCode?.[1];

  const { data: getProvinceResponse } = locationService.getAllProvinces({
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const { data: getDistrictResponse } = locationService.getDistrictsByProvinceCode(Number(provinceCode), {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const { data: getWardResponse } = locationService.getWardsByDistrictCode(Number(districtCode), {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const provinceOptions = React.useMemo<SelectOptionItemType[]>(() => {
    if (getProvinceResponse) {
      const { data } = getProvinceResponse;
      return data.map((item) => {
        const { name, code } = item;
        return {
          label: name,
          value: `${code}-${name}`,
        };
      });
    }
    return [];
  }, [getProvinceResponse]);

  const districtOptions = React.useMemo<SelectOptionItemType[]>(() => {
    if (getDistrictResponse) {
      const { data } = getDistrictResponse;
      return data.map((item) => {
        const { name, code } = item;
        return {
          label: name,
          value: `${code}-${name}`,
        };
      });
    }
    return [];
  }, [getDistrictResponse]);

  const wardOptions = React.useMemo<SelectOptionItemType[]>(() => {
    if (getWardResponse) {
      const { data } = getWardResponse;
      return data.map((item) => {
        const { name, code } = item;
        return {
          label: name,
          value: `${code}-${name}`,
        };
      });
    }
    return [];
  }, [getWardResponse]);

  const handleInsertAddressSubmit = async (data: InsertAddressDataType) => {
    setLoading(true);
    const toastId = toast.loading('Đang lưu lại thông tin. Vui lòng chờ...');
    try {
      const [provinceCode, provinceName] = data.provinceName.split('-');
      const [districtCode, districtName] = data.districtName.split('-');
      const [wardCode, wardName] = data.wardName.split('-');
      const addressPayload: InsertAddressDataType = {
        provinceName: provinceName,
        districtName: districtName,
        wardName: wardName,
        detail: data.detail,
        addressCode: `${provinceCode}-${districtCode}-${wardCode}`,
      };
      if (mode === 'add') {
        await addressService.createUserAddress(addressPayload);
      } else {
        await addressService.updateUserAddress(Number(addressData?.id), addressPayload);
      }
      toast.success(mode === 'add' ? 'Thêm địa chỉ mới thành công!' : 'Chỉnh sửa thành công!', {
        duration: 1000,
        id: toastId,
      });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Lưu lại không thành công. Hãy kiêm tra lại thông tin hoặc thử lại sau.', {
        duration: 1500,
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'edit' && !addressData) {
    return <Typography level='body-xs'>Chưa lấy được dữ liệu. Vui lòng thử lại sau.</Typography>;
  }

  return (
    <div className='tw-w-[400px]'>
      <header className='tw-space-y-[8px]'>
        <Typography level='title-md'>Thêm địa chỉ mới</Typography>
        <Typography level='body-sm'>
          Hãy hoàn thành những thông tin được yêu cầu dưới đây để thêm một địa chỉ mới của bạn.
        </Typography>
        <Divider orientation='horizontal' />
      </header>
      <main className='tw-py-[24px]'>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleInsertAddressSubmit)} className='tw-flex tw-flex-col tw-gap-4'>
            <RHFSelect<InsertAddressDataType>
              disabled={!provinceOptions.length}
              name='provinceName'
              control={control}
              label='Tỉnh/Thành phố'
              placeholder='Chọn Tỉnh/Thành phố'
              options={provinceOptions}
              required
            />

            <RHFSelect<InsertAddressDataType>
              disabled={!districtOptions.length}
              name='districtName'
              control={control}
              label='Quận/Huyện:'
              placeholder='Chọn Quận/Huyện'
              options={districtOptions}
              required
            />

            <RHFSelect<InsertAddressDataType>
              disabled={!wardOptions.length}
              name='wardName'
              control={control}
              label='Phường/Xã/Thị trấn:'
              placeholder='Chọn Phường/Xã/Thị trấn'
              options={wardOptions}
              required
            />

            <RHFTextArea<InsertAddressDataType>
              name='detail'
              label='Thông tin chi tiết:'
              placeholder='Số nhà, ngõ, xóm, đường, phố... (nếu có)'
              minRows={2}
              size='sm'
            />

            <div className='tw-text-right tw-pt-[24px]'>
              <Button fullWidth disabled={!isValid || loading} loading={loading} type='submit'>
                Lưu lại
              </Button>
            </div>
          </form>
          <DevTool control={control} />
        </FormProvider>
      </main>
    </div>
  );
}

function DeleteAddressForm(props: Omit<AddressFormProps, 'mode'>) {
  const { onSuccess = () => {}, addressData } = props;
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const toastId = toast.loading('Đang xoá, vui lòng chờ...');
    try {
      if (!addressData) return;
      await addressService.deleteUserAddress([addressData.id]);
      toast.success('Xoá thành công!', { duration: 1000, id: toastId });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      onSuccess();
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Xoá không thành công. Hãy thử lại sau!', { duration: 1500, id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='tw-w-[400px]'>
      <DialogTitle>
        <span className='tw-flex tw-items-center tw-justify-center'>
          <MdOutlineInfo />
        </span>
        Xác nhận xoá địa chỉ?
      </DialogTitle>
      <div className='tw-my-2'>
        <Divider />
      </div>
      <Typography level='body-md'>Hành động "Xác nhận" sẽ xoá vĩnh viễn dữ liệu địa chỉ này của bạn.</Typography>
      <DialogActions>
        <Button variant='solid' color='danger' disabled={loading} loading={loading} onClick={handleDelete}>
          Xác nhận
        </Button>
        <Button variant='plain' color='neutral' onClick={onSuccess}>
          Trở lại
        </Button>
      </DialogActions>
    </div>
  );
}

const AddressPage = () => {
  const queryClient = useQueryClient();
  const addressId = React.useId();
  const { params } = useUrl();
  const navigate = useNavigate();
  const [openAddEditModal, setOpenAddEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [chosenAddress, setChosenAddress] = React.useState<AddressSelectSchemaType | null>(null);
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const { data: getAllAddressResponse, isFetching } = addressService.getAllUserAddresses({
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  const userAddressList = getAllAddressResponse?.data;

  const handleEditClick = (addressData: AddressSelectSchemaType) => {
    setChosenAddress(addressData);
    setOpenAddEditModal(true);
  };

  const handleDeleteClick = (addressData: AddressSelectSchemaType) => {
    setChosenAddress(addressData);
    setOpenDeleteModal(true);
  };

  const handleSetDefaultClick = async (addressData: AddressSelectSchemaType) => {
    const toastId = toast.loading('Đang đặt làm mặc định. Vui lòng chờ...');
    try {
      await addressService.setUserDefaultAddress(addressData.id);
      toast.success('Đặt làm mặc định thành công!', { duration: 1000, id: toastId });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'addresses', { isDefault: true }] });
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!', { duration: 1500, id: toastId });
    }
  };

  const handleFormSuccess = () => {
    setChosenAddress(null);
    setOpenAddEditModal(false);
    setOpenDeleteModal(false);
  };

  React.useEffect(() => {
    if (currentUser && Number(params.userId) !== currentUser?.userId) {
      navigate('/404');
    }
  }, [currentUser, navigate, params.userId]);

  return (
    <React.Fragment>
      {/* Add/Edit Modal */}
      <ModalLayout isOpen={openAddEditModal} onCloseModal={handleFormSuccess}>
        <AddressForm mode={chosenAddress ? 'edit' : 'add'} addressData={chosenAddress} onSuccess={handleFormSuccess} />
      </ModalLayout>
      {/* Delete Modal */}
      <ModalLayout isOpen={openDeleteModal} onCloseModal={handleFormSuccess}>
        <DeleteAddressForm addressData={chosenAddress} onSuccess={handleFormSuccess} />
      </ModalLayout>
      {/*  */}
      <div className='tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden tw-p-[24px]'>
        <header className='tw-flex tw-justify-between tw-items-center'>
          <Typography level='h4'>Thiết lập địa chỉ</Typography>
          <Button startDecorator={<MdAdd className='tw-text-[20px]' />} onClick={() => setOpenAddEditModal(true)}>
            Thêm mới
          </Button>
        </header>

        <main className='tw-my-[24px] tw-space-y-[48px] tw-max-w-full tw-overflow-hidden'>
          <div>
            <Divider sx={{ '--Divider-childPosition': `${0}%` }}>
              <div className='tw-inline-flex tw-items-center tw-gap-2'>
                <Typography variant='plain' color='primary' level='title-sm'>
                  Danh sách địa chỉ
                </Typography>
                {isFetching ? (
                  <div className='tw-w-[100px] tw-text-center'>
                    <LinearProgress color='primary' determinate={false} value={35} variant='soft' />
                  </div>
                ) : (
                  <Chip size='sm' color='primary' variant='solid'>
                    Số lượng: {userAddressList?.length}
                  </Chip>
                )}
              </div>
            </Divider>
            <div className='tw-py-4 tw-space-y-4'>
              {userAddressList?.map((address, index) => {
                return (
                  <div
                    key={`address-${addressId}-${index}`}
                    className='tw-border tw-border-slate-50 tw-rounded tw-p-[12px] tw-flex tw-items-start tw-justify-between tw-gap-4 hover:tw-border-primaryColor hover:tw-bg-primaryColor/[.01] tw-duration-200'
                  >
                    <div className='user-address-left-tab tw-flex tw-items-start tw-gap-4'>
                      <Chip size='sm'>{index + 1}</Chip>
                      <div className='tw-flex tw-flex-col tw-gap-2'>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <Typography level='title-sm'>Tỉnh/Thành phố:</Typography>
                          <Typography level='body-sm'>{address.provinceName}</Typography>
                        </div>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <Typography level='title-sm'>Quận/Huyện:</Typography>
                          <Typography level='body-sm'>{address.districtName}</Typography>
                        </div>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <Typography level='title-sm'>Phường/Xã/Thị trấn:</Typography>
                          <Typography level='body-sm'>{address.wardName}</Typography>
                        </div>
                        <div className='tw-flex tw-items-center tw-gap-2'>
                          <Typography level='title-sm'>Chi tiết:</Typography>
                          <Typography level='body-sm'>{address.detail || 'Chưa có thông tin'}</Typography>
                        </div>
                      </div>
                    </div>
                    <div className='user-address-right-tab tw-flex tw-flex-col tw-items-end tw-gap-2'>
                      {address.isDefault && (
                        <Chip color='success' size='sm'>
                          Mặc định
                        </Chip>
                      )}
                      <Typography level='body-xs'>
                        {formatTimeForVietnamese(new Date(address.createdAt!), 'DD/MM/YYYY')}
                      </Typography>
                      <Dropdown>
                        <MenuButton
                          variant='plain'
                          size='sm'
                          sx={{ maxWidth: '32px', maxHeight: '32px', borderRadius: '9999999px' }}
                        >
                          <Tooltip title='Thiệt lập thêm' arrow placement='top-start'>
                            <Chip size='sm' color='neutral' variant='soft'>
                              <IoIosMore />
                            </Chip>
                          </Tooltip>
                        </MenuButton>
                        <Menu
                          placement='bottom-end'
                          size='sm'
                          sx={{
                            zIndex: '99999',
                            p: 1,
                            gap: 1,
                            '--ListItem-radius': 'var(--joy-radius-sm)',
                          }}
                        >
                          {/* Edit */}
                          <MenuItem onClick={() => handleEditClick(address)}>
                            <div className='tw-flex tw-items-center tw-gap-2'>
                              <MdEdit className='tw-flex tw-text-lg tw-text-slate-600' />
                              Chỉnh sửa
                            </div>
                          </MenuItem>
                          {/* Set Default */}
                          {!address.isDefault && (
                            <MenuItem onClick={() => handleSetDefaultClick(address)} color='success'>
                              <div className='tw-flex tw-items-center tw-gap-2'>
                                <FaHouseFlag className='tw-flex tw-text-lg' />
                                Đặt làm mặc định
                              </div>
                            </MenuItem>
                          )}
                          <ListDivider />
                          {/* Delete */}
                          <MenuItem color='danger' onClick={() => handleDeleteClick(address)}>
                            <div className='tw-flex tw-items-center tw-gap-2'>
                              <MdDeleteForever className='tw-flex tw-text-lg' />
                              Xoá
                            </div>
                          </MenuItem>
                        </Menu>
                      </Dropdown>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default AddressPage;
