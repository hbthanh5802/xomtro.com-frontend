import { FormControl, FormHelperText, FormLabel, List, ListItem, Radio, RadioGroup } from '@mui/joy';
import { ReactNode, useId } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
// import { GoHome } from 'react-icons/go';
import { MdOutlineInfo } from 'react-icons/md';
// import { TbHomeSearch } from 'react-icons/tb';

interface RHFRoleChoicesProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  disable?: boolean;
}

const roleChoices = [
  {
    label: 'Người cho thuê',
    value: 'landlord',
    description: 'Nếu bạn có nhu cầu đăng bài cho thuê trọ.',
    // icon: <GoHome />,
  },
  {
    label: 'Người thuê',
    value: 'renter',
    description: 'Nếu bạn có nhu cầu tìm phòng trọ, tìm người ở ghép, pass đồ.',
    // icon: <TbHomeSearch />,
  },
];

const RHFRoleChoices = <T extends FieldValues>(props: RHFRoleChoicesProps<T>) => {
  const roleId = useId();
  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field, fieldState }) => {
          return (
            <>
              <FormControl error={!!fieldState.error}>
                <FormLabel>{props.label}</FormLabel>
                <RadioGroup name={props.name} onChange={field.onChange} value={field.value || null}>
                  <List
                    sx={{
                      minWidth: 240,
                      '--List-gap': '0.5rem',
                      '--ListItem-paddingY': '1rem',
                      '--ListItem-radius': '8px',
                      '--ListItemDecorator-size': '32px',
                    }}
                  >
                    {roleChoices.map((roleItem, index) => {
                      const { label, value, description } = roleItem;
                      return (
                        <ListItem variant='outlined' key={`${roleId + index}`} sx={{ boxShadow: 'sm' }}>
                          {/* <ListItemDecorator>{icon}</ListItemDecorator> */}
                          <Radio
                            overlay
                            value={value}
                            label={
                              <div className=''>
                                {label}
                                <FormHelperText id={`${roleId + index}`}>{description}</FormHelperText>
                              </div>
                            }
                            sx={{ flexGrow: 1, flexDirection: 'row' }}
                            slotProps={{
                              input: { 'aria-describedby': `${roleId + index}` },
                              action: ({ checked }) => ({
                                sx: (theme) => ({
                                  ...(checked && {
                                    inset: -1,
                                    border: '2px solid',
                                    borderColor: theme.vars.palette.primary[500],
                                  }),
                                }),
                              }),
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </RadioGroup>
                {!!fieldState.error && (
                  <FormHelperText>
                    <MdOutlineInfo />
                    {fieldState.error?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </>
          );
        }}
      />
    </>
  );
};

export default RHFRoleChoices;
