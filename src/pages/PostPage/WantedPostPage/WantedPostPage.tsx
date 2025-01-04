/* eslint-disable @typescript-eslint/no-explicit-any */
import RHFCurrencyInput from '@/components/RHFCurrencyInput';
import RHFDatePicker from '@/components/RHFDatePicker';
import RHFImageUploadPreview from '@/components/RHFImageUploadPreview';
import RHFInput from '@/components/RHFInput';
import RHFNumberInput from '@/components/RHFNumberInput';
import RHFRadioGroup from '@/components/RHFRadioGroup';
import RHFRichText from '@/components/RHFRichText';
import RHFSelect from '@/components/RHFSelect';
import RHFTextArea from '@/components/RHFTextArea';
import useUrl from '@/hooks/useUrl.hook';
import locationService from '@/services/location.service';
import postService from '@/services/post.service';
import { useAppStore } from '@/store/store';
import { SelectOptionItemType } from '@/types/common.type';
import { InsertWantedPostDataType } from '@/types/post.type';
import { AssetSelectSchemaType, PostSelectSchemaType, WantedPostSelectSchemaType } from '@/types/schema.type';
import { formatCurrencyVND, handleAxiosError, maxPriceLimitation } from '@/utils/constants.helper';
import { formatDateForInput, timeInVietNam } from '@/utils/time.helper';
import { insertWantedPostValidation } from '@/validations/post.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AspectRatio, Button, Chip, Divider, Typography } from '@mui/joy';
import React from 'react';
import { Control, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { MdDeleteOutline, MdOutlineInfo } from 'react-icons/md';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const expirationAfterOptions: SelectOptionItemType[] = [
  {
    label: 'Giờ',
    value: 'hour',
  },
  {
    label: 'Ngày',
    value: 'day',
  },
  {
    label: 'Tuần',
    value: 'week',
  },
  {
    label: 'Tháng',
    value: 'month',
  },
];

const totalAreaUnitOptions: SelectOptionItemType[] = [
  {
    label: 'Mét vuông',
    value: 'm2',
  },
  {
    label: 'Centimet vuông',
    value: 'cm2',
  },
];

interface AddressPostFormProps {
  control: Control<InsertWantedPostDataType>;
  mode: 'create' | 'edit';
  data?: any;
}
function AddressPostForm(props: AddressPostFormProps) {
  const { control, mode, data } = props;

  const defaultAddressCode = data?.addressCode?.split('-');

  const [selectedProvinceValue, selectedDistrictValue] = useWatch({
    control,
    name: ['addressProvince', 'addressDistrict'],
  });
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

  if (mode === 'edit' && !data) {
    return <Typography level='body-xs'>Chưa lấy được dữ liệu. Vui lòng thử lại sau.</Typography>;
  }

  return (
    <div className='tw-mt-[24px] tw-flex tw-flex-col tw-gap-4'>
      <div className='tw-grid tw-grid-cols-1 tablet:tw-grid-cols-3 tw-gap-4'>
        <RHFSelect<InsertWantedPostDataType>
          disabled={!provinceOptions.length}
          name='addressProvince'
          control={control}
          label='Tỉnh/Thành phố'
          placeholder='Chọn Tỉnh/Thành phố'
          options={provinceOptions}
          required
        />

        <RHFSelect<InsertWantedPostDataType>
          disabled={!districtOptions.length}
          name='addressDistrict'
          control={control}
          label='Quận/Huyện:'
          placeholder='Chọn Quận/Huyện'
          options={districtOptions}
          required
        />

        <RHFSelect<InsertWantedPostDataType>
          disabled={!wardOptions.length}
          name='addressWard'
          control={control}
          label='Phường/Xã/Thị trấn:'
          placeholder='Chọn Phường/Xã/Thị trấn'
          options={wardOptions}
          required
        />
      </div>

      <RHFInput<InsertWantedPostDataType>
        name='addressDetail'
        label='Thông tin chi tiết:'
        placeholder='Số nhà, ngõ, xóm, đường, phố... (nếu có)'
      />
    </div>
  );
}

const WantedPostPage = () => {
  const navigate = useNavigate();
  const { params, state } = useUrl();
  const assetId = React.useId();
  const mode = params?.mode as 'create' | 'edit';
  const postData = state?.postData;
  const detail: WantedPostSelectSchemaType = mode === 'edit' && postData ? postData.detail : null;
  const post: PostSelectSchemaType = mode === 'edit' && postData ? postData.post : null;
  const assets: AssetSelectSchemaType[] = mode === 'edit' && postData ? postData.assets : [];
  const [assetList, setAssetList] = React.useState(() => (mode === 'edit' && assets ? assets : []));

  const [loading, setLoading] = React.useState(false);

  const defaultAddressCode = post?.addressCode?.split('-');

  const methods = useForm<InsertWantedPostDataType>({
    defaultValues: {
      type: 'wanted',
      title: mode === 'create' ? '' : post?.title,
      description: mode === 'create' ? '' : post?.description,
      expirationAfter: mode === 'create' ? null : post?.expirationAfter,
      expirationAfterUnit: mode === 'create' ? 'day' : post?.expirationAfterUnit,
      moveInDate: mode === 'create' ? undefined : formatDateForInput(detail?.moveInDate),
      totalArea: mode === 'create' ? null : detail?.totalArea,
      totalAreaUnit: mode === 'create' ? 'm2' : detail?.totalAreaUnit,
      hasFurniture: mode === 'create' ? false : detail?.hasFurniture,
      hasAirConditioner: mode === 'create' ? false : detail?.hasAirConditioner,
      hasWashingMachine: mode === 'create' ? false : detail?.hasWashingMachine,
      hasRefrigerator: mode === 'create' ? false : detail?.hasRefrigerator,
      hasPrivateBathroom: mode === 'create' ? false : detail?.hasPrivateBathroom,
      hasParking: mode === 'create' ? false : detail?.hasParking,
      hasSecurity: mode === 'create' ? false : detail?.hasSecurity,
      hasElevator: mode === 'create' ? false : detail?.hasElevator,
      hasInternet: mode === 'create' ? false : detail?.hasInternet,
      allowPets: mode === 'create' ? false : detail?.allowPets,
      priceStart: mode === 'create' ? undefined : detail?.priceStart,
      priceEnd: mode === 'create' ? undefined : detail?.priceEnd === detail?.priceStart ? undefined : detail?.priceEnd,
      note: mode === 'create' ? undefined : post?.note,
      addressCode: mode === 'create' ? '' : post?.addressCode,
      addressProvince: mode === 'create' ? undefined : `${defaultAddressCode?.[0]}-${post?.addressProvince}`,
      addressDistrict: mode === 'create' ? undefined : `${defaultAddressCode?.[1]}-${post?.addressDistrict}`,
      addressWard: mode === 'create' ? undefined : `${defaultAddressCode?.[2]}-${post?.addressWard}`,
      addressDetail: mode === 'create' ? undefined : post?.addressDetail,
    },
    resolver: zodResolver(insertWantedPostValidation),
  });
  const {
    control,
    formState: { isValid },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets' as never,
  });

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const handleRemoveAsset = async (assetId: number) => {
    setLoading(true);
    const toastId = toast.loading('Đang xoá, vui lòng chờ...');
    try {
      await postService.removePostAssets(post.id, [assetId]);
      toast.success('Xoá thành công', { duration: 1000, id: toastId });
      setAssetList((prev) => prev.filter((item) => item.id !== assetId));
    } catch (error) {
      console.log(handleAxiosError(error));
      toast.error('Xoá không thành công. Vui lòng thử lại sau.', { duration: 1500, id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data: InsertWantedPostDataType) => {
    setLoading(true);
    const toastId = toast.loading('Đang đăng tải bài viết của bạn. Vui lòng chờ...');

    try {
      // Hàm tách dữ liệu địa chỉ
      const parseAddress = (address: string) => {
        const [code, name] = address.split('-');
        return { code, name };
      };

      // Xử lý các trường địa chỉ
      const { code: provinceCode, name: provinceName } = parseAddress(data.addressProvince);
      const { code: districtCode, name: districtName } = parseAddress(data.addressDistrict);
      const { code: wardCode, name: wardName } = parseAddress(data.addressWard);

      // Chuẩn bị payload
      const postPayload: InsertWantedPostDataType = {
        ...data,
        addressCode: `${provinceCode}-${districtCode}-${wardCode}`,
        addressProvince: provinceName,
        addressDistrict: districtName,
        addressWard: wardName,
      };

      // Nếu cần upload file (nếu không, bỏ đoạn này đi)
      const formData = new FormData();
      Object.entries(postPayload).forEach(([key, value]) => {
        if (key === 'assets' && Array.isArray(value)) {
          // Lặp qua từng file trong FileList và append
          value?.forEach((file: FileList) => {
            formData.append(key, file[0]);
          });
        } else if (Array.isArray(value)) {
          // Nếu là array (nhưng không phải FileList)
          value.forEach((v: unknown) => formData.append(key, v as string));
        } else {
          // Các trường khác
          formData.append(key, value as string);
        }
      });
      // console.log('formData', data, console.log(Object.fromEntries(formData)));
      // Gửi request
      if (mode === 'create') {
        await postService.createWantedPost(formData as any);
      } else if (mode === 'edit') {
        await postService.updateWantedPost(post.id, formData as any);
      }

      // Thông báo thành công
      toast.success('Thành công! Bài viết của bạn đã được lưu lại thông tin.', {
        id: toastId,
        duration: 1000,
      });
      navigate(`/users/${currentUser?.userId}/profile`);
    } catch (error) {
      console.error(handleAxiosError(error));
      toast.error('Không thành công! Hãy kiểm tra lại thông tin hoặc thử lại sau.', {
        id: toastId,
        duration: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!['create', 'edit'].includes(mode)) {
    return <Navigate to={'/404'} />;
  }

  if (mode === 'edit' && !postData) {
    return <Navigate to={'/404'} />;
  }

  return (
    <div className='tw-container tw-bg-white tw-shadow tw-p-[24px] tw-rounded tw-min-h-[100px] tw-mt-[40px]'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitForm)}>
          {/* Header */}
          <header>
            <Typography level='h4'>{mode === 'create' ? 'Tạo bài viết mới' : 'Chỉnh sửa bài viết'}</Typography>
            <Typography level='body-sm'>
              Hãy hoàn thành những thông tin được yêu cầu dưới đây để tiến hành đăng bài viết mới.
            </Typography>
          </header>
          {/* Body  */}
          <main>
            <div className='tw-flex tw-flex-col laptop:tw-flex-row tw-gap-[40px]'>
              <div className='laptop:tw-w-[600px] tw-my-[24px]'>
                <Divider sx={{ '--Divider-childPosition': `${0}%`, margin: '8px 0 8px 0' }}>
                  <div className='tw-inline-flex tw-items-center tw-gap-2'>
                    <Typography variant='plain' color='primary' level='title-sm'>
                      Thông tin cơ bản
                    </Typography>
                  </div>
                </Divider>
                <div className='tw-space-y-4'>
                  {/* Title */}
                  <RHFInput<InsertWantedPostDataType>
                    name='title'
                    label='Tiêu đề:'
                    placeholder='Nhập tiêu đề bài viết...'
                    required
                  />
                  {/* Description */}
                  <RHFRichText<InsertWantedPostDataType>
                    control={control}
                    name='description'
                    label='Mô tả thêm:'
                    placeholder='Hãy viết thêm mô tả cho bài viết...'
                  />
                  {/* Expiration time */}
                  <div className='tw-space-y-2'>
                    <div className='tw-flex tw-flex-col tablet:tw-flex-row tablet:tw-items-center tw-gap-2'>
                      <RHFNumberInput<InsertWantedPostDataType>
                        name='expirationAfter'
                        label='Ẩn bài viết sau:'
                        placeholder='Vd: 2'
                        min={0}
                      />
                      <RHFSelect<InsertWantedPostDataType>
                        control={control}
                        name='expirationAfterUnit'
                        label='Đơn vị thời gian'
                        placeholder='Chọn đơn vị thời gian'
                        minWidth={200}
                        options={expirationAfterOptions}
                      />
                    </div>
                    <div className='tw-flex tw-gap-2 tw-items-center'>
                      <span className='tw-text-[16px]'>
                        <MdOutlineInfo />
                      </span>
                      <Typography level='body-sm' color='neutral' variant='plain' textAlign={'justify'}>
                        Bài viết sẽ tự động ẩn đi sau một thời gian nếu bạn thiết lập thông tin này.
                      </Typography>
                    </div>
                  </div>
                  {/* Note */}
                  <RHFTextArea<InsertWantedPostDataType>
                    control={control}
                    name='note'
                    label='Ghi chú thêm:'
                    placeholder='Bạn có thể ghi chú thêm thông tin ở đây (chảng hạn như thêm thông tin liên hệ, thời gian, địa điểm,...)...'
                    minRows={4}
                  />
                </div>
              </div>
              <div className='laptop:tw-w-[600px] tw-my-[24px]'>
                <Divider sx={{ '--Divider-childPosition': `${0}%`, margin: '8px 0 8px 0' }}>
                  <div className='tw-inline-flex tw-items-center tw-gap-2'>
                    <Typography variant='plain' color='primary' level='title-sm'>
                      Thông tin về phòng muốn thuê
                    </Typography>
                  </div>
                </Divider>
                <div className='tw-space-y-4'>
                  {/* Price */}
                  <div className='tw-flex tw-flex-col tablet:tw-flex-row tw-flex-wrap tablet:tw-items-start tw-gap-2'>
                    <div className='tw-flex-1'>
                      <RHFCurrencyInput<InsertWantedPostDataType>
                        startDecorator={'VNĐ'}
                        name='priceStart'
                        required
                        label='Giá thuê khởi điểm (/tháng):'
                        placeholder='Nhập giá khởi điểm...'
                        max={maxPriceLimitation}
                      />
                    </div>
                    <div className='tw-flex-1'>
                      <RHFCurrencyInput<InsertWantedPostDataType>
                        startDecorator={'VNĐ'}
                        name='priceEnd'
                        label='Giá kết thúc (/tháng):'
                        placeholder='Giá kết thúc...'
                        max={maxPriceLimitation}
                      />
                    </div>
                    <Typography level='body-sm' startDecorator={<IoMdInformationCircleOutline />}>
                      Tối đa:
                      <Typography sx={{ px: 0.5 }} level='title-sm'>
                        {formatCurrencyVND(maxPriceLimitation)}
                      </Typography>{' '}
                    </Typography>
                  </div>
                  {/* Move ind Date */}
                  <div className='tablet:tw-flex tw-flex-1 tablet:tw-items-center tw-gap-2 tw-flex-wrap'>
                    <RHFDatePicker<InsertWantedPostDataType>
                      name='moveInDate'
                      label='Ngày có thể chuyển vào:'
                      placeholder='Nhập ngày có thể chuyển vào...'
                      minDate={timeInVietNam().toDate()}
                      required
                    />
                  </div>
                  {/* Total area */}
                  <div className='tw-flex tw-flex-col tablet:tw-flex-row tablet:tw-items-center tw-gap-2 tw-flex-wrap'>
                    <RHFNumberInput<InsertWantedPostDataType>
                      name='totalArea'
                      label='Diện tích mong muốn:'
                      placeholder='Vd: 25'
                      min={0}
                      required
                    />
                    <RHFSelect<InsertWantedPostDataType>
                      control={control}
                      name='totalAreaUnit'
                      label='Đơn vị diện tích'
                      placeholder='Chọn đơn vị diện tích'
                      minWidth={200}
                      options={totalAreaUnitOptions}
                    />
                  </div>
                  {/* Room Amenities */}
                  <Divider sx={{ '--Divider-childPosition': `${0}%`, margin: '8px 0 8px 0' }}>
                    <div className='tw-inline-flex tw-items-center tw-gap-2'>
                      <Typography variant='plain' color='primary' level='title-sm'>
                        Thông tin dịch vụ, tiện ích
                      </Typography>
                    </div>
                  </Divider>
                  <div className='tw-grid tw-grid-cols-1 tablet:tw-grid-cols-2 tw-gap-2 tw-gap-x-4'>
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasFurniture'
                      label='Có sẵn nội thất cơ bản (Giường, tủ quần áo):'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasAirConditioner'
                      label='Có điều hoà:'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasElevator'
                      label='Có thang máy:'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasParking'
                      label='Có bãi đỗ xe:'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasPrivateBathroom'
                      label='Có phòng vệ sinh riêng:'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasRefrigerator'
                      label='Có sẵn tủ lạnh:'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasSecurity'
                      label='Có bảo vệ:'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasWashingMachine'
                      label='Có máy giặt:'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='hasInternet'
                      label='Có sẵn Internet:'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                    <RHFRadioGroup<InsertWantedPostDataType>
                      control={control}
                      name='allowPets'
                      label='Cho phép nuôi thú cưng (pet):'
                      direction='horizontal'
                      options={[
                        {
                          label: 'Có',
                          value: true,
                        },
                        {
                          label: 'Không',
                          value: false,
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Address */}
            <div className='tw-mt-[24px]'>
              <Divider sx={{ '--Divider-childPosition': `${0}%`, margin: '8px 0 8px 0' }}>
                <div className='tw-inline-flex tw-items-center tw-gap-2'>
                  <Typography variant='plain' color='primary' level='title-sm'>
                    Thông tin địa chỉ
                  </Typography>
                </div>
              </Divider>
              <AddressPostForm control={control} mode={mode} data={postData} />
            </div>
            {/* Assets */}
            <div className='tw-mt-[24px]'>
              <Divider sx={{ '--Divider-childPosition': `${0}%`, margin: '8px 0 8px 0' }}>
                <div className='tw-inline-flex tw-items-center tw-gap-2'>
                  <Typography variant='plain' color='primary' level='title-sm'>
                    Hình ảnh
                  </Typography>
                </div>
              </Divider>
              <div className='tw-flex tw-flex-wrap tw-gap-[24px] tw-items-start'>
                {assetList.map((assetItem, index) => {
                  return (
                    <div className='tw-relative tw-w-[200px] tw-border tw-rounded-lg' key={`asset-${assetId}-${index}`}>
                      <div className='tw-absolute tw-right-0 tw-top-0 tw-translate-x-1/2 -tw-translate-y-1/2 tw-z-20'>
                        <Chip color='danger' variant='solid' size='md' onClick={() => handleRemoveAsset(assetItem.id)}>
                          <MdDeleteOutline className='tw-text-[18px]' />
                        </Chip>
                      </div>
                      <AspectRatio ratio={'1/1'} objectFit='contain'>
                        <img src={assetItem?.url} alt='Hình ảnh' />
                      </AspectRatio>
                    </div>
                  );
                })}
                {fields.map((field, index) => {
                  return (
                    <div className='tw-relative tw-w-[200px] tw-border tw-rounded-lg' key={field.id}>
                      <div className='tw-absolute tw-right-0 tw-top-0 tw-translate-x-1/2 -tw-translate-y-1/2 tw-z-20'>
                        <Chip color='danger' variant='solid' onClick={() => remove(index)} size='md'>
                          <MdDeleteOutline className='tw-text-[18px]' />
                        </Chip>
                      </div>
                      <RHFImageUploadPreview<InsertWantedPostDataType>
                        control={control}
                        name={`assets.${index}`}
                        ratio='1/1'
                      />
                    </div>
                  );
                })}
                <Button variant='outlined' onClick={() => append(undefined)} disabled={loading}>
                  Thêm ảnh
                </Button>
              </div>
            </div>
          </main>

          <footer className='tw-mt-[24px] tw-flex tw-justify-stretch'>
            <Button
              color='primary'
              variant='solid'
              size='lg'
              disabled={!isValid || loading}
              loading={loading}
              type='submit'
              fullWidth
            >
              {mode === 'create' ? 'Đăng tải bài viết' : 'Lưu thay đổi'}
            </Button>
          </footer>
        </form>
        {/* <DevTool control={control} /> */}
      </FormProvider>
    </div>
  );
};

export default WantedPostPage;
