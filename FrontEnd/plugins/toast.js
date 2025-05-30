import Vue from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  draggable: true,
  draggablePercent: 0.62,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: false,
  rtl: false,
  toastDefaults: {
    success: {
      style: {
        minWidth: '100px',
        minHeight: '30px',
        padding: '10px 22px',
        borderRadius: '5px',
      },
    },
    error: {
      style: {
        minWidth: '100px',
        minHeight: '30px',
        padding: '10px 22px',
        borderRadius: '5px',
      },
    }
  },
}

Vue.use(Toast, options)