import useUrl from '@/hooks/useUrl.hook';
import { useAppStore } from '@/store/store';
import { Button, Divider, Typography } from '@mui/joy';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
// Icons
import ModalLayout from '@/components/ModalLayout';
import RHFSelect from '@/components/RHFSelect';
import RHFTextArea from '@/components/RHFTextArea';
import addressService from '@/services/address.service';
import locationService from '@/services/location.service';
import { InsertAddressDataType } from '@/types/address.type';
import { SelectOptionItemType } from '@/types/common.type';
import { DevTool } from '@hookform/devtools';
import { FormProvider, useForm } from 'react-hook-form';
import { MdAdd } from 'react-icons/md';
import { toast } from 'sonner';

function AddressForm(props: { onSuccess?: () => void }) {
  const { onSuccess } = props;
  const [loading, setLoading] = React.useState(false);
  const methods = useForm<InsertAddressDataType>({
    defaultValues: {
      provinceName: '',
      districtName: '',
      wardName: '',
    },
    mode: 'all',
  });
  const {
    control,
    watch,
    formState: { isValid },
  } = methods;
  const [selectedProvinceValue, selectedDistrictValue] = watch(['provinceName', 'districtName']);
  const provinceCode = selectedProvinceValue?.split('-')[0];
  const districtCode = selectedDistrictValue?.split('-')[0];

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
      const insetPayload: InsertAddressDataType = {
        provinceName: data.provinceName.split('-')[1],
        districtName: data.districtName.split('-')[1],
        wardName: data.wardName.split('-')[1],
        detail: data.detail,
      };
      await addressService.createUserAddress(insetPayload);
      toast.success('Thêm địa chỉ mới thành công!', { duration: 1000, id: toastId });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Thêm không thành công. Hãy kiêm tra lại thông tin hoặc thử lại sau.', {
        duration: 1500,
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

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

const AddressPage = () => {
  const { params } = useUrl();
  const navigate = useNavigate();
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  React.useEffect(() => {
    if (currentUser && Number(params.userId) !== currentUser?.userId) {
      navigate('/403');
    }
  }, [currentUser]);

  return (
    <React.Fragment>
      {/* Modal */}
      <ModalLayout isOpen={openAddModal} onCloseModal={() => setOpenAddModal(false)}>
        <AddressForm onSuccess={() => setOpenAddModal(false)} />
      </ModalLayout>
      {/*  */}
      <div className='tw-shadow-md tw-rounded-lg tw-bg-white tw-overflow-hidden tw-p-[24px]'>
        <header className='tw-flex tw-justify-between tw-items-center'>
          <Typography level='h4'>Thiết lập địa chỉ</Typography>
          <Button startDecorator={<MdAdd className='tw-text-[20px]' />} onClick={() => setOpenAddModal(true)}>
            Thêm mới
          </Button>
        </header>

        <main className='tw-my-[24px] tw-space-y-[48px]'>
          <div>
            <Divider sx={{ '--Divider-childPosition': `${0}%` }}>
              <Typography variant='plain' color='primary' level='title-sm'>
                Danh sách địa chỉ
              </Typography>
            </Divider>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

export default AddressPage;
