//sweetalert
s_alert = (type, icon, notice)=>{
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000
    });

   if(type== 'success'){
      Toast.fire({
        icon: icon,
        title:notice
      })
    }
  if(type== 'info'){
        Toast.fire({
          icon: icon,
          title:notice
        })
      }
  else if(type== 'error'){
        Toast.fire({
          icon: icon,
          title:notice
        })
      }
  else if(type== 'warning'){
        Toast.fire({
          icon: icon,
          title:notice
        })
      }
  else{
        Toast.fire({
          icon: icon,
          title:notice
        })
  }
}

//sweetalert
toast = (type, notice)=>{
  if(type== 'info'){
      toastr.info(notice)
      }
  else if(type== 'error'){
      toastr.error(notice)
      }
  else if(type== 'warning'){
      toastr.warning(notice)
      }
  else{
      toastr.success(notice)
  }
}