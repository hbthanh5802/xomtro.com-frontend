/* eslint-disable @typescript-eslint/no-explicit-any */
import RHFCurrencyInput from '@/components/RHFCurrencyInput';
import RHFImageUploadPreview from '@/components/RHFImageUploadPreview';
import RHFInput from '@/components/RHFInput';
import RHFNumberInput from '@/components/RHFNumberInput';
import RHFRichText from '@/components/RHFRichText';
import RHFSelect from '@/components/RHFSelect';
import RHFTextArea from '@/components/RHFTextArea';
import useUrl from '@/hooks/useUrl.hook';
import locationService from '@/services/location.service';
import postService from '@/services/post.service';
import { useAppStore } from '@/store/store';
import { SelectOptionItemType } from '@/types/common.type';
import { InsertPassPostDataType, InsertPassPostItemDataType } from '@/types/post.type';
import { AssetSelectSchemaType, PassPostItemSelectSchemaType, PostSelectSchemaType } from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { insertPassPostValidation } from '@/validations/post.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AspectRatio, Button, Chip, Divider, Typography } from '@mui/joy';
import React from 'react';
import { Control, FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';
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

interface AddressPostFormProps {
  control: Control<InsertPassPostDataType>;
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
        <RHFSelect<InsertPassPostDataType>
          disabled={!provinceOptions.length}
          name='addressProvince'
          control={control}
          label='Tỉnh/Thành phố'
          placeholder='Chọn Tỉnh/Thành phố'
          options={provinceOptions}
          required
        />

        <RHFSelect<InsertPassPostDataType>
          disabled={!districtOptions.length}
          name='addressDistrict'
          control={control}
          label='Quận/Huyện:'
          placeholder='Chọn Quận/Huyện'
          options={districtOptions}
          required
        />

        <RHFSelect<InsertPassPostDataType>
          disabled={!wardOptions.length}
          name='addressWard'
          control={control}
          label='Phường/Xã/Thị trấn:'
          placeholder='Chọn Phường/Xã/Thị trấn'
          options={wardOptions}
          required
        />
      </div>

      <RHFInput<InsertPassPostDataType>
        name='addressDetail'
        label='Thông tin chi tiết:'
        placeholder='Số nhà, ngõ, xóm, đường, phố... (nếu có)'
      />
    </div>
  );
}

const getPassPostItemList = (data: PassPostItemSelectSchemaType[]): InsertPassPostItemDataType[] => {
  if (!data.length) {
    return [];
  }
  return data.map((item) => ({
    passItemName: item.passItemName,
    passItemPrice: item.passItemPrice,
    passItemStatus: item.passItemStatus,
  }));
};

