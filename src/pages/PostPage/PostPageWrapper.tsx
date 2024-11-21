import { Outlet } from 'react-router-dom';

const PostPageWrapper = () => {
  return (
    <div className='PostPageWrapper tw-bg-backgroundColor tw-flex tw-justify-center tw-min-h-dvh tw-items-start'>
      <Outlet />
    </div>
  );
};

export default PostPageWrapper;
