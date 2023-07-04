import { HiOutlineVideoCamera } from 'react-icons/hi2'
import { RiGalleryFill } from 'react-icons/ri'

const AssetsAPI = [
    {
        id: 1,
        Image: '../../../public/Assets/video1.png',
        icon: <HiOutlineVideoCamera className='bg-primary text-white text-3xl p-3 rounded-full min-w-[60px] min-h-[60px] border-4 border-white border-solid shadow-primary  hover:bg-SlateBlue cursor-pointer' />,
        category: 'video'
    },
    {
        id: 2,
        Image: '../../../public/Assets/video2.png',
        icon: <HiOutlineVideoCamera className='bg-primary text-white text-3xl p-3 rounded-full min-w-[60px] min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer ' />,
        category: 'video'
    },
    {
        id: 3,
        Image: '../../../public/Assets/video3.png',
        icon: <HiOutlineVideoCamera className='bg-primary text-white text-3xl p-3 rounded-full min-w-[60px] min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer ' />,
        category: 'video'
    },
    {
        id: 4,
        Image: '../../../public/Assets/image83.png',
        icon: <RiGalleryFill className='bg-primary text-white text-3xl p-3 rounded-full min-w-[60px] min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer ' />,
        title: 'Purchase Securely',
        subtitle: 'Image',
        category: 'image'
    },
    {
        id: 5,
        Image: '../../../public/Assets/image84.png',
        icon: <RiGalleryFill className='bg-primary text-white text-3xl p-3 rounded-full min-w-[60px] min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer ' />,
        title: 'Purchase Securely',
        subtitle: 'Image',
        category: 'image'
    },
    {
        id: 6,
        Image: '../../../public/Assets/image86.png',
        icon: <RiGalleryFill className='bg-primary text-white text-3xl p-3 rounded-full min-w-[60px] min-h-[60px] border-4 border-white border-solid shadow-primary hover:bg-SlateBlue cursor-pointer ' />,
        title: 'Purchase Securely',
        subtitle: 'Image',
        category: 'image'
    },
]
export default AssetsAPI