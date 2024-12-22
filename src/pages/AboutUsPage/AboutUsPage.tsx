import { Typography } from '@mui/joy';
import { GoGoal } from 'react-icons/go';

const AboutUsPage = () => {
  return (
    <div className='background-pattern'>
      <div className='tw-container tw-rounded tw-shadow-sm tw-bg-white/30 tw-backdrop-blur-sm tw-mx-auto tw-p-[40px] tw-my-[24px]'>
        <section>
          <h2 className='tw-animate-slidein tw-opacity-0 [--slidein-delay:0ms] tw-font-writing tw-text-[40px] tw-text-center tw-text-primaryColor'>
            Xóm Trọ
          </h2>
        </section>

        <section className='tw-animate-slidein tw-opacity-0 [--slidein-delay:300ms] tw-space-y-2 tw-mt-6'>
          <Typography level='title-lg'>Giới Thiệu Về Bản Thân</Typography>
          <Typography style={{ textIndent: '2em' }} level='body-md'>
            Xin chào, tôi là{' '}
            <Typography level='title-md' color='danger' variant='soft'>
              Hoàng Bá Thanh
            </Typography>
            , sinh viên ngành <Typography level='title-md'>Công Nghệ Đa Phương Tiện</Typography> tại{' '}
            <Typography level='title-md'>
              , sinh viên ngành <Typography level='title-md'>Công Nghệ Đa Phương Tiện</Typography> tại Học viện Công
              nghệ Bưu chính Viễn thông , sinh viên ngành{' '}
              <Typography level='title-md'>Công Nghệ Đa Phương Tiện</Typography> tại{' '}
            </Typography>
            . Là một người yêu thích công nghệ và mong muốn tạo ra giá trị thực tế, tôi luôn tìm cách biến những ý tưởng
            thành giải pháp hữu ích cho cuộc sống.
          </Typography>
          <Typography style={{ textIndent: '2em' }} level='body-md'>
            Dự án tốt nghiệp của tôi,{' '}
            <Typography level='title-md' color='primary' variant='soft'>
              “Xây dựng hệ thống website chia sẻ và tìm kiếm phòng trọ tại Việt Nam”
            </Typography>
            , xuất phát từ chính nhu cầu và trải nghiệm cá nhân. Tôi hiểu rằng việc tìm kiếm một nơi ở phù hợp là vấn đề
            không nhỏ với các bạn sinh viên, đặc biệt là khi phải cân nhắc nhiều yếu tố như giá cả, vị trí hay chất
            lượng phòng trọ.
          </Typography>
        </section>

        <section className='tw-animate-slidein tw-opacity-0 [--slidein-delay:500ms] tw-space-y-2 tw-mt-6'>
          <Typography level='title-lg'>Nguồn Cảm Hứng</Typography>
          <Typography style={{ textIndent: '2em' }} level='body-md'>
            Trong những năm học đại học, tôi thường xuyên gặp khó khăn khi tìm kiếm phòng trọ, phải dò dẫm qua nhiều
            nguồn thông tin rời rạc, không rõ ràng. Từ đó, tôi nhận ra rằng cần có một nền tảng đáng tin cậy, hỗ trợ
            người dùng tìm kiếm dễ dàng và hiệu quả hơn. Đó là lý do tôi thực hiện dự án này – để tạo ra một hệ thống
            giúp{' '}
            <Typography color='neutral' variant='soft'>
              sinh viên
            </Typography>{' '}
            và{' '}
            <Typography color='neutral' variant='soft'>
              những người đi thuê phòng trọ
            </Typography>{' '}
            tiếp cận thông tin{' '}
            <Typography color='success' variant='soft'>
              nhanh chóng
            </Typography>
            ,{' '}
            <Typography color='success' variant='soft'>
              minh bạch
            </Typography>{' '}
            và
            <Typography color='success' variant='soft'>
              {' '}
              tiết kiệm thời gian hơn.
            </Typography>
          </Typography>
        </section>

        <section className='tw-animate-slidein tw-opacity-0 [--slidein-delay:700ms] tw-space-y-2 tw-mt-6'>
          <Typography level='title-lg'>Sứ Mệnh</Typography>
          <Typography level='body-md'>
            Hệ thống không chỉ tập trung vào việc đáp ứng nhu cầu cơ bản mà còn hướng đến việc:
          </Typography>
          <div className='tw-ml-6 tw-space-y-2'>
            <div className='tw-flex tw-gap-1'>
              <span className='tw-pt-1'>
                <GoGoal className='tw-text-primaryColor' />
              </span>
              <Typography level='body-md'>
                <Typography level='title-md'>Hỗ trợ sinh viên</Typography>: Cung cấp các công cụ tìm kiếm và bộ lọc chi
                tiết, giúp các bạn dễ dàng tìm được nơi ở phù hợp với nhu cầu và tài chính.
              </Typography>
            </div>
            <div className='tw-flex tw-gap-1'>
              <span className='tw-pt-1'>
                <GoGoal className='tw-text-primaryColor' />
              </span>
              <Typography level='body-md'>
                <Typography level='title-md'>Kết nối cộng đồng</Typography>: Là cầu nối giữa người cho thuê và người
                thuê, giúp việc trao đồi diễn ra nhanh chóng, tiện lợi.
              </Typography>
            </div>
            <div className='tw-flex tw-gap-1'>
              <span className='tw-pt-1'>
                <GoGoal className='tw-text-primaryColor' />
              </span>
              <Typography level='body-md'>
                <Typography level='title-md'>Nâng cao trải nghiệm</Typography>: Đảm bảo thông tin được trình bày rõ
                ràng, dễ sử dụng và an toàn cho tất cả người dùng.
              </Typography>
            </div>
          </div>
        </section>

        <section className='tw-animate-slidein tw-opacity-0 [--slidein-delay:1000ms] tw-space-y-2 tw-mt-6'>
          <Typography level='title-lg'>Cảm Ơn Và Định Hướng Tương Lai</Typography>
          <Typography style={{ textIndent: '2em' }} level='body-md'>
            Tôi muốn gửi lời cảm ơn đến thầy <Typography level='title-md'>ThS. Hà Đình Dũng</Typography>, người đã luôn
            hướng dẫn, đồng hành và giúp tôi hoàn thiện dự án này. Cảm ơn gia đình, bạn bè và các thầy cô trong Học viện
            đã hỗ trợ tôi trong suốt quá trình thực hiện đề tài.
          </Typography>
          <Typography style={{ textIndent: '2em' }} level='body-md'>
            Hệ thống này là bước khởi đầu, và tôi hy vọng có thể tiếp tục phát triển thêm nhiều tính năng, ứng dụng các
            công nghệ hiện đại để hệ thống ngày càng hoàn thiện hơn.
          </Typography>
          <Typography style={{ textIndent: '2em' }} level='body-md'>
            Nếu bạn đang đọc những dòng này, tôi rất mong nhận được góp ý, chia sẻ từ bạn để dự án có thể phục vụ tốt
            hơn cho cộng đồng. Cùng nhau, chúng ta có thể xây dựng một nền tảng hữu ích và ý nghĩa hơn.
          </Typography>
        </section>

        <section className='tw-animate-slidein tw-opacity-0 [--slidein-delay:1200ms] tw-mt-12 tw-flex'>
          <div className='tw-ml-auto tw-text-center tw-px-8'>
            <Typography level='title-md'>Trân trọng</Typography>
            <p className='tw-font-writing tw-text-[24px]'>Thanh</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
