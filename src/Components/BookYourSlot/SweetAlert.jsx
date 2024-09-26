import Swal from 'sweetalert2';

const SweetAlert = {
    success: (message) => {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: message,
            timer: 3000,
            showConfirmButton: false,
        });
    },
    error: (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            timer: 3000,
            showConfirmButton: false,
        });
    },
    confirm: async (title, text, Yes) => {
      
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes ${Yes === null ? '' : ', delete it!'} `,
        });
    },
};

export default SweetAlert;