const JoinPostPage = () => {
  const navigate = useNavigate();
  const { params, state } = useUrl();
  const assetId = React.useId();
  const mode = params?.mode as 'create' | 'edit';
  const postData = state?.postData;
  const post: PostSelectSchemaType = mode === 'edit' && postData ? postData.post : null;
  const passItems = React.useMemo(
    () =>
      mode === 'edit' && postData
        ? getPassPostItemList(postData?.passItems)
        : [{ passItemName: '', passItemPrice: undefined, passItemStatus: undefined }],
    [postData, mode],
  );
  const assets: AssetSelectSchemaType[] = mode === 'edit' && postData ? postData.assets : [];
  const [assetList, setAssetList] = React.useState(() => (mode === 'edit' && assets ? assets : []));

  const [loading, setLoading] = React.useState(false);

  const defaultAddressCode = post?.addressCode?.split('-');

  const methods = useForm<InsertPassPostDataType>({
    defaultValues: {
      type: 'pass',
      title: mode === 'create' ? '' : post?.title,
      description: mode === 'create' ? '' : post?.description,
      expirationAfter: mode === 'create' ? null : post?.expirationAfter,
      expirationAfterUnit: mode === 'create' ? 'day' : post?.expirationAfterUnit,
      note: mode === 'create' ? undefined : post?.note,
      addressCode: mode === 'create' ? '' : post?.addressCode,
      addressProvince: mode === 'create' ? undefined : `${defaultAddressCode?.[0]}-${post?.addressProvince}`,
      addressDistrict: mode === 'create' ? undefined : `${defaultAddressCode?.[1]}-${post?.addressDistrict}`,
      addressWard: mode === 'create' ? undefined : `${defaultAddressCode?.[2]}-${post?.addressWard}`,
      addressDetail: mode === 'create' ? undefined : post?.addressDetail,
      passItems: passItems,
    },
    resolver: zodResolver(insertPassPostValidation),
  });
  const {
    control,
    formState: { isValid },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assets' as never,
  });
  const {
    fields: passItemFields,
    append: passItemAppend,
    remove: passItemRemove,
  } = useFieldArray({
    control,
    name: 'passItems' as never,
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

  const handleSubmitForm = async (data: InsertPassPostDataType) => {
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
      const postPayload: InsertPassPostDataType = {
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
          // Nếu là danh sách file
          value?.forEach((file: any) => {
            formData.append(key, file[0]);
          });
        } else if (key === 'passItems') {
          // Nếu là mảng object, stringify trước khi append
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          // Nếu là mảng (nhưng không phải FileList hay passItems)
          value.forEach((v: unknown) => formData.append(key, v as string));
        } else {
          // Các trường khác
          formData.append(key, value as string);
        }
      });
      // Gửi request
      if (mode === 'create') {
        await postService.createPassPost(formData as any);
      } else if (mode === 'edit') {
        await postService.updatePassPost(post.id, formData as any);
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
                  <RHFInput<InsertPassPostDataType>
                    name='title'
                    label='Tiêu đề:'
                    placeholder='Nhập tiêu đề bài viết...'
                    required
                  />
                  {/* Description */}
                  <RHFRichText<InsertPassPostDataType>
                    control={control}
                    name='description'
                    label='Mô tả thêm:'
                    placeholder='Hãy viết thêm mô tả cho bài viết...'
                  />
                  {/* Expiration time */}
                  <div className='tw-space-y-2'>
                    <div className='tw-flex tw-flex-col tablet:tw-flex-row tablet:tw-items-center tw-gap-2'>
                      <RHFNumberInput<InsertPassPostDataType>
                        name='expirationAfter'
                        label='Ẩn bài viết sau:'
                        placeholder='Vd: 2'
                        min={0}
                      />
                      <RHFSelect<InsertPassPostDataType>
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
                  <RHFTextArea<InsertPassPostDataType>
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
                      Thông tin về đồ pass lại:
                    </Typography>
                  </div>
                </Divider>
                <div className='tw-space-y-4'>
                  {/* Price */}
                  {passItemFields.map((field, index) => {
                    return (
                      <div key={field.id}>
                        <Divider>
                          <Chip variant='plain'>Đồ thứ {index + 1}</Chip>
                          {index !== 0 && (
                            <Chip
                              color='danger'
                              variant='solid'
                              size='sm'
                              sx={{ marginLeft: 1 }}
                              onClick={() => passItemRemove(index)}
                            >
                              Xoá
                            </Chip>
                          )}
                        </Divider>
                        <div className='tw-grid tw-grid-cols-1 tablet:tw-grid-cols-3 tw-gap-2'>
                          <div className=''>
                            <RHFInput<InsertPassPostDataType>
                              name={`passItems.${index}.passItemName`}
                              required
                              label='Tên'
                              placeholder='Tên...'
                            />
                          </div>
                          <div className=''>
                            <RHFCurrencyInput<InsertPassPostDataType>
                              startDecorator={'VNĐ'}
                              name={`passItems.${index}.passItemPrice`}
                              label='Giá pass lại:'
                              placeholder='Giá...'
                              required
                            />
                          </div>
                          <div className=''>
                            <RHFSelect<InsertPassPostDataType>
                              control={control}
                              label='TÌnh trạng:'
                              name={`passItems.${index}.passItemStatus`}
                              options={[
                                { label: 'Còn mới', value: 'new' },
                                { label: 'Đã qua sử dụng', value: 'used' },
                              ]}
                              required
                              placeholder='Tình trạng...'
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    disabled={loading}
                    fullWidth
                    onClick={() =>
                      passItemAppend({ passItemName: '', passItemPrice: undefined, passItemStatus: 'used' })
                    }
                  >
                    Thêm đồ pass
                  </Button>
                </div>
              </div>
            </div>
            {/* Address */}
            <div className='tw-mt-[24px]'>
              <Divider sx={{ '--Divider-childPosition': `${0}%`, margin: '8px 0 8px 0' }}>
                <div className='tw-inline-flex tw-items-center tw-gap-2'>
                  <Typography variant='plain' color='primary' level='title-sm'>
                    Thông tin địa chỉ nhận
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
                      <RHFImageUploadPreview<InsertPassPostDataType>
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

export default JoinPostPage;
